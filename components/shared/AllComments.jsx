'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';

function AllComments({ slug, comments, onCommentChange, onReplyChange, onCommentEditChange, onReplyEditChange, onDeleteChange }) {
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState(null); // parentCommentId
    const [loading, setLoading] = useState(false);
    const { email } = useSelector((state) => state.user); // or however you get user email
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [deletedCommentId, setDeletedCommentId] = useState(null);
    const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
    const [isWantToDelete, setIsWantToDelete] = useState(false);

    const router = useRouter()
    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/comments/create', {
                content,
                userEmail: email,
                slug, // or send postId instead of slug, depending on your API
                parentComment: replyTo
            });

            const data = res?.data;

            if (data && data.success) {
                onReplyChange(data.newComment)
                setContent('');

            } else {
                setErrorMsg(data.message || 'Failed to post comment');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Something went wrong');
        } finally {
            setLoading(false);
            router.refresh()
        }
    };

    const handleEdit = async (commentId) => {
        if (!commentId) {
            toast.error('No Comment Selected')
        }
        try {
            const resp = await axios.patch(`/api/comments/edit/${commentId}`, {
                content: editContent,
                userEmail: email
            });
            if (resp && resp?.data.success) {
                const data = {
                    commentId: editingCommentId,
                    content: editContent
                }
                setEditingCommentId(null);
                setEditContent('');
                if (!resp.data.comment.parentComment) {
                    onCommentEditChange(data)
                } else {
                    onReplyEditChange(data)
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update comment");
        }

    }
    const handleDelete = async () => {
        if (!deletedCommentId) {
            toast.error("Comment is not selected");
            return;
        }

        try {
            const resp = await axios.delete(`/api/comments/delete/${deletedCommentId}`, {
                data: { userEmail: email } // ✅ Send body inside `data` for DELETE
            });

            if (resp && resp.data.success) {
                toast.success("Comment deleted successfully");
                onDeleteChange(deletedCommentId);
            } else {
                toast.error(resp.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }finally{
            setDeletedCommentId(null);
            setIsDeleteDrawerOpen(false)
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`/api/comments/get/${slug}`);
            if (res.ok) {
                const data = await res.json();
                // console.log(data);
                onCommentChange(data);
            }
        };
        fetchComments();
    }, [slug]);

    return (
        <div className="mt-10 space-y-6">
            {comments?.map((comment) => (
                <div
                    key={comment._id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold uppercase">
                                {comment.author.username?.charAt(0)}
                            </div>
                            <p
                                className={`text-sm font-semibold ${email === comment.author.email
                                    ? "text-pink-600"
                                    : "text-gray-800"
                                    }`}
                            >
                                @{comment.author.username}{comment.isEdited}
                            </p>
                        </div>
                        <p className="text-xs text-gray-400">
                            
                            {new Date(comment.createdAt).toLocaleString()}
                        </p>
                    </div>

                    {editingCommentId === comment._id ? (
                        <div>
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(comment._id)}
                                    className="px-4 py-1 bg-green-600 text-white text-sm rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingCommentId(null);
                                        setEditContent('');
                                    }}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                    )}


                    <button
                        onClick={() => setReplyTo(comment._id)}
                        className="text-sm text-blue-500 mt-1 hover:underline"
                    >
                        Reply
                    </button>
                    {/* Edit button */}
                    {email === comment.author.email && !editingCommentId && (
                        <>
                            <button
                                onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditContent(comment.content);
                                }}
                                className="text-sm text-blue-500 hover:underline ml-2 p-0.5 bg-blue-100"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setDeletedCommentId(comment._id)
                                    setIsDeleteDrawerOpen(true)
                                    
                                }}
                                className="text-sm text-red-500 hover:underline ml-2 p-0.5 bg-red-100"
                            >
                                Delete
                            </button>
                        </>
                    )}
                    <Dialog open={isDeleteDrawerOpen} onOpenChange={() => {
                        setIsDeleteDrawerOpen(prev => !prev)
                        setDeletedCommentId(null)
                    }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                {/* <DialogDescription className='w-full text-center text-8xl'>
                                    🚮
                                </DialogDescription> */}
                                <div>
                                    <Button className='bg-red-500 hover:bg-red-400 text-white' onClick={handleDelete}>
                                        Delete
                                    </Button>
                                    <Button>
                                        Cancle
                                    </Button>
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    {/* Reply form */}
                    {replyTo === comment._id && (
                        <div className="mt-2 space-y-2">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your reply..."
                                className="w-full p-2 border rounded-md"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md"
                                >
                                    {loading ? 'Replying...' : 'Reply'}
                                </button>
                                <button
                                    onClick={() => {
                                        setReplyTo(null);
                                        setContent('');
                                    }}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    {/* // all reaply */}
                    {comment.replies?.length > 0 && (
                        <div className="mt-4 pl-5 border-l-2 border-gray-200 space-y-3">
                            {comment.replies.map((reply) => (
                                <div
                                    key={reply._id}
                                    className="bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-blue-600">
                                            @{reply.author.username}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(reply.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {editingCommentId === reply._id ? (
                                        <div>
                                            <Textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(reply._id)}
                                                    className="px-4 py-1 bg-green-600 text-white text-sm rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingCommentId(null);
                                                        setEditContent('');
                                                    }}
                                                    className="text-sm text-gray-500 hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 text-sm">{reply.content}</p>
                                    )}

                                    {email === reply.author.email && (
                                        <button
                                            onClick={() => {
                                                setEditingCommentId(reply._id);
                                                setEditContent(reply.content);

                                            }}
                                            className="text-sm text-blue-500 hover:underline ml-2"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default AllComments;
