"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function BlogsPage() {
    const LIMIT = 10;
    const [blogs, setBlogs] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    const lastBlogRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setSkip((prevSkip) => prevSkip + LIMIT);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/blogs/get-blogs?limit=${LIMIT}&skip=${skip}`);
            setBlogs((prev) => [...prev, ...res.data.blogs]);
            if (blogs.length + res.data.blogs.length >= res.data.total) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skip]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">All Blogs</h1>

            <div className="grid grid-cols-1  gap-6">
                {blogs.map((blog, index) => {
                    const isLast = index === blogs.length - 1;
                    return (
                        <div className="px-3 py-4 bg-gray-200">
                            <Image
                                src={blog.coverImage}
                                alt="cover image"
                                width={100}
                                height={100}
                            />
                        </div>
                    )
                })}
            </div>

            {loading && <p className="text-center mt-6">Loading...</p>}
            {!hasMore && <p className="text-center mt-6 text-gray-500">No more blogs</p>}
        </div>
    );
}
