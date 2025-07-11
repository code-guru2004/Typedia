// lib/firebaseClient.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCO8vF5rihqIqvYYbPpx_ZZ6fQ3qcEEYk0",
  authDomain: "blog-app-375e7.firebaseapp.com",
  projectId: "blog-app-375e7",
  storageBucket: "blog-app-375e7.appspot.com",
  messagingSenderId: "345428644060",
  appId: "1:345428644060:web:8be39ee32bbf1bc00ae419",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
