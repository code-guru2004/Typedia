// /app/api/auth/firebase-login/route.ts
import { dbConnect } from '@/lib/dbConnect';
import { adminAuth } from '@/lib/firebase-admin';
import User from '@/models/User';

import { NextResponse } from 'next/server';

export async function POST(req) {
  const { idToken } = await req.json();
  const decoded = await adminAuth.verifyIdToken(idToken);

  await dbConnect();
  let user = await User.findOne({ firebaseUID: decoded.uid });

  if (!user) {
    user = await User.create({
      firebaseUID: decoded.uid,
      email: `${decoded.uid}@sms.login`,
      username: `user-${decoded.uid.slice(0, 6)}`,
      role: 'author',
    });
  }

  return NextResponse.json({ user });
}
