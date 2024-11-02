import { NextRequest, NextResponse } from "next/server";
import CategoriesType from "@/models/MenuCategories";
import { connectToMongoDB } from "@/lib/db";
import { getCategoriesData } from "@/app/actions/getCategoriesData.server.ts";
import { CategoryRequest } from "@/data/menu-categories";

export async function POST(req: NextRequest) {
  try {
    await connectToMongoDB();

    const body = await req.json();
    const { title, type } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );
    }

    if (type === "parent") {
      return addParentCategory({ title });
    } else if (type === "child") {
      return addChildCategory({ title });
    } else {
      return NextResponse.json(
        { error: "Invalid category type" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}

export async function addParentCategory({ title }: CategoryRequest) {
  try {
    if (!title) {
      return NextResponse.json(
        { error: "Title is required!" },
        { status: 400 },
      );
    }

    let category = await CategoriesType.findOne({ title: "parentCategory" });

    if (!category) {
      category = await CategoriesType.create({
        title: "parentCategory",
        categories: [],
      });
    }

    const response = await CategoriesType.findOneAndUpdate(
      { title: "parentCategory" },
      { $addToSet: { categories: title.trim() } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!response) {
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Parent category successfully added.",
        categories: response.parentCategories,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding parent category:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}

export async function addChildCategory({ title }: CategoryRequest) {
  try {
    if (!title) {
      return NextResponse.json(
        { error: "Title is required!" },
        { status: 400 },
      );
    }

    let category = await CategoriesType.findOne({ title: "childCategory" });

    if (!category) {
      category = await CategoriesType.create({
        title: "childCategory",
        categories: [],
      });
    }

    const response = await CategoriesType.findOneAndUpdate(
      { title: "childCategory" },
      { $addToSet: { categories: title.trim() } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!response) {
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Child category successfully added.",
        categories: response.childCategories,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding child category:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToMongoDB();
    const categories = await getCategoriesData();

    console.log("Categories:", categories);

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error in GET categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToMongoDB();

    const body = await req.json();
    const { title, type } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 },
      );
    }

    if (type !== "parent" && type !== "child") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'parent' or 'child'" },
        { status: 400 },
      );
    }

    const category = type === "parent" ? "parentCategories" : "childCategories";

    const response = await CategoriesType.findOneAndDelete(
      {},
      { category: title },
    );

    console.log(response);

    if (!response) {
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json("Successfully deleted.", { status: 200 });
  } catch (error) {
    console.error("Failed to delete category.", error);
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 },
    );
  }
}
