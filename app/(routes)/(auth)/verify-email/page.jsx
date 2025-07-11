'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(async () => {
            const user = auth.currentUser;
            
            if (user) {
                console.log(user?.uid);
                await user.reload(); // Refresh user data
                if (user.emailVerified) {
                    setIsVerified(true);
                    clearInterval(interval);
                    const { email, username } = JSON.parse(localStorage.getItem('pendingUser'));
                    //console.log(uid,email, username);
                    await fetch('/api/save-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            firebaseUID: user?.uid,
                            email,
                            username,
                        }),
                    });

                    localStorage.removeItem('pendingUser');
                    router.push('/'); // Redirect to homepage
                }
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-2">
                We’ve sent you a verification link. Please check your email.
            </p>
            <p className="text-sm text-gray-500">You will be redirected once your email is verified.</p>
        </div>
    );
}
