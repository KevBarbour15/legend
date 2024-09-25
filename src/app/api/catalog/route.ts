import { Client, Environment, CatalogObject } from "square";
import { NextResponse } from "next/server";

interface ProcessedItem {
  id: string;
  name?: string | null;
  description?: string | null;
  price?: string | null;
  categoryIds: string[];
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

    const response = await client.catalogApi.listCatalog(
      undefined,
      "ITEM,CATEGORY",
    );

    const items =
      response.result.objects?.filter(
        (obj): obj is CatalogObject => obj.type === "ITEM",
      ) || [];

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

    const processedItems: ProcessedItem[] = items.map(
      (item): ProcessedItem => ({
        id: item.id,
        name: item.itemData?.name,
        description: item.itemData?.description,
        price: item.itemData?.variations?.[0]?.itemVariationData?.priceMoney
          ?.amount
          ? `$${(Number(item.itemData.variations[0].itemVariationData.priceMoney.amount) / 100).toFixed(2)}`
          : undefined,
        categoryIds:
          item.itemData?.categories?.map((cat) => cat.id ?? "") || [],
      }),
    );

    processedItems.forEach((item) => {
      item.categoryIds.forEach((categoryId) => {
        if (categoryMap.has(categoryId)) {
          categoryMap.get(categoryId)?.items.push(item);
        }
      });
    });

    const menuStructure: MenuStructure = {};
    categoryMap.forEach((category) => {
      if (category.name) {
        menuStructure[category.name] = category.items;
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
