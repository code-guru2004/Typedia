// components/BlogCard.jsx
import Link from "next/link";
import Image from "next/image";


export default function BlogCard({ blog }) {
  return (
    <div className="border flex flex-col lg:flex-row items-start  rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-slate-100">
        <div className="p-3">
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
        <div className="p-4 space-y-2">
            <h2 className="text-xl font-bold line-clamp-2">{blog.title}</h2>
            <div className="text-sm text-gray-500">
            👍 {blog.likes?.length || 0} Likes
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">{blog.author.username? blog.author.username : 'undefined'}</span>
            <span>•</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">
                {blog.category.name}
            </span>
            <span>•</span>
            <span>
            {new Date(blog.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
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
