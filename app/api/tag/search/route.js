// app/api/tag/search/route.js

import { dbConnect } from "@/lib/dbConnect";
import Tag from "@/models/Tag";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ tags: [] });
  }

  try {
    const tags = await Tag.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);

    return NextResponse.json({ tags });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search tags" }, { status: 500 });
  }
}
