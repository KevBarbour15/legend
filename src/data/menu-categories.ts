import * as z from "zod";

export const parentFormSchema = z.object({
  title: z.string().min(1, "Category name is required"),
  type: z.literal("parent"),
});

export const childFormSchema = z.object({
  title: z.string().min(1, "Subcategory name is required"),
  type: z.literal("child"),
});

export interface CategoryRequest {
  title: string;
}

export interface CategoriesData {
  parentCategories: string[];
  childCategories: string[];
}

export interface UpdateCategoriesData {
  categories: string[];
}
