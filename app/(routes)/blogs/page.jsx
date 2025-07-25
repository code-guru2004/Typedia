// app/blogs/page.tsx or page.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "@/components/shared/BlogCard";
import CategoryList from "@/components/shared/CategoryList";
import NewBlogCard from "@/components/shared/NewBlogCard";

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
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center">
            {blogs.map((blog) => (
            
              <div key={blog?._id}>
                  <NewBlogCard blog={blog} />
              </div>
            ))}

          </div>
        </div>

        {/* Category Sidebar (1/3) */}
        <aside className="lg:col-span-1">
          <CategoryList categories={categories} />
        </aside>
      </div>
    </div>
  );
}
