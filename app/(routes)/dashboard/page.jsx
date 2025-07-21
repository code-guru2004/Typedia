"use client";
import { useSelector } from "react-redux";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

export default function Dashboard() {
  const currentUser = useSelector((state) => state.user);

  return (
    <div>
      <h1>Welcome, {currentUser.username || "User"}</h1>
      <p>Email: {currentUser.email}</p>
      <LogoutLink postLogoutRedirectURL="/">Log out</LogoutLink>
    </div>
  );
}
