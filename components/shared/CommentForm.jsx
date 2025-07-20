'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { z } from 'zod';

const formSchema = z.object({
    content: z.string().min(3, {
        message: 'Comment must be at least 3 characters.',
    }),
});

function CommentForm({ slug,onCommentAdd }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [replyTo, setReplyTo] = useState(null); 
    
    const router = useRouter();
    // Assume Redux state has user info under `auth.user`
    const { email } = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const validation = formSchema.safeParse({ content });
        if (!validation.success) {
            setErrorMsg(validation.error.issues[0].message);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/api/comments/create', {
                    content,
                    userEmail: email,
                    slug, // or send postId instead of slug, depending on your API
                
            });

            const data = res?.data;

            if (data && data.success) {
                setSuccessMsg('Comment posted successfully!');
                setContent('');
                onCommentAdd(data?.newComment)
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

    return (
        <form onSubmit={handleSubmit} className="space-y-3 mt-6">
            <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                placeholder="Write your comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
            />
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
}

export default CommentForm;
