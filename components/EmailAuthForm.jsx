// components/EmailAuthForm.jsx
'use client';

import { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default function EmailAuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter()
    const signUp = async () => {
        const hashedPassword = await bcrypt.hash(password, 10); // hash it securely
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCred);
            await sendEmailVerification(userCred.user);
            alert('Signup successful! Verification email sent.');
            localStorage.setItem('pendingUser', JSON.stringify({
                
                email,
                username,
                //hashedPassword, // store hash, not raw password
            }));
            router.push('/verify-email'); // redirect to verification page
        } catch (err) {
            alert(err.message);
        }
    };

    const signIn = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCred);

            if (!userCred.user.emailVerified) {
                alert("Please verify your email first.");
            } else {
                alert("Login successful!");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        alert("Logged out");
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white text-black shadow-lg rounded-xl space-y-4">
            <h2 className="text-2xl font-semibold text-center">Email Login</h2>
            <input
                className="w-full p-2 border rounded"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="w-full p-2 border rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="w-full p-2 border rounded"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex flex-col space-y-2">
                <button className="bg-blue-500 text-white p-2 rounded" onClick={signUp}>
                    Sign Up
                </button>
                <button className="bg-green-500 text-white p-2 rounded" onClick={signIn}>
                    Sign In
                </button>
                <button className="bg-gray-400 text-white p-2 rounded" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
