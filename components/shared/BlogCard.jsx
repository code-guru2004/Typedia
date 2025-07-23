import Link from "next/link";
import Image from "next/image";
import { HandHeart, Eye } from "lucide-react";

export default function BlogCard({ blog }) {
    return (
        <div className="border flex flex-col lg:flex-row items-start rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-slate-100 ">
            <div className="p-3 mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-left">
                <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    width={200}
                    height={200}
                    className="object-cover hover:scale-102 transition-all rounded-md hidden lg:block"
                />
                <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    width={400}
                    height={400}
                    className="object-cover hover:scale-102 transition-all rounded-md block lg:hidden"
                />
            </div>
            <div className="p-4 space-y-2 w-full">
                {/* <h2 className="text-xl font-bold line-clamp-2">{blog.title.slice(0, 40)}</h2> */}
                <h2 className="text-xl font-bold line-clamp-2 tracking-wide">
                    {
                        blog.title.length<26? blog.title.toUpperCase() : blog.title.slice(0, 26)+ "..."
                    }
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    {/* Likes */}
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg border border-green-500">
                        <HandHeart className="text-green-700 size-4" />
                        <span>{blog.likes || 0}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-lg border border-blue-300">
                        <Eye className="text-blue-500 size-4" />
                        <span>{blog.views || 0}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                    <span className="font-semibold">
                        {blog.author.username || "undefined"}
                    </span>
                    <span>•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {blog.category.name}
                    </span>
                    <span>•</span>
                    <span>
                        {new Date(blog.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </span>
                </div>

                <Link
                    href={`/blog/${blog.slug}`}
                    className="text-blue-600 hover:underline text-sm"
                >
                    Read More →
                </Link>
            </div>
        </div>
    );
}
