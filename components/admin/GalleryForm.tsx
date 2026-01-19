'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowLeft, Save, Trash2, MapPin, Calendar, Type } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

interface GalleryFormProps {
    initialData?: {
        id: string;
        url: string;
        title: string | null;
        description: string | null;
        year: string | null;
        location: string | null;
        featured: boolean;
        status: string; // 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
    };
}

export default function GalleryForm({ initialData }: GalleryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: initialData || {
            url: '',
            title: '',
            description: '',
            year: '',
            location: '',
            featured: false,
            status: 'PUBLISHED'
        }
    });

    const imageUrl = watch('url');

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const url = initialData
                ? `/api/admin/gallery/${initialData.id}`
                : '/api/admin/gallery';

            const method = initialData ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            router.refresh();
            router.push('/admin/gallery');
            router.refresh(); // Ensure list is updated
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        if (!initialData) return;
        if (!confirm('Are you sure you want to delete this image?')) return;

        setIsLoading(true);
        try {
            await fetch(`/api/admin/gallery/${initialData.id}`, {
                method: 'DELETE',
            });
            router.refresh();
            router.push('/admin/gallery');
        } catch (error) {
            console.error('Delete error:', error);
            alert('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/gallery"
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData ? 'ছবি সম্পাদনা' : 'নতুন ছবি'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {initialData ? 'ছবির তথ্য পরিবর্তন করুন' : 'গ্যালারিতে নতুন ছবি যুক্ত করুন'}
                        </p>
                    </div>
                </div>
                {initialData && (
                    <button
                        onClick={onDelete}
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                        type="button"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Image Upload */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">ছবি আপলোড</h3>
                            <ImageUpload
                                value={imageUrl || ''}
                                onChange={(url) => setValue('url', url, { shouldValidate: true })}
                            />
                            {errors.url && (
                                <p className="text-red-500 text-sm mt-2">ছবি প্রয়োজন</p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">অতিরিক্ত তথ্য</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        সাল (Year)
                                    </div>
                                </label>
                                <input
                                    {...register('year')}
                                    placeholder="উদাহরণ: ১৯৯৫"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        স্থান (Location)
                                    </div>
                                </label>
                                <input
                                    {...register('location')}
                                    placeholder="উদাহরণ: ঢাকা, বাংলাদেশ"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Metadata */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <Type className="w-4 h-4 text-gray-400" />
                                        শিরোনাম (Title)
                                    </div>
                                </label>
                                <input
                                    {...register('title')}
                                    placeholder="ছবির শিরোনাম..."
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ (Description)</label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    placeholder="ছবির বিস্তারিত বিবরণ..."
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">স্ট্যাটাস</label>
                                    <select
                                        {...register('status')}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
                                    >
                                        <option value="PUBLISHED">প্রকাশিত</option>
                                        <option value="DRAFT">ড্রাফট</option>
                                        <option value="ARCHIVED">আর্কাইভ</option>
                                    </select>
                                </div>
                                <div className="flex items-end mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 font-medium">
                                        <input
                                            type="checkbox"
                                            {...register('featured')}
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        Featured Image?
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    সংরক্ষণ হচ্ছে...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    সংরক্ষণ করুন
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
