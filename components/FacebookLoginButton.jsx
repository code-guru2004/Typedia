"use client";

import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function FacebookLoginButton() {
    const handleFacebookLogin = async () => {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();
            alert(`Signed in as ${user.displayName}`);
            console.log("JWT Token:", token);
        } catch (error) {
            console.error("Facebook Login Error:", error);
            alert("Facebook login failed");
        }
    };

    return (
        <button
            onClick={handleFacebookLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
            Login with Facebook
        </button>
    );
}
