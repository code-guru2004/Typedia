// components/AuthStatus.jsx
'use client';

import { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export default function AuthStatus() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                //console.log(currentUser);
                
                setUser(currentUser);
                //console.log('User is signed in:', currentUser);
            } else {
                setUser(null);
                console.log('No user is signed in.');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="p-4">
            {user ? (
                <div>
                    <p>✅ Signed in as {user.displayName}</p>
                    <img src={user?.photoURL} alt="Profile" className="w-12 h-12 rounded-full mt-2" />
                </div>
            ) : (
                <p>❌ Not signed in</p>
            )}
        </div>
    );
}
