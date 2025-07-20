'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

import { Quill as GlobalQuill } from 'react-quill-new';

// ✅ Optional: Fix tag issues with certain Next.js deployments
if (typeof window !== 'undefined' && GlobalQuill?.register) {
    const Block = GlobalQuill.import('blots/block');
    Block.tagName = 'DIV';
    GlobalQuill.register(Block, true);

    const ListItem = GlobalQuill.import('formats/list');
    GlobalQuill.register(ListItem, true);
}

export default function TiptapEditor({ value, onChange }) {
    const [editorContent, setEditorContent] = useState(value || '');

    // ✅ Move imageHandler before useMemo
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                const url = data?.data?.url;

                const quill = window.quillRef;
                const range = quill?.getSelection(true);

                if (range && url) {
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1);
                }
            } catch (err) {
                console.error('Image upload failed', err);
            }
        };
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['link', 'image', 'video'],
                ['clean'],
            ],
            handlers: {
                image: imageHandler,
            },
        },
        clipboard: { matchVisual: false },
    }), [imageHandler]);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script', 'blockquote', 'code-block',
        'list', 'indent',
        'align',
        'link', 'image', 'video',
    ];

    useEffect(() => {
        setEditorContent(value || '');
    }, [value]);

    const handleChange = (newValue) => {
        setEditorContent(newValue);
        onChange?.(newValue);
    };

    return (
        <div className="my-4">
            <ReactQuill
                value={editorContent}
                onChange={handleChange}
                theme="snow"
                modules={modules}
                formats={formats}
                className="min-h-[300px] rounded-md bg-white shadow-sm"
                ref={(el) => {
                    if (el) window.quillRef = el.getEditor();
                }}
            />
        </div>
    );
}
