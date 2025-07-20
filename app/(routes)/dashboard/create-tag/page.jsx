'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import slugify from 'slugify';
import axios from 'axios';

const tagSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    slug: z.string().min(2, 'Slug is required'),
});

export default function CreateTagPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(tagSchema),
    });

    const onSubmit = async (values) => {
        try {
            const res = await axios.post('/api/tag/create', values);
            if (res.status === 201) {
                toast.success('Tag created successfully!');
                reset();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to create tag.');
        }
    };
    const generateSlug = () => {
        const name = watch('name');
        if (name) {
            const generatedSlug = slugify(name, { lower: true, strict: true });
            setValue('slug', generatedSlug)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Tag</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="slug">Slug</Label>
                    <div className="flex gap-2">
                        <Input id="slug" {...register('slug')} />
                        <Button type="button" onClick={generateSlug} variant="outline">
                            Generate Slug
                        </Button>
                    </div>
                    {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                </div>

                <Button type="submit">Create Tag</Button>
            </form>
        </div>
    );
}
