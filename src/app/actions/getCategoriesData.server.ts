import Categories from "@/models/MenuCategories";
import { connectToMongoDB } from "@/lib/db";
import { CategoriesData } from "@/data/menu-categories";

export async function getCategoriesData(): Promise<CategoriesData> {
  try {
    await connectToMongoDB();

    const categories = await Categories.findOne({});

    if (!categories) {
      return {
        parentCategories: [],
        childCategories: [],
      };
    }

    const parentCategories = categories.parentCategories;

    const childCategories = categories.childCategories;

    return {
      parentCategories: parentCategories,
      childCategories: childCategories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
