'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, User, Mail, Shield, Save, ArrowLeft, AlignLeft, Info } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

interface UserFormData {
    name: string;
    email: string;
    username?: string;
    role: string;
    image?: string;
    bio?: string;
    password?: string; // Only for new users
}

interface UserFormProps {
    initialData?: any;
}

export default function UserForm({ initialData }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<UserFormData>({
        defaultValues: initialData || {
            name: '',
            email: '',
            username: '',
            role: 'USER',
            image: '',
            bio: '',
            password: ''
        },
    });

    const imageUrl = watch('image');

    // Auto-generate username from name if creating new user
    // Simple logic, can be improved
    const name = watch('name');
    useEffect(() => {
        if (!initialData && name && !watch('username')) {
            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setValue('username', slug);
        }
    }, [name, initialData, setValue, watch]);

    const onSubmit = async (data: UserFormData) => {
        setSubmitting(true);
        try {
            const url = initialData
                ? `/api/admin/users/${initialData.id}`
                : '/api/admin/users';

            const method = initialData ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            router.push('/admin/users');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('ইউজার সেভ করতে সমস্যা হয়েছে');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/users"
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData ? 'ইউজার এডিট করুন' : 'নতুন ইউজার'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {initialData ? 'বিদ্যমান ইউজারের তথ্য পরিবর্তন করুন' : 'সিস্টেমে নতুন ইউজার যুক্ত করুন'}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    <span>সেভ করুন</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Role */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">প্রোফাইল ছবি</h3>
                        <ImageUpload
                            value={imageUrl || ''}
                            onChange={(url) => setValue('image', url)}
                        />
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            প্রস্তাবিত সাইজ: 500x500px (বর্গাকার)
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-500" />
                            ইউজার রোল
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <select
                                    {...register('role')}
                                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                                >
                                    <option value="USER">সদস্য (User)</option>
                                    <option value="EDITOR">এডিটর (Editor)</option>
                                    <option value="MANAGER">ম্যানেজার (Manager)</option>
                                    <option value="ADMIN">অ্যাডমিন (Admin)</option>
                                </select>
                                <Shield className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700 leading-relaxed border border-blue-100 flex gap-2">
                                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>
                                    <strong>নোট:</strong> রোল পরিবর্তন করলে ইউজারের পারমিশন লেভেল পরিবর্তন হবে। অ্যাডমিন সব কিছু অ্যাক্সেস করতে পারে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Basic Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            মৌলিক তথ্য
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">নাম <span className="text-red-500">*</span></label>
                                <input
                                    {...register('name', { required: 'নাম প্রয়োজন' })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    placeholder="পুরো নাম"
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ইউজারনেম (slug)</label>
                                <input
                                    {...register('username')}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-mono text-sm"
                                    placeholder="username-slug"
                                />
                                <p className="text-xs text-gray-400">Unique URL identifier (auto-generated)</p>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">ইমেইল <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        {...register('email', { required: 'ইমেইল প্রয়োজন' })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        placeholder="example@email.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>

                            {!initialData && (
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">পাসওয়ার্ড (নতুন ইউজারের জন্য)</label>
                                    <input
                                        type="password"
                                        {...register('password', { required: !initialData ? 'পাসওয়ার্ড প্রয়োজন' : false, minLength: { value: 6, message: 'কমপক্ষে ৬ অক্ষরের হতে হবে' } })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                                </div>
                            )}

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">বায়ো / পরিচিতি</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                                    <textarea
                                        {...register('bio')}
                                        rows={4}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                                        placeholder="ব্যবহারকারী সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
