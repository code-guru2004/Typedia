import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;
        await dbConnect();
        const post = await Blog.findOne({ slug }).select("_id");
        if (!post) {
            return new Response(JSON.stringify({ message: "Post not found" }), { status: 404 });
        }

        const comments = await Comment.find({ post: post._id, parentComment: null })
            .populate("author", "name email username") // 👈 this line gets author details
            .populate({
                path: "replies",
                populate: { path: "author", select: "_id email username" }, // 👈 populate replies' authors too
            })
            .sort({ createdAt: -1 }); 



        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Error fetching comments" }), { status: 500 });
    }
}
