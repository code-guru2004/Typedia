import { dbConnect } from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export async function DELETE(req, context) {
    const { id } = context.params; // ✅ No `await` here
    const { userEmail } = await req.json();

    try {
        await dbConnect();

        const comment = await Comment.findById(id).populate("author", "email");

        if (!comment) {
            return NextResponse.json(
                { success: false, message: "Comment not found" },
                { status: 404 }
            );
        }

        if (userEmail !== comment.author.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 } // ✅ 401 is appropriate
            );
        }
        await Comment.deleteMany({ parentComment: id });
        await Comment.findByIdAndDelete(id);

        return NextResponse.json(
            { success: true, message: "Comment deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
