'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import TagSearchSelect from '@/components/shared/TagSearchSelect';

const TiptapEditor = dynamic(() => import('@/components/shared/TiptapEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const formSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  content: z.string().min(10),
  coverImage: z.string().url().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  isPublished: z.boolean().default(false),
});




export default function CreateBlogPage() {
  const { email } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  useEffect(() => {
    setValue("tags", selectedTags.map((t) => t._id));
  }, [selectedTags]);


  const { register, handleSubmit, formState: { errors }, control, reset, watch, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      coverImage: '',
      category: '',
      tags: '',
      isPublished: false,
    },
  });


  const router = useRouter();

  // get categories
  useEffect(() => {
    
    
    async function fetchMeta() {
      try {
        const catRes = await fetch('/api/category/get'); // GET route to fetch all categories
        // const tagRes = await fetch('/api/tag/get'); // GET route to fetch all tags

        const catData = await catRes.json();
        // const tagData = await tagRes.json();

        setCategories(catData.categories || []);
        // setTags(tagData.tags || []);
      } catch (err) {
        console.error('Error fetching tags/categories:', err);
      }
    }
    fetchMeta();
  }, []);


  // auto generate slug
  useEffect(() => {
    const title = watch("title");
    if (title) {
      setValue("slug", slugify(title, { lower: true }));
    }
  }, [watch("title"), setValue]);

  useEffect(() => {
    setValue('tags', selectedTags.map(tag => tag._id));
  }, [selectedTags, setValue]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    console.log(previewUrl);


    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.data.url);
    setValue('coverImage', data.data.url);
  };


  // const handleUpload = async () => {
  //   if (!image) return;

  //   const formData = new FormData();
  //   formData.append('file', image);
  //   console.log(formData);

  //   const res = await fetch('/api/upload', {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   const data = await res.json();
  //   console.log(data.data.url);

  //   setUploadedUrl(data.data.url);
  //   setValue('coverImage', data.data.url)
  // };

  // onsubmit
  const onSubmit = async (values) => {
    try {
      const res = await axios.post('/api/blogs/create-blog', {
        ...values,
        tags: selectedTags.map(tag => tag._id), // Only selected tag IDs
        userEmail: email,
      });

      if (res.status === 201) {
        toast.success('Blog created successfully!');
        router.replace(`/blog/${values.slug}`);
        reset();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create blog.');
    }
  };
  useEffect(() => {
    console.log(email);

  }, [email])
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create New Blog</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Slug */}
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register('slug')} />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
        </div>

        {/* Cover Image */}
        <div>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <input
            id="coverImage"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
          {errors.coverImage && <p className="text-sm text-red-500">{errors.coverImage.message}</p>}
          
          {uploadedUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Uploaded:</p>
              <img src={uploadedUrl} alt="Uploaded" className="w-64 object-cover" />
            </div>
          )}

        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <select id="category" {...register('category')} className="w-full border rounded p-2">
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>


        {/* Tags */}
        <div>
          <TagSearchSelect selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>


        {/* Content (Rich Text Editor) */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="content">Content</Label>
              <TiptapEditor value={field.value} onChange={field.onChange} />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>
          )}
        />

        {/* Publish Switch */}
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch
                id="isPublished"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="isPublished">Publish Immediately</Label>
            </div>
          )}
        />

        {/* Submit */}
        <Button type="submit">Create Blog</Button>
      </form>
    </div>
  );
}
