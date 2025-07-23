'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { LuMessageSquareReply } from 'react-icons/lu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MdEditNote } from "react-icons/md";


function AllComments({
    slug,
    comments,
    onCommentChange,
    onReplyChange,
    onCommentEditChange,
    onReplyEditChange,
    onDeleteChange,
}) {
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [deletedCommentId, setDeletedCommentId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [openDropdownFor, setOpenDropdownFor] = useState(null);

    const { email } = useSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`/api/comments/get/${slug}`);
            if (res.ok) {
                const data = await res.json();
                onCommentChange(data);
            }
        };
        fetchComments();
    }, [slug]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/comments/create', {
                content,
                userEmail: email,
                slug,
                parentComment: replyTo,
            });

            const data = res?.data;
            if (data?.success) {
                onReplyChange(data.newComment);
                setContent('');
                setReplyTo(null);
            } else {
                toast.error(data.message || 'Failed to post comment');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            router.refresh();
        }
    };

    const handleEdit = async (commentId) => {
        try {
            const res = await axios.patch(`/api/comments/edit/${commentId}`, {
                content: editContent,
                userEmail: email,
            });

            if (res?.data.success) {
                const updated = { commentId, content: editContent };
                if (!res.data.comment.parentComment) {
                    onCommentEditChange(updated);
                } else {
                    onReplyEditChange(updated);
                }
                setEditingCommentId(null);
                setEditContent('');
            }
        } catch (err) {
            toast.error('Failed to update comment');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`/api/comments/delete/${deletedCommentId}`, {
                data: { userEmail: email },
            });

            if (res?.data.success) {
                toast.success('Comment deleted');
                onDeleteChange(deletedCommentId);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Error deleting comment');
        } finally {
            setDeletedCommentId(null);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="mt-10 space-y-6">
            {comments?.map((comment) => (
                <div
                    key={comment._id}
                    className="bg-white border rounded-xl p-5 shadow-sm hover:shadow transition"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold uppercase">
                                {comment.author.username?.charAt(0)}
                            </div>
                            <div>
                                <p className={`text-sm font-semibold ${email === comment.author.email ? 'text-pink-600' : 'text-yellow-800'}`}>
                                    @{comment.author.username}{' '}
                                    {comment.isEdited && <span className="text-xs text-gray-500 ml-1">(edited)</span>}
                                </p>
                                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setReplyTo(comment._id)}
                                title="Reply"
                            >
                                <LuMessageSquareReply className="w-5 h-5" />
                            </Button>

                            {
                                email === comment.author.email&&(
                                    <DropdownMenu open={openDropdownFor === comment._id} onOpenChange={(open) => setOpenDropdownFor(open ? comment._id : null)}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" title="Options">
                                                <BsThreeDotsVertical className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {email === comment.author.email && !editingCommentId && (
                                                <>
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditingCommentId(comment._id);
                                                        setEditContent(comment.content);
                                                    }}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        setDeletedCommentId(comment._id);
                                                        setIsDeleteDialogOpen(true);
                                                    }}>Delete</DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }
                        </div>
                    </div>

                    {/* Content or Edit Mode */}
                    {editingCommentId === comment._id ? (
                        <div>
                            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                            <div className="flex gap-2 mt-2">
                                <Button size="sm" onClick={() => handleEdit(comment._id)}>Save</Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setEditingCommentId(null);
                                    setEditContent('');
                                }}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 px-3 text-sm whitespace-pre-line break-words max-w-full">
                            {comment.content}
                        </p>

                    )}

                    {/* Reply Box */}
                    {replyTo === comment._id && (
                        <div className="mt-4 space-y-2">
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your reply..."
                            />
                            <div className="flex gap-2">
                                <Button onClick={handleSubmit} disabled={loading} size="sm">
                                    {loading ? 'Replying...' : 'Reply'}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setReplyTo(null);
                                    setContent('');
                                }}>Cancel</Button>
                            </div>
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies?.length > 0 && (
                        <div className="mt-4 pl-5 border-l border-gray-200 space-y-3">
                            {comment.replies.map((reply) => (
                                <div
                                    key={reply._id}
                                    className="bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                        <div className="flex items-center gap-1">
                                            <p className="text-sm font-medium text-blue-600">@{reply.author.username}</p>
                                            <span>•</span>
                                            <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                        {email === reply.author.email && editingCommentId !== reply._id && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-blue-500 pl-0"
                                            onClick={() => {
                                                setEditingCommentId(reply._id);
                                                setEditContent(reply.content);
                                            }}
                                        >
                                            <MdEditNote className='size-5'/>
                                        </Button>
                                    )}
                                        </div>
                                    </div>

                                    {editingCommentId === reply._id ? (
                                        <div>
                                            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                                            <div className="flex gap-2 mt-2">
                                                <Button size="sm" onClick={() => handleEdit(reply._id)}>Save</Button>
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    setEditingCommentId(null);
                                                    setEditContent('');
                                                }}>Cancel</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-700">{reply.content}</p>
                                    )}

                                    
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Delete Confirmation */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={() => setIsDeleteDialogOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <div className="mt-4 flex justify-end gap-3">
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AllComments;
