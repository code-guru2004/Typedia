// components/GoogleLoginButton.jsx
'use client';


import { auth, provider } from '@/lib/firebaseClient';
import { signInWithPopup } from 'firebase/auth';

export default function GoogleLoginButton() {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User Info:', user);
            alert(`Logged in as ${user.displayName}`);
        } catch (error) {
            console.error('Google Login Error:', error);
            alert(error.message);
        }
    };

    return (
        <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Sign in with Google
        </button>
    );
}
