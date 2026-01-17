'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Image, Eye } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
}

export default function AdminNewBlogPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        categoryId: '',
        tags: '',
        status: 'PUBLISHED', // Admin posts are published directly
        featured: false
    })

    useEffect(() => {
        // Fetch categories
        fetch('/api/categories?type=BLOG')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error)
    }, [])

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                }),
            })

            if (response.ok) {
                router.push('/admin/blog')
            } else {
                const data = await response.json()
                alert(data.message || 'ব্লগ পোস্ট সেভ করতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setLoading(false)
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
                        <h1 className="text-2xl font-bold text-gray-900">নতুন ব্লগ পোস্ট</h1>
                        <p className="text-gray-600 mt-1">অ্যাডমিন হিসেবে ব্লগ পোস্ট করুন</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        সরাসরি প্রকাশিত হবে
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                            onChange={(e) => setFormData({
                                ...formData,
                                title: e.target.value,
                                slug: generateSlug(e.target.value)
                            })}
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
                        value={formData.excerpt}
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
                        onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
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
                        {loading ? 'প্রকাশ হচ্ছে...' : 'প্রকাশ করুন'}
                    </button>
                </div>
            </form>
        </div>
    )
}
