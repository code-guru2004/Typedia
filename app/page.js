'use client'
import AuthStatus from "@/components/AuthStatus";
import UploadForm from "@/components/UploadForm";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);
  const handleSignOut = async () => {
    await signOut(auth);
    alert('Signed out!');
  };
  return (
    <>
    <UploadForm/>
    <AuthStatus />
    <button
        onClick={handleSignOut}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Log out
      </button>
    </>
  );
}
