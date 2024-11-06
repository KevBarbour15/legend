import { Client, Environment, CatalogObject, InventoryCount } from "square";
import { NextResponse } from "next/server";

import { saveFallbackMenu } from "@/app/actions/saveFallbackMenu.server";
import { getFallbackMenu } from "@/app/actions/getFallbackMenu.server";
import { getCategoriesData } from "@/app/actions/getCategoriesData.server.ts";

import { MenuStructure, CategoryWithItems, ProcessedItem } from "@/data/menu";

import {
  CANNED_BOTTLED_BEER_ID,
  BAR_INVENTORY_LOCATION_ID,
} from "@/config/menu";

import { getItemBrand, getItemName } from "@/utils/getItemInfo";
import { compareCategories } from "@/utils/compareCategories";

// Force dynamic rendering and disable caching for this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Track category hierarchies and relationships
let parentCategories: string[] = [];
let childCategories: string[] = [];
let allCategories: string[] = [];
let parentName: string | null = null;

// Main API handler for GET requests
export async function GET() {
  try {
    // Initialize Square client
    const client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: Environment.Production,
    });

    const allObjects = await fetchAllCatalogObjects(client);
    const categories = filterCategories(allObjects);

    const data = await getCategoriesData();

    parentCategories = data.parentCategories;
    childCategories = data.childCategories;
    parentName = data.parentName;

    if (
      parentCategories.length === 0 ||
      childCategories.length === 0 ||
      !parentName
    ) {
      console.log("Error 1");
      return await handleCategoryMismatch();
    }

    allCategories = [...parentCategories, ...childCategories];
    console.log(allCategories);
    if (!validateCategories(categories)) {
      console.log("Error 2");
      return await handleCategoryMismatch();
    }

    const { categoryMap, childCategoryMap } = createCategoryMaps(categories);

    const items = allObjects.filter(
      (obj): obj is CatalogObject => obj.type === "ITEM",
    );
    const inventoryMap = await fetchInventory(client, items);
    const processedItems = processItems(items, inventoryMap);

    assignItemsToCategories(processedItems, categoryMap, childCategoryMap);
    const menuStructure = createMenuStructure(categoryMap, childCategoryMap);
    const orderedMenuStructure = orderMenuStructure(menuStructure);

    await saveFallbackMenu(orderedMenuStructure);

    return NextResponse.json(orderedMenuStructure, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
        "X-Response-Time": new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 },
    );
  }
}

// Helper Functions *************************************************************

// Fetches all catalog objects from Square API with pagination
async function fetchAllCatalogObjects(
  client: Client,
): Promise<CatalogObject[]> {
  let allObjects: CatalogObject[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.catalogApi.listCatalog(
      cursor,
      "ITEM,CATEGORY,ITEM_VARIATION",
    );
    allObjects = allObjects.concat(response.result.objects || []);
    cursor = response.result.cursor;
  } while (cursor);

  return allObjects;
}

// Filters catalog objects to only include valid categories that match our predefined lists
function filterCategories(objects: CatalogObject[]): CatalogObject[] {
  return objects.filter(
    (obj): obj is CatalogObject =>
      obj.type === "CATEGORY" &&
      obj.categoryData?.categoryType === "REGULAR_CATEGORY" &&
      !!obj.categoryData?.name &&
      (parentCategories.includes(obj.categoryData.name) ||
        childCategories.includes(obj.categoryData.name)),
  );
}

// Ensures all required categories exist in Square's catalog
function validateCategories(categories: CatalogObject[]): boolean {
  const categoryNames = categories
    .map((category) => category.categoryData?.name)
    .filter((name): name is string => !!name);

  return compareCategories(categoryNames, allCategories);
}

// Fallback handler when category structure doesn't match expectations
async function handleCategoryMismatch() {
  console.error("Categories have changed. Please update the menu structure.");
  const fallbackMenu = await getFallbackMenu();

  if (fallbackMenu.success) {
    return NextResponse.json(fallbackMenu.menu, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
        "X-Response-Time": new Date().toISOString(),
      },
    });
  } else {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: "Failed to retrieve fallback menu.",
      },
      { status: 500 },
    );
  }
}

// Creates two maps: one for parent categories and one for child categories
function createCategoryMaps(categories: CatalogObject[]): {
  categoryMap: Map<string, CategoryWithItems>;
  childCategoryMap: Map<string, CategoryWithItems>;
} {
  const categoryMap = new Map<string, CategoryWithItems>();
  const childCategoryMap = new Map<string, CategoryWithItems>();

  categories.forEach((category) => {
    if (category.id && category.categoryData?.name) {
      const categoryData: CategoryWithItems = {
        id: category.id,
        name: category.categoryData.name,
        items: [],
        childCategories: [],
      };

      if (childCategories.includes(category.categoryData.name)) {
        childCategoryMap.set(category.id, categoryData);
      } else {
        categoryMap.set(category.id, categoryData);
      }
    }
  });

  return { categoryMap, childCategoryMap };
}

// Fetches inventory counts from Square API in batches
async function fetchInventory(
  client: Client,
  items: CatalogObject[],
): Promise<Map<string, number>> {
  const variationIds = items.flatMap(
    (item) =>
      item.itemData?.variations
        ?.map((variation) => variation.id)
        .filter((id): id is string => !!id) || [],
  );

  let allInventoryCounts: InventoryCount[] = [];
  let cursor: string | undefined;
  const batchSize = 100;

  do {
    const batchIds = variationIds.splice(0, batchSize);
    const inventoryResponse =
      await client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds: batchIds,
        locationIds: [BAR_INVENTORY_LOCATION_ID],
        cursor,
        states: ["IN_STOCK"],
      });

    allInventoryCounts = allInventoryCounts.concat(
      inventoryResponse.result.counts || [],
    );
    cursor = inventoryResponse.result.cursor;
  } while (cursor || variationIds.length > 0);

  return new Map(
    allInventoryCounts.map((count) => [
      count.catalogObjectId!,
      parseInt(count.quantity || "0"),
    ]),
  );
}

// Processes raw catalog items into a cleaner format with additional metadata
function processItems(
  items: CatalogObject[],
  inventoryMap: Map<string, number>,
): ProcessedItem[] {
  return items.map((item): ProcessedItem => {
    const variation = item.itemData?.variations?.[0];
    const customAttributes = variation?.customAttributeValues;
    let abv: string | undefined;
    let city: string | undefined;

    if (customAttributes) {
      Object.values(customAttributes).forEach((attr) => {
        if (attr.name === "ABV") {
          abv = attr.stringValue ?? undefined;
        } else if (attr.name === "City") {
          city = attr.stringValue ?? undefined;
        }
      });
    }

    const inventoryCount = variation?.id
      ? inventoryMap.get(variation.id)
      : undefined;

    return {
      id: item.id!,
      name: getItemName(item.itemData?.name),
      brand: getItemBrand(item.itemData?.name),
      description: item.itemData?.description,
      price: variation?.itemVariationData?.priceMoney?.amount
        ? `$${(Number(variation.itemVariationData.priceMoney.amount) / 100).toFixed(2)}`
        : undefined,
      abv,
      city,
      categoryIds: item.itemData?.categories?.map((cat) => cat.id ?? "") || [],
      locationIds: item.presentAtLocationIds || [],
      inStock: inventoryCount !== undefined ? inventoryCount > 0 : false,
    };
  });
}

// Assigns items to their respective categories based on business rules:
// 1. Canned/bottled beers go to child categories
// 2. Other items go to parent categories
// 3. Special case for "Kevin's Pale Ale" for testing
function assignItemsToCategories(
  items: ProcessedItem[],
  categoryMap: Map<string, CategoryWithItems>,
  childCategoryMap: Map<string, CategoryWithItems>,
) {
  items.forEach((item) => {
    item.categoryIds.forEach((categoryId) => {
      if (
        childCategoryMap.has(categoryId) &&
        item.locationIds.includes(BAR_INVENTORY_LOCATION_ID) &&
        item.categoryIds.includes(CANNED_BOTTLED_BEER_ID) &&
        item.inStock
      ) {
        childCategoryMap.get(categoryId)?.items.push(item);
      } else if (
        categoryMap.has(categoryId) &&
        item.locationIds.includes(BAR_INVENTORY_LOCATION_ID) &&
        !item.categoryIds.includes(CANNED_BOTTLED_BEER_ID) &&
        item.inStock
      ) {
        categoryMap.get(categoryId)?.items.push(item);
      } else if (
        // for testing purposes
        childCategoryMap.has(categoryId) &&
        item.name === "Kevin's Pale Ale" &&
        item.inStock
      ) {
        childCategoryMap.get(categoryId)?.items.push(item);
      }
    });
  });
}

// Creates the final menu structure with proper hierarchy:
// - Parent categories at the top level
// - Child categories nested under the designated parent
function createMenuStructure(
  categoryMap: Map<string, CategoryWithItems>,
  childCategoryMap: Map<string, CategoryWithItems>,
): MenuStructure {
  const menuStructure: MenuStructure = {};

  allCategories.forEach((categoryName) => {
    menuStructure[categoryName] = [];
  });

  childCategoryMap.forEach((category) => {
    category.items.sort((a, b) =>
      (a.brand?.toLowerCase() ?? "").localeCompare(
        b.brand?.toLowerCase() ?? "",
      ),
    );
  });

  categoryMap.forEach((category) => {
    if (category.name) {
      if (category.name === parentName) {
        menuStructure[category.name] = {
          id: category.id,
          name: category.name,
          items: [],
          childCategories: Array.from(childCategoryMap.values()).sort(
            (a, b) => {
              const indexA = childCategories.indexOf(a.name ?? "");
              const indexB = childCategories.indexOf(b.name ?? "");
              return indexA - indexB;
            },
          ),
        };
      } else if (parentCategories.includes(category.name)) {
        menuStructure[category.name] = category.items.sort((a, b) =>
          (a.brand?.toLowerCase() ?? "").localeCompare(
            b.brand?.toLowerCase() ?? "",
          ),
        );
      }
    }
  });

  return menuStructure;
}

// Ensures the final menu structure follows
function orderMenuStructure(menuStructure: MenuStructure): MenuStructure {
  const orderedMenuStructure: MenuStructure = {};
  parentCategories.forEach((categoryName) => {
    if (menuStructure[categoryName]) {
      orderedMenuStructure[categoryName] = menuStructure[categoryName];
    }
  });

  return orderedMenuStructure;
}
