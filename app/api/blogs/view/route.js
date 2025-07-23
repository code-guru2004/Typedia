// app/api/blogs/view/route.js

import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ success: false, message: "Missing blog slug" }, { status: 400 });
    }

    // Get IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const devFakeIp = "192.168.1.100"; // Simulated unique IP during development

    const ip =
      process.env.NODE_ENV === "development"
        ? devFakeIp
        : forwardedFor?.split(",")[0]?.trim() || "UNKNOWN_IP";

    console.log("clientIp:", ip);

    // Connect to DB
    await dbConnect();

    // Find the blog by slug
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    // Check if this IP has already viewed the blog
    const isAlreadyViewed = blog.viewedBy.includes(ip);

    if (!isAlreadyViewed) {
      blog.views += 1;
      blog.viewedBy.push(ip);
      await blog.save();
    }

    return NextResponse.json({
      success: true,
      view: blog.views,
    });

  } catch (error) {
    console.error("View Error:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    }, { status: 500 });
  }
}
