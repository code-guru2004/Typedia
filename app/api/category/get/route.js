
import { dbConnect } from '@/lib/dbConnect';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const categories = await Category.find();
  return NextResponse.json({ categories });
}
