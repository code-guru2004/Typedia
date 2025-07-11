'use client';
import { auth } from '@/lib/firebaseClient';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function SocialLoginButtons() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            if (user) {
                const displayName = user.displayName || user.email.split('@')[0];
                const randomDigits = Math.floor(1000 + Math.random() * 9000); // e.g., 4-digit number
                const username = `${displayName.replace(/\s+/g, '').toLowerCase()}${randomDigits}`;
    
                await fetch('/api/save-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firebaseUID: user.uid,
                        email: user.email,
                        username: username,
                    }),
                });
    
                router.replace("/");
                alert(`Signed in with Google as ${username}`);
            }
        } catch (err) {
            console.error(err);
            alert('Google Sign-In failed');
        }
    };
    

    const handleFacebookLogin = async () => {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            alert(`Signed in with Facebook as ${user.displayName || user.email}`);
            if (user) {
                const displayName = user.displayName || user.email.split('@')[0];
                const randomDigits = Math.floor(1000 + Math.random() * 9000); // e.g., 4-digit number
                const username = `${displayName.replace(/\s+/g, '').toLowerCase()}${randomDigits}`;
    
                await fetch('/api/save-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firebaseUID: user.uid,
                        email: user.email,
                        username: username,
                    }),
                });
    
                router.replace("/");
                alert(`Signed in with Google as ${username}`);
            }
        } catch (err) {
            console.error(err);
            alert('Facebook Sign-In failed');
        }
    };

    return (
        <div className="space-y-4 mt-6">
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
            >
                <FcGoogle className="size-6" />
                <span className="text-black text-sm font-medium">Continue with Google</span>
            </button>

            <button
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-2 hover:bg-blue-50 transition"
            >
                <FaFacebook className="size-6 text-blue-600" />
                <span className="text-black text-sm font-medium">Continue with Facebook</span>
            </button>
        </div>
    );
}
