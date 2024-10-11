import { Client, Environment, CatalogObject } from "square";
import { NextResponse } from "next/server";

import {
  MenuStructure,
  CategoryWithItems,
  ProcessedItem,
} from "@/types/menu.ts";

import {
  CURRENT_CATEGORIES,
  EXCLUDED_CATEGORIES,
  ORDERED_CATEGORIES,
  CANNED_BOTTLED_BEER_ID,
  BAR_INVENTORY_LOCATION_ID,
  FALLBACK_MENU_PATH,
} from "@/config/menu";

import { getItemBrand, getItemName } from "@/utils/getItemInfo";
import { compareCategories } from "@/utils/compareCategories";

import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: Environment.Production,
    });

    const response = await client.catalogApi.listCatalog(
      undefined,
      "ITEM,CATEGORY,ITEM_VARIATION",
    );

    const categories =
      response.result.objects?.filter(
        (obj): obj is CatalogObject =>
          obj.type === "CATEGORY" &&
          obj.categoryData?.categoryType === "REGULAR_CATEGORY" &&
          obj.categoryData?.name !== "Merchandise" &&
          obj.categoryData?.name !== "Sake and Soju" &&
          obj.categoryData?.name !== "Bar Menu",
      ) || [];

    /**
     * Check if the categories have changed.
     * If the categories have changed, log an error and return the fallback menu
     */
    const categoriesArr: string[] = [];

    categories.forEach((category) => {
      if (category.categoryData?.name) {
        categoriesArr.push(category.categoryData?.name);
      }
    });

    //console.log(categoriesArr);
    //console.log(CURRENT_CATEGORIES);

    if (!compareCategories(categoriesArr, CURRENT_CATEGORIES)) {
      console.error(
        "Categories have changed. Please update the menu structure.",
      );

      const fallbackData = await fs.readFile(FALLBACK_MENU_PATH, "utf8");
      const fallbackMenu = JSON.parse(fallbackData);

      return NextResponse.json(fallbackMenu, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          Pragma: "no-cache",
          "X-Response-Time": new Date().toISOString(),
        },
      });
    }

    const categoryMap = new Map<string, CategoryWithItems>();
    const childCategoryMap = new Map<string, CategoryWithItems>();

    categories.forEach((category) => {
      if (category.id) {
        const categoryData = {
          id: category.id,
          name: category.categoryData?.name,
          items: [],
          childCategories: [],
        };

        if (EXCLUDED_CATEGORIES.includes(category.categoryData?.name || "")) {
          childCategoryMap.set(category.id, categoryData);
        } else {
          categoryMap.set(category.id, categoryData);
        }
      }
    });

    const items =
      response.result.objects?.filter(
        (obj): obj is CatalogObject => obj.type === "ITEM",
      ) || [];

    const variationIds = items.flatMap(
      (item) =>
        item.itemData?.variations
          ?.map((variation) => variation.id)
          .filter((id): id is string => id !== undefined) || [],
    );

    let inventoryCounts = [];

    const inventoryResponse =
      await client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds: variationIds,
        locationIds: [BAR_INVENTORY_LOCATION_ID],
      });
    inventoryCounts = inventoryResponse.result?.counts || [];

    const inventoryMap = new Map(
      inventoryCounts.map((count) => [
        count.catalogObjectId,
        parseInt(count.quantity || "0"),
      ]),
    );

    const processedItems: ProcessedItem[] = items.map((item): ProcessedItem => {
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
        id: item.id,
        name: getItemName(item.itemData?.name),
        brand: getItemBrand(item.itemData?.name),
        description: item.itemData?.description,
        price: variation?.itemVariationData?.priceMoney?.amount
          ? `$${(Number(variation.itemVariationData.priceMoney.amount) / 100).toFixed(2)}`
          : undefined,
        abv,
        city,
        categoryIds:
          item.itemData?.categories?.map((cat) => cat.id ?? "") || [],
        locationIds: item.presentAtLocationIds || [],
        inStock: inventoryCount !== undefined ? inventoryCount > 0 : false,
      };
    });

    processedItems.forEach((item) => {
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
        }
      });
    });

    const menuStructure: MenuStructure = {};

    ORDERED_CATEGORIES.forEach((categoryName) => {
      menuStructure[categoryName] = [];
    });

    childCategoryMap.forEach((category) => {
      category.items.sort((a, b) => {
        const brandA = a.brand?.toLowerCase() ?? "";
        const brandB = b.brand?.toLowerCase() ?? "";
        return brandA.localeCompare(brandB);
      });
    });

    categoryMap.forEach((category) => {
      if (category.name) {
        if (category.name === "Canned / Bottled") {
          const cannedBeerCategory: CategoryWithItems = {
            id: category.id,
            name: category.name,
            items: [],
            childCategories: Array.from(childCategoryMap.values()),
          };
          menuStructure[category.name] = cannedBeerCategory;
        } else if (ORDERED_CATEGORIES.includes(category.name)) {
          const sortedItems = category.items.sort((a, b) => {
            const brandA = a.brand?.toLowerCase() ?? "";
            const brandB = b.brand?.toLowerCase() ?? "";
            return brandA.localeCompare(brandB);
          });
          menuStructure[category.name] = sortedItems;
        }
      }
    });

    const orderedMenuStructure: MenuStructure = {};

    ORDERED_CATEGORIES.forEach((categoryName) => {
      if (menuStructure[categoryName]) {
        orderedMenuStructure[categoryName] = menuStructure[categoryName];
      }
    });

    await fs.writeFile(
      FALLBACK_MENU_PATH,
      JSON.stringify(orderedMenuStructure, null, 2),
    );

    return NextResponse.json(orderedMenuStructure, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
        "X-Response-Time": new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    console.error(
      "Error details:",
      JSON.stringify(error, Object.getOwnPropertyNames(error)),
    );
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 },
    );
  }
}
