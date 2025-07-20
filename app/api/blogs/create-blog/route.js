import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const {userEmail, ...blogData} = body;
console.log(body);

  if (!userEmail) {
    return new Response(JSON.stringify({ message: "Unauthorized entry" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Basic validation
  if (!blogData.title || !blogData.slug || !blogData.content) {
    return new Response(JSON.stringify({ message: "Missing required fields" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await User.findOne({ email: userEmail }); // or { email: body.email }

    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    const blog = await Blog.create({
      ...blogData,
      publishedAt: blogData.isPublished ? new Date() : null,
      author: user?._id,
    });

    return new Response(JSON.stringify(blog), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to create blog" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
