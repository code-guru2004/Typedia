// app/api/save-user/route.js
import { NextResponse } from 'next/server';


import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect(); // Connect to MongoDB

        const { email, username, kindeId, userImg, given_name } = await req.json();

        if (!email || !username || !kindeId) {
            return NextResponse.json({ message: 'Missing required fields',success:false }, { status: 400 });
        }

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: 'User already exists', success: true, user: existing }, { status: 200 }); // ✅ status 200
          }
          

        const newUser = await User.create({
            email,
            username,
            kindeId,
            avatar: userImg || null,
            firstName: given_name || null,

        });

        return NextResponse.json({ message: 'User saved successfully', user: newUser,success:true }, { status: 201 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal Server Error',success:false }, { status: 500 });
    }
}
