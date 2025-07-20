import { dbConnect } from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function PATCH(req, { params }) {
    const { id } = await params;
    const { content, userEmail } = await req.json();
    try {
        await dbConnect();
        const comment = await Comment.findById(id).populate("author", "name email username");
        if (!comment) {
            return NextResponse.json({
                success:false,
                message: "Comment not found"
            },{
                status:404
            })
        }

        // Only allow the author to edit
        if (comment.author.email !== userEmail) {
            return NextResponse.json({
                success:false,
                message: "Unauthorized Access"
            },{
                status:403
            })
        }

        comment.content = content;
        comment.isEdited = true;
        await comment.save();

        return NextResponse.json({
            success:true,
            comment 
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message: "Internal server error"
        },{
            status:500
        })
    }

}