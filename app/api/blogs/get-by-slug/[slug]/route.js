import { NextResponse } from 'next/server';


import { dbConnect } from '@/lib/dbConnect';
import Blog from '@/models/Blog';


export async function GET(req, context) {
    const { slug } = context.params;

    await dbConnect();

    try {
        const blog = await Blog.findOne({ slug }).populate('author category tags');
        if (!blog) {
            return NextResponse.json({ success: false , message: 'Blog not found' }, { status: 404 });
        }


        return NextResponse.json({success:true, blog }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({success: false , message: 'Server Error' }, { status: 500 });
    }
}
