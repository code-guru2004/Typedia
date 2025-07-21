"use client";
import { useSelector } from "react-redux";


export default function SomePage() {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Is Logged In: {user.isLoggedIn.toString()}</p>
    </div>
  );
}
