import { NextRequest, NextResponse } from "next/server";
import CategoriesType from "@/models/MenuCategories";
import { connectToMongoDB } from "@/lib/db";
import { getCategoriesData } from "@/app/actions/getCategoriesData.server.ts";
import { CategoryRequest, UpdateCategoriesData } from "@/data/menu-categories";

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

async function addParentCategory({ title }: CategoryRequest) {
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

async function addChildCategory({ title }: CategoryRequest) {
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

    const categoryTitle =
      title === "parent" ? "parentCategory" : "childCategory";

    const response = await CategoriesType.findOneAndUpdate(
      { title: categoryTitle },
      {
        $pull: {
          categories: type,
        },
      },
      { new: true },
    );

    if (!response) {
      return NextResponse.json(
        { error: "Category type not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Category successfully deleted",
        updatedCategories: response.categories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete category.", error);
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToMongoDB();

    const body = await req.json();
    const { categories, type, parentName } = body;

    if (!categories || !type) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );
    }

    if (type === "parent") {
      return updateParentCategory({ categories });
    } else if (type === "child") {
      return updateChildCategory({ categories });
    } else if (type === "parentName") {
      if (!parentName) {
        console.log("Parent name is required!");
        return NextResponse.json(
          { error: "Parent name is required" },
          { status: 400 },
        );
      }
      return updateParentName(parentName);
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

async function updateParentCategory({ categories }: UpdateCategoriesData) {
  try {
    if (!categories) {
      return NextResponse.json(
        { error: "Categories are required!" },
        { status: 400 },
      );
    }

    const response = await CategoriesType.findOneAndUpdate(
      { title: "parentCategory" },
      { categories },
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
        message: "Parent categories successfully updated.",
        categories: response.parentCategories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating parent category:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}

async function updateChildCategory({ categories }: UpdateCategoriesData) {
  try {
    if (!categories) {
      return NextResponse.json(
        { error: "Categories are required!" },
        { status: 400 },
      );
    }

    const response = await CategoriesType.findOneAndUpdate(
      { title: "childCategory" },
      { categories },
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
        message: "Child categories successfully updated.",
        categories: response.childCategories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating child category:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}

async function updateParentName(parentName: string) {
  try {
    if (!parentName) {
      console.log("Parent name is required!");
      return NextResponse.json(
        { error: "Parent name is required!" },
        { status: 400 },
      );
    }

    const response = await CategoriesType.findOneAndUpdate(
      { title: "childCategory" },
      { parent: parentName },
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
        message: "Parent name successfully updated.",
        categories: response.childCategories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating parent name category:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}
