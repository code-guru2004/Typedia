'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import CommentForm from '@/components/shared/CommentForm';
import AllComments from '@/components/shared/AllComments';
import Image from 'next/image';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { ThumbsDown, ThumbsUp } from 'lucide-react';


export default function BlogPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    const { user, isAuthenticated } = useKindeAuth();

    useEffect(() => {

        async function addView() {
            const resp = await axios.post("/api/blogs/view", {
                slug
            })
            if (resp) {
                console.log(resp.data.ip);

            }
        }
        addView()
    }, []);


    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await axios.get(`/api/blogs/get-by-slug/${slug}`);

                if (!res?.data.success) {
                    router.push('/not-found');
                    return;
                }

                setBlog(res.data?.blog);
            } catch (error) {
                console.error('Error fetching blog:', error);
                router.push('/not-found');
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchBlog();
    }, [slug, router]);


    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <Skeleton className="h-10 w-2/3 mb-4" />
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    
    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

    }

    const handleSetComments = (comments) => {
        setComments(comments);
    }

    const handleAddOneComment = (comment) => {
        console.log(comment);
        setComments(prev => [comment, ...prev])
    }

    const handleReplayAdd = (newReply) => {
        setComments((prevComments) =>
            prevComments.map((comment) => {
                if (comment._id === newReply.parentComment) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newReply],
                    };
                }
                return comment;
            })
        );
    };

    const handleEditChange = (data) => {

        setComments((prev) => {
            return prev.map((comment) => {
                if (comment._id === data.commentId) {
                    return { ...comment, content: data.content };
                }
                return comment;
            });
        });
    };
    const handleReplyEditChange = (data) => {
        const parentCommentIndex = comments.findIndex((comment) =>
            comment.replies.some((reply) => reply._id === data.commentId)
        );
        if (parentCommentIndex !== -1) {
            setComments((prev) => {
                const updatedComments = [...prev];
                const parentComment = updatedComments[parentCommentIndex];

                const updatedReplies = parentComment.replies.map((reply) =>
                    reply._id === data.commentId
                        ? { ...reply, content: data.content }
                        : reply
                );

                updatedComments[parentCommentIndex] = {
                    ...parentComment,
                    replies: updatedReplies,
                };

                return updatedComments;
            });
        }
    };
    const handleDeleteFilter = (deletedCommentId) => {
        const filteredComments = comments
            .map((comment) => {
                // If this is the comment to delete, return null (will be filtered out)
                if (comment._id === deletedCommentId) {
                    return null;
                }

                // Otherwise, filter out the deleted reply from the replies array
                const updatedReplies = comment.replies?.filter(
                    (reply) => reply._id !== deletedCommentId
                );

                return { ...comment, replies: updatedReplies };
            })
            .filter(Boolean); // Remove null comments

        setComments(filteredComments);
    };


    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 border-l-4 border-blue-500 px-2 whitespace-normal break-words">
                {blog.title.charAt(0).toUpperCase() + blog.title.slice(1)}
            </h1>

            <p className="text-gray-500 text-sm mb-4">
                By <span className="font-medium">{blog.author?.username || 'Unknown'}</span> |{' '}
                {new Date(blog.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                })}
            </p>

            <div className='w-full flex items-center justify-center mb-5'>
                {blog.coverImage && (
                    <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        width={750}
                        height={750}
                    />
                )}
            </div>

            <ScrollArea className="mb-6">
                <div
                    className="prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </ScrollArea>

            <Separator className="my-4" />

            <div className='flex items-center gap-3'>
                <button className='flex items-center gap-1 bg-green-200 border-2 border-green-500 text-green-700 p-2 rounded-md'>
                    <ThumbsUp /> <span>•</span> {blog.likes}
                </button>
                <button className='flex items-center gap-1 bg-red-200 border-2 border-red-500 text-red-700 p-2 rounded-md'>
                    <ThumbsDown /> <span>•</span> {blog.dislikes}
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm font-semibold">Tags:</span>
                {blog.tags?.map((tag) => (
                    <Badge key={tag._id} variant="outline">
                        {tag.name}
                    </Badge>
                ))}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
                Category: <strong>{blog.category?.name || 'Uncategorized'}</strong>
            </div>
            <div>
                <CommentForm slug={slug} onCommentAdd={(comment) => handleAddOneComment(comment)} />
            </div>
            <div>
                <AllComments slug={slug} comments={comments} onCommentChange={(comments) => handleSetComments(comments)} onReplyChange={(reply) => handleReplayAdd(reply)} onCommentEditChange={(data) => handleEditChange(data)} onReplyEditChange={(data) => handleReplyEditChange(data)} onDeleteChange={(deletedCommentId) => handleDeleteFilter(deletedCommentId)} />
            </div>
        </div>
    );
}
