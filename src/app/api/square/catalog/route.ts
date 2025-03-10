import { Client, Environment, CatalogObject } from "square";
import { NextResponse } from "next/server";

import { saveMenu } from "@/app/actions/saveMenu.server";
import { getCategoriesData } from "@/app/actions/getCategoriesData.server.ts";

import { MenuStructure, CategoryWithItems, ProcessedItem } from "@/data/menu";

const CANNED_BOTTLED_BEER_ID = process.env.CANNED_BOTTLED_BEER_ID as string;
const BAR_INVENTORY_LOCATION_ID = process.env
  .BAR_INVENTORY_LOCATION_ID as string;

import { getItemBrand, getItemName } from "@/utils/getItemInfo";
import { compareCategories } from "@/utils/compareCategories";
import { connectToMongoDB } from "@/lib/db";

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
    await connectToMongoDB();
    console.log(CANNED_BOTTLED_BEER_ID);
    console.log(BAR_INVENTORY_LOCATION_ID);

    // Initialize Square client
    const client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: Environment.Production,
    });

    const allObjects = await fetchAllCatalogObjects(client);

    const data = await getCategoriesData();

    parentCategories = data.parentCategories;
    childCategories = data.childCategories;
    parentName = data.parentName;

    if (
      parentCategories.length === 0 ||
      childCategories.length === 0 ||
      !parentName
    ) {
      return NextResponse.json(
        { error: "Internal Server Error", details: "Categories not found." },
        { status: 500 },
      );
    }

    allCategories = [...parentCategories, ...childCategories];

    const categories = await filterCategories(allObjects);

    if (validateCategories(categories) === false) {
      console.error(
        "Categories have changed. Please update the menu structure.",
      );
      return NextResponse.json(
        {
          error: "Internal Server Error",
          details: "Categories have changed. Please update the menu structure",
        },
        { status: 500 },
      );
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

    await saveMenu(orderedMenuStructure);

    return NextResponse.json({
      success: true,
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
      undefined,
    );
    allObjects = allObjects.concat(response.result.objects || []);
    cursor = response.result.cursor;
  } while (cursor);

  return allObjects;
}

// Filters catalog objects to only include valid categories that match our predefined lists
async function filterCategories(
  objects: CatalogObject[],
): Promise<CatalogObject[]> {
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

  const batchSize = 100;
  const batches = [];

  for (let i = 0; i < variationIds.length; i += batchSize) {
    const batchIds = variationIds.slice(i, i + batchSize);
    batches.push(
      client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds: batchIds,
        locationIds: [BAR_INVENTORY_LOCATION_ID],
        states: ["IN_STOCK"],
      }),
    );
  }

  const responses = await Promise.all(batches);
  const allInventoryCounts = responses.flatMap(
    (response) => response.result.counts || [],
  );

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

    let bottleVariation = null;

    if (
      item.itemData?.variations?.[1] &&
      item.itemData?.variations?.[1].itemVariationData?.name === "Bottle"
    ) {
      bottleVariation = item.itemData?.variations?.[1];
    }

    const customAttributes = {
      ...item.customAttributeValues,
      ...variation?.customAttributeValues,
    };

    let abv: string | undefined;
    let city: string | undefined;
    let varieties: string | undefined;

    if (customAttributes) {
      Object.values(customAttributes).forEach((attr) => {
        if (attr.name === "ABV") {
          abv = attr.stringValue ?? undefined;
        } else if (attr.name === "City") {
          city = attr.stringValue ?? undefined;
        } else if (attr.name === "Varieties") {
          varieties = attr.stringValue ?? undefined;
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
      bottlePrice: bottleVariation?.itemVariationData?.priceMoney?.amount
        ? `$${(Number(bottleVariation.itemVariationData.priceMoney.amount) / 100).toFixed(2)}`
        : undefined,
      abv,
      city,
      varieties,
      categoryIds: item.itemData?.categories?.map((cat) => cat.id ?? "") || [],
      locationIds: item.presentAtLocationIds || [],
      inStock: inventoryCount !== undefined ? inventoryCount > 0 : false,
    };
  });
}

// Assigns items to their respective categories based on business rules:
// 1. Canned/bottled beers go to child categories
// 2. Other items go to parent categories
// 3. Ignores specific items
function assignItemsToCategories(
  items: ProcessedItem[],
  categoryMap: Map<string, CategoryWithItems>,
  childCategoryMap: Map<string, CategoryWithItems>,
) {
  items.forEach((item) => {
    // Skip Kevin's Pale Ale
    if (item.name === "Kevin's Pale Ale") {
      //console.log("Ignoring", item.name);
      return;
    }

    const isInLocation = item.locationIds.includes(BAR_INVENTORY_LOCATION_ID);
    const isCannedBottled = item.categoryIds.includes(CANNED_BOTTLED_BEER_ID);

    if (!isInLocation || !item.inStock) return;
    item.categoryIds.forEach((categoryId) => {
      if (childCategoryMap.has(categoryId) && isCannedBottled) {
        childCategoryMap.get(categoryId)?.items.push(item);
      } else if (categoryMap.has(categoryId) && !isCannedBottled) {
        categoryMap.get(categoryId)?.items.push(item);
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
