// app/dashboard/page.tsx (Client Component)
"use client";

import { useEffect } from "react";
import { LogoutLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

import { useDispatch } from "react-redux";
import { login, logout } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useKindeAuth();

  useEffect(() => {
    const saveUserToDB = async () => {
      if (!isAuthenticated || !user) return;
      console.log(user);
      
      console.log(user?.email.split("@")[0]);
      const res = await fetch("/api/user/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kindeId: user.id,
          email: user.email,
          username: user?.email.split('@')[0],
          userImg: user?.picture,
          given_name: user?.given_name,
         
        }),
      });
      
      const data = await res.json();
      console.log(data.message);
      if(data && data?.user){
        dispatch(
          login({
            username: data?.user.username,
            email: user.email,
            uid: data?.user._id,
          })
        );
        toast.success(data?.message);
      } else {
        dispatch(logout());
      }
    };

    saveUserToDB();
  }, [user, isAuthenticated]);

  return( 
  <div>
      <h1>Welcome, {user?.given_name}</h1>
      <LogoutLink>Log out</LogoutLink>
  </div>
);
}

