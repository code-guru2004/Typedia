import { dbConnect } from "@/lib/dbConnect";
import Tag from "@/models/Tag";
import { NextResponse } from "next/server";

export  async function POST(req) {
    try {
        const body = await req.json();
        const { name, slug } = body;

        if (!name || !slug) {
            return NextResponse.json({
                success: false,
                message: "Not all fleld is given"
            },{
                status: 400
            })
        }
        await dbConnect();
    // check if tag already exists
        const existingTag = await Tag.findOne({ slug });
        if (existingTag) {
            return NextResponse.json({
                success: false,
                message: "Tag with this slug already exists.",
            }, { status: 409 });
        }

        const newTag = new Tag({
            name,
            slug
        });
        await newTag.save();
        return NextResponse.json({
            success: true,
            message: "Tag created successfully",
            tag: newTag,
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            success: false,
            message: "Internal Error"
        },
    {
        status: 500
    })
    }
}