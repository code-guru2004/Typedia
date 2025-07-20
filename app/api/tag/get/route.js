import { dbConnect } from "@/lib/dbConnect"
import Tag from "@/models/Tag"

export async function GET(req) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') || ''

  try {
    const tags = await Tag.find({
      name: { $regex: query, $options: 'i' },
    })
      .limit(10)
      .select('_id name slug')

    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response('Failed to fetch tags', { status: 500 })
  }
}

