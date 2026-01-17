'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'

interface Category {
    id: string
    name: string
    slug: string
}

interface Book {
    id: string
    title: string
    slug: string
}

interface PoemFormProps {
    categories: Category[]
    books: Book[]
    initialData?: {
        id?: string
        title: string
        slug: string
        content: string
        excerpt?: string
        categoryId?: string
        bookId?: string
        year?: string
        status: string
    }
}

export default function PoemForm({ categories, books, initialData }: PoemFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        categoryId: initialData?.categoryId || '',
        bookId: initialData?.bookId || '',
        year: initialData?.year || '',
        status: initialData?.status || 'DRAFT',
    })

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const endpoint = initialData?.id
                ? `/api/admin/poems/${initialData.id}`
                : '/api/admin/poems'

            const method = initialData?.id ? 'PUT' : 'POST'

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: 'POEM',
                }),
            })

            if (response.ok) {
                router.push('/admin/poems')
                router.refresh()
            } else {
                const error = await response.json()
                alert(error.message || 'কিছু সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/poems"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData?.id ? 'কবিতা সম্পাদনা' : 'নতুন কবিতা'}
                        </h1>
                        <p className="text-gray-600 mt-1">কবিতার বিস্তারিত তথ্য পূরণ করুন</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {initialData?.id && (
                        <Link
                            href={`/poems/${formData.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            <Eye size={18} />
                            <span>প্রিভিউ</span>
                        </Link>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        <span>{loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            শিরোনাম *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="কবিতার শিরোনাম লিখুন"
                        />
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            কবিতা *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            required
                            rows={15}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bengali"
                            placeholder="এখানে কবিতা লিখুন..."
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            প্রতিটি লাইন আলাদা করতে Enter চাপুন
                        </p>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            সংক্ষিপ্ত বিবরণ
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="কবিতার প্রথম কয়েক লাইন বা সারসংক্ষেপ"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">প্রকাশ সেটিংস</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    স্ট্যাটাস
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="DRAFT">ড্রাফট</option>
                                    <option value="PUBLISHED">প্রকাশিত</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    স্লাগ
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="url-slug"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    রচনার বছর
                                </label>
                                <input
                                    type="text"
                                    value={formData.year}
                                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="১৯৯০"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">ক্যাটাগরি</h3>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">-- ক্যাটাগরি নির্বাচন করুন --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Book */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">বই</h3>
                        <select
                            value={formData.bookId}
                            onChange={(e) => setFormData(prev => ({ ...prev, bookId: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">-- বই নির্বাচন করুন --</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>{book.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </form>
    )
}
