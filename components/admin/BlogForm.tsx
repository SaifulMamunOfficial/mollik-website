'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Image, Trash2, AlertTriangle } from 'lucide-react'
import { generateSlug } from '@/lib/slugify'

interface Category {
    id: string
    name: string
    slug: string
}

interface BlogFormProps {
    initialData?: {
        id?: string
        title: string
        slug: string
        excerpt: string
        content: string
        coverImage: string
        categoryId: string
        tags: string[]
        status: string
        featured: boolean
    }
}

export default function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        coverImage: initialData?.coverImage || '',
        categoryId: initialData?.categoryId || '',
        tags: initialData?.tags?.join(', ') || '',
        status: initialData?.status || 'PUBLISHED',
        featured: initialData?.featured || false
    })

    useEffect(() => {
        // Fetch categories
        fetch('/api/categories?type=BLOG')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error)
    }, [])

    const handleGenerateSlug = (value: string) => {
        // Only auto-generate slug if it's a new post or if slug is empty
        if (!initialData || !formData.slug) {
            setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
        }
    }

    const handleSubmit = async (e: React.FormEvent, statusOverride?: string) => {
        e.preventDefault()
        setLoading(true)

        const finalStatus = statusOverride || formData.status
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            status: finalStatus
        }

        try {
            const url = initialData?.id
                ? `/api/admin/blog/${initialData.id}`
                : '/api/admin/blog'

            const method = initialData?.id ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                router.push('/admin/blog')
                router.refresh()
            } else {
                const data = await response.json()
                alert(data.error || 'ব্লগ পোস্ট সেভ করতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!initialData?.id) return
        setDeleteLoading(true)

        try {
            const response = await fetch(`/api/admin/blog/${initialData.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/admin/blog')
                router.refresh()
            } else {
                alert('ডিলিট করতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setDeleteLoading(false)
            setShowDeleteModal(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData ? 'ব্লগ পোস্ট সম্পাদনা' : 'নতুন ব্লগ পোস্ট'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {initialData ? 'পোস্টের তথ্য আপডেট করুন' : 'অ্যাডমিন হিসেবে ব্লগ পোস্ট করুন'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {initialData && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="মুছুন"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                {/* Cover Image */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Image className="inline mr-2" size={18} />
                        কভার ইমেজ URL
                    </label>
                    <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    {formData.coverImage && (
                        <div className="mt-4">
                            <img
                                src={formData.coverImage}
                                alt="Cover preview"
                                className="w-full max-h-64 object-cover rounded-lg"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+URL'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Title & Slug */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            শিরোনাম *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value })
                                handleGenerateSlug(e.target.value)
                            }}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="আকর্ষণীয় শিরোনাম লিখুন..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">/blog/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Excerpt */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        সংক্ষিপ্ত বিবরণ *
                    </label>
                    <textarea
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="পোস্টের সংক্ষিপ্ত বিবরণ (২-৩ লাইন)..."
                        required
                    />
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        পূর্ণ বিষয়বস্তু *
                    </label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                        placeholder="বিস্তারিত লিখুন... (Markdown সমর্থিত)"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Markdown ফরম্যাট ব্যবহার করতে পারেন: **বোল্ড**, *ইটালিক*, # শিরোনাম
                    </p>
                </div>

                {/* Category & Tags */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ক্যাটাগরি
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">নির্বাচন করুন</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                                <option value="literature">সাহিত্য ও সংস্কৃতি</option>
                                <option value="contemporary">সমসাময়িক</option>
                                <option value="religion">ধর্ম ও জীবন</option>
                                <option value="science">বিজ্ঞান ও প্রযুক্তি</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ট্যাগ (কমা দিয়ে আলাদা করুন)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="সাহিত্য, ইসলাম, ইতিহাস"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-gray-700">ফিচার্ড পোস্ট হিসেবে দেখান</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/blog"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        বাতিল
                    </Link>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'DRAFT')}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        ড্রাফট সেভ
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'সেভ হচ্ছে...' : (initialData ? 'আপডেট করুন' : 'প্রকাশ করুন')}
                    </button>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">আপনি কি নিশ্চিত?</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    এই পোস্টটি মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {deleteLoading ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
