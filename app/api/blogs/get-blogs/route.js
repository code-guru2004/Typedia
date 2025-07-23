import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import Category from "@/models/Category"; // ✅ Add this

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = parseInt(searchParams.get("skip")) || 0;

    const blogs = await Blog.find({ isPublished: true })
        .populate("author", "username")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        // console.log(blogs);
        
    const total = await Blog.countDocuments({ isPublished: true });

    return NextResponse.json({ blogs, total });
}
