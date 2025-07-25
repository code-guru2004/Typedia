import { Eye, HandHeart, Tags } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BlogCard = ({ blog }) => {
    return (
        <div className="relative group max-w-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl shadow-xl border border-gray-100 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-300">
            <div className="relative h-48 w-full">
                <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-3xl" // More rounded top
                />
                {/* Subtle overlay for better text readability and depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent rounded-t-3xl" />
            </div>

            <div className="p-6 space-y-4 w-full"> {/* Slightly increased padding and spacing */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-full shadow-sm"> {/* Slightly bolder tag */}
                        <Tags className="size-4" />
                        {blog.category.name}
                    </span>
                    <span className="text-gray-500 text-sm"> {/* Slightly larger date text */}
                        {new Date(blog.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2"> {/* Bolder, slightly larger title */}
                    {blog.title}
                </h3>



                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100"> {/* Added top border for separation */}
                    <div className='flex items-center gap-3'>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium"> {/* Slightly more prominent stats */}
                            <Eye className="size-4" />
                            <span>{blog.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium"> {/* Slightly more prominent stats */}
                            <HandHeart className="size-4" />
                            <span>{blog.likes || 0}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 italic">
                            <span className=" text-gray-800">@{blog.author?.username}</span>
                        </p>
                    </div>
                </div>

                <Link
                    href={`/blog/${blog.slug}`}
                    className="text-white p-2 rounded-md hover:underline text-sm w-full bg-blue-600"
                >
                    Read More →
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;