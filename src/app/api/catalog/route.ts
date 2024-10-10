import { Client, Environment, CatalogObject } from "square";
import { NextResponse } from "next/server";

import { MenuStructure, CategoryWithItems, ProcessedItem } from "@/types.ts";

import { getItemBrand, getItemName } from "@/utils/getItemInfo";

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

    const items =
      response.result.objects?.filter(
        (obj): obj is CatalogObject => obj.type === "ITEM",
      ) || [];

    console.log(items[1]);

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
        locationIds: ["L3Y8KW155RG0B"],
      });
    inventoryCounts = inventoryResponse.result?.counts || [];

    // Create a map of variation IDs to inventory counts
    const inventoryMap = new Map(
      inventoryCounts.map((count) => [
        count.catalogObjectId,
        parseInt(count.quantity || "0"),
      ]),
    );

    //console.log(inventoryMap);

    const categories =
      response.result.objects?.filter(
        (obj): obj is CatalogObject =>
          obj.type === "CATEGORY" &&
          obj.categoryData?.categoryType === "REGULAR_CATEGORY" &&
          obj.categoryData?.name !== "Merchandise" &&
          obj.categoryData?.name !== "Bar Menu",
      ) || [];

    const categoryMap = new Map<string, CategoryWithItems>();
    const childCategoryMap = new Map<string, CategoryWithItems>();

    const excludedCategories: string[] = [
      "Lagers, Pilsners, Kolsch",
      "IPAs",
      "Seltzers and Ciders",
      "Sours and Stouts",
    ];

    categories.forEach((category) => {
      if (category.id) {
        const categoryData = {
          id: category.id,
          name: category.categoryData?.name,
          items: [],
          childCategories: [],
        };

        if (excludedCategories.includes(category.categoryData?.name || "")) {
          childCategoryMap.set(category.id, categoryData);
        } else {
          categoryMap.set(category.id, categoryData);
        }
      }
    });

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

    const cannedBottledBeerId: string = "RTQX7QKR7THOLQWVJABI5DVF";

    processedItems.forEach((item) => {
      item.categoryIds.forEach((categoryId) => {
        if (
          childCategoryMap.has(categoryId) &&
          item.locationIds.includes("L3Y8KW155RG0B") &&
          item.categoryIds.includes(cannedBottledBeerId) &&
          item.inStock
        ) {
          childCategoryMap.get(categoryId)?.items.push(item);
        } else if (
          categoryMap.has(categoryId) &&
          item.locationIds.includes("L3Y8KW155RG0B") &&
          !item.categoryIds.includes(cannedBottledBeerId) &&
          item.inStock
        ) {
          categoryMap.get(categoryId)?.items.push(item);
        }
      });
    });

    const menuStructure: MenuStructure = {};

    const orderedCategories = [
      "Draft",
      "Canned / Bottled",
      "Wine",
      "Non Alcoholic",
    ];

    orderedCategories.forEach((categoryName) => {
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
        } else if (orderedCategories.includes(category.name)) {
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
    orderedCategories.forEach((categoryName) => {
      if (menuStructure[categoryName]) {
        orderedMenuStructure[categoryName] = menuStructure[categoryName];
      }
    });
    console.log("Updated menu structure at " + new Date().toISOString());
    return NextResponse.json(orderedMenuStructure, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json(
      {
        error: "Error fetching catalog",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
