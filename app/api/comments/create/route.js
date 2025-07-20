import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { slug, userEmail, content, parentComment } = body;
        if (!slug || !content || !userEmail) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }
        if (content.length < 3) {
            return NextResponse.json({ success: false, message: "Content must have 3 characters" }, { status: 400 });
        }
        await dbConnect();

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
        }

        const newComment = new Comment({
            post: blog._id,
            author: user._id,
            content,
            parentComment: parentComment || null
        });
        await newComment.save();

        const populatedComment = await newComment.populate("author", "_id email username");

        return NextResponse.json({ success: true, newComment:populatedComment }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}