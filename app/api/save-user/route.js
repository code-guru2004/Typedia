// app/api/save-user/route.js
import { NextResponse } from 'next/server';


import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect(); // Connect to MongoDB

        const { email, username, firebaseUID } = await req.json();
console.log(email, username, firebaseUID );

        // Validate required fields
        if (!email || !username || !firebaseUID) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const newUser = await User.create({
            email,
            username,
            firebaseUID,
        });

        return NextResponse.json({ message: 'User saved successfully', user: newUser }, { status: 201 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
