'use client'
// app/page.tsx or app/home/page.tsx

import Link from "next/link";
import { ArrowRight, BookOpen, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function HomePage() {
  const router = useRouter();



  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-4 px-6 text-center flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-end lg:px-7">
      <LoginLink postLoginRedirectURL="/dashboard">Sign in</LoginLink>
      <RegisterLink postLoginRedirectURL="/welcome">Sign up</RegisterLink>
      </div>
        <div className="max-w-4xl mx-auto py-24">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Discover Inspiring Stories & Fresh Perspectives
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Explore high-quality blogs from creators around the world on technology, design, personal growth, and more.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-full shadow hover:bg-gray-100 transition"
          >
            Explore Blogs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Blog or Banner */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Featured Blog</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="/banner.jpg"
              alt="Featured Post"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-left">
              <h3 className="text-2xl font-bold mb-2">How AI is Transforming Modern Blogging</h3>
              <p className="text-gray-600 mb-4">
                Explore how artificial intelligence is reshaping the content creation landscape, improving SEO, and helping writers express more.
              </p>
              <Link href="/post/ai-blogging" className="text-blue-600 hover:underline font-medium">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6" /> Recent Posts
          </h2>

          {/* Example posts (replace with dynamic data) */}
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                <img
                  src={`/post-${i}.jpg`}
                  alt={`Post ${i}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">Blog Post Title {i}</h3>
                  <p className="text-gray-600 mb-3">
                    A short summary of what this blog post is about. Engaging, clear, and enticing.
                  </p>
                  <Link href={`/post/${i}`} className="text-blue-600 hover:underline font-medium">
                    Continue Reading →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-2">
            <Tags className="w-6 h-6" /> Popular Categories
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Tech", "Personal Growth", "Design", "Travel", "AI", "Health"].map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="px-4 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} YourBlog. All rights reserved.
      </footer>
    </main>
  );
}
