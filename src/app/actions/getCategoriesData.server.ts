import Categories from "@/models/MenuCategories";
import { connectToMongoDB } from "@/lib/db";
import { CategoriesData } from "@/data/menu-categories";

export async function getCategoriesData(): Promise<CategoriesData> {
  try {
    await connectToMongoDB();

    const categories = await Categories.find({});

    //console.log(categories);

    if (!categories) {
      return {
        parentCategories: [],
        childCategories: [],
      };
    }

    const parentCategories: string[] = categories[0].categories;
    const childCategories: string[] = categories[1].categories;

    return {
      parentCategories: parentCategories,
      childCategories: childCategories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
