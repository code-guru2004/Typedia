
import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json({
        success: false,
        message: "Name and slug are required.",
      }, { status: 400 });
    }

    await dbConnect();

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Category with this slug already exists.",
      }, { status: 409 });
    }

    const newCategory = new Category({ name, slug, description });
    await newCategory.save();

    return NextResponse.json({
      success: true,
      message: "Category created successfully.",
      category: newCategory,
    }, { status: 201 });

  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
