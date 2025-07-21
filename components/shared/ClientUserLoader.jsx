// components/ClientUserLoader.tsx or .jsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { login, logout } from "@/redux/slices/userSlice";

export default function ClientUserLoader() {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useKindeAuth();

    useEffect(() => {
        const syncUser = async () => {
            if (!isAuthenticated || !user) return;

            const res = await fetch("/api/user/save-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    kindeId: user.id,
                    email: user.email,
                    username: user?.email?.split("@")[0],
                    userImg: user?.picture,
                    given_name: user?.given_name,
                }),
            });

            const data = await res.json();

            if (data?.user) {
                dispatch(
                    login({
                        username: data.user.username,
                        email: data.user.email,
                        uid: data.user._id,
                    })
                );
            } else {
                dispatch(logout());
            }
        };

        syncUser();
    }, [user, isAuthenticated, dispatch]);

    return null;
}
