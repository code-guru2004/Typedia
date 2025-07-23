// app/api/blogs/view/route.js

import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  // Extract client IP manually from headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const devFakeIp = '192.168.1.100'; // use different ones to simulate multiple users
  
  const ip =
    process.env.NODE_ENV === 'development'
      ? devFakeIp
      : forwardedFor?.split(',')[0]?.trim() || 'UNKNOWN_IP';
  

  console.log('clientIp:', ip);

  return NextResponse.json({
    success: true,
    message: "ADD VIEW",
    ip,
  });
}

