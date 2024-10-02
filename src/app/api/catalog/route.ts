import { Client, Environment, CatalogObject } from "square";
import { NextResponse } from "next/server";

interface ProcessedItem {
  id: string;
  name?: string | null;
  brand?: string | null;
  description?: string | null;
  price?: string | null;
  city?: string | null;
  abv?: string | null;
  categoryIds: string[];
  locationIds: string[];
}

interface CategoryWithItems {
  id: string;
  name?: string | null;
  items: ProcessedItem[];
}

interface MenuStructure {
  [categoryName: string]: ProcessedItem[];
}

export async function GET() {
  try {
    const client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: Environment.Production,
    });

    // Fetch locations
    const locationsResponse = await client.locationsApi.listLocations();
    //console.log("Locations:");
    /*
    locationsResponse.result.locations?.forEach((location) => {
      console.log(
        `ID: ${location.id}, Name: ${location.name}, Status: ${location.status}`,
      );
    });
*/

    const response = await client.catalogApi.listCatalog(
      undefined,
      "ITEM,CATEGORY,ITEM_VARIATION",
    );

    const items =
      response.result.objects?.filter(
        (obj): obj is CatalogObject => obj.type === "ITEM",
      ) || [];

    console.log("Items present at location 'Legend Has It':");
    items.forEach((item) => {
      //console.log(`ID: ${item.id}, Name: ${item.itemData?.name}`);
      let variations = item.itemData?.variations;
      if (variations?.length !== null) {
        // console.log(variations?.customAttributeValues?.name);
      }
      console.log("* * * * * * * * * * * *");
    });

    const categories =
      response.result.objects?.filter(
        (obj): obj is CatalogObject =>
          obj.type === "CATEGORY" &&
          obj.categoryData?.categoryType === "MENU_CATEGORY" &&
          obj.categoryData?.name !== "Merchandise" &&
          obj.categoryData?.name !== "Bar Menu",
      ) || [];

    const categoryMap = new Map<string, CategoryWithItems>();
    categories.forEach((category) => {
      if (category.id) {
        categoryMap.set(category.id, {
          id: category.id,
          name: category.categoryData?.name,
          items: [],
        });
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

      return {
        id: item.id,
        name: item.itemData?.name?.split("-")[0],
        brand: item.itemData?.name?.split("-")[1],
        description: item.itemData?.description,
        price: variation?.itemVariationData?.priceMoney?.amount
          ? `$${(Number(variation.itemVariationData.priceMoney.amount) / 100).toFixed(2)}`
          : undefined,
        abv,
        city,
        categoryIds:
          item.itemData?.categories?.map((cat) => cat.id ?? "") || [],
        locationIds: item.presentAtLocationIds || [],
      };
    });

    processedItems.forEach((item) => {
      item.categoryIds.forEach((categoryId) => {
        if (
          categoryMap.has(categoryId) &&
          item.locationIds.includes("L3Y8KW155RG0B")
        ) {
          categoryMap.get(categoryId)?.items.push(item);
          //console.log(item);
        }
      });
    });

    const menuStructure: MenuStructure = {};
    categoryMap.forEach((category) => {
      if (category.name) {
        const sortedItems = category.items.sort((a, b) => {
          const brandA = a.brand?.toLowerCase() ?? "";
          const brandB = b.brand?.toLowerCase() ?? "";
          return brandA.localeCompare(brandB);
        });
        menuStructure[category.name] = sortedItems;
      }
    });

    return NextResponse.json(menuStructure);
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
