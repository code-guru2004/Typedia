// app/blogs/page.tsx or page.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "@/components/shared/BlogCard";
import CategoryList from "@/components/shared/CategoryList";

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resBlogs = await axios.get("/api/blogs/get-blogs?limit=20&skip=0");
      const resCategories = await axios.get("/api/category/get");
      setBlogs(resBlogs.data.blogs);
      setCategories(resCategories.data.categories);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blogs List (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        {/* Category Sidebar (1/3) */}
        <aside className="lg:col-span-1">
          <CategoryList categories={categories} />
        </aside>
      </div>
    </div>
  );
}
