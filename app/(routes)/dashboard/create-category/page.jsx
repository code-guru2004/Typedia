'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import slugify from 'slugify';

const categorySchema = z.object({
    name: z.string().min(2, 'Name is required'),
    slug: z.string().min(2, 'Slug is required'),
    description: z.string().optional(),
});

export default function CreateCategoryPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm({
        resolver: zodResolver(categorySchema),
    });

    const onSubmit = async (values) => {
        try {
            const res = await axios.post('/api/category/create', values);
            if (res.status === 201) {
                toast.success('Category created successfully!');
                reset();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to create category.');
        }
    };
    const generateSlug = () => {
        const name = watch('name');
        if (name) {
            const slug = slugify(name, { lower: true, strict: true });
            setValue('slug', slug)
        }
    }
    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Category</h2>
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
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register('description')} />
                </div>
                <Button type="submit">Create Category</Button>
            </form>
        </div>
    );
}
