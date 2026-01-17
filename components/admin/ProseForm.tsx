'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateSlug } from '@/lib/slugify'
import { ArrowLeft, Save, Eye, Trash2, AlertTriangle } from 'lucide-react'

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

interface ProseFormProps {
    categories: Category[]
    books: Book[]
    initialData?: {
        id?: string
        title: string
        slug: string
        content: string
        excerpt?: string
        readTime?: string
        categoryId?: string
        bookId?: string
        year?: string
        status: string
    }
}

export default function ProseForm({ categories, books, initialData }: ProseFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        readTime: initialData?.readTime || '',
        categoryId: initialData?.categoryId || '',
        bookId: initialData?.bookId || '',
        year: initialData?.year || '',
        status: initialData?.status || 'DRAFT',
    })

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug === initialData?.slug && initialData?.slug ? prev.slug : (prev.slug || generateSlug(title))
        }))
    }

    const handleDelete = async () => {
        if (!initialData?.id) return
        setLoading(true)

        try {
            const response = await fetch(`/api/admin/prose/${initialData.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/admin/prose')
                router.refresh()
            } else {
                alert('মুছে ফেলতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const endpoint = initialData?.id
                ? `/api/admin/prose/${initialData.id}`
                : '/api/admin/prose'

            const method = initialData?.id ? 'PUT' : 'POST'

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: 'ESSAY',
                }),
            })

            if (response.ok) {
                router.push('/admin/prose')
                router.refresh()
            } else {
                const error = await response.json()
                alert(error.message || error.error || 'কিছু সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/prose"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {initialData?.id ? 'গদ্য/প্রবন্ধ সম্পাদনা' : 'নতুন গদ্য/প্রবন্ধ'}
                            </h1>
                            <p className="text-gray-600 mt-1">প্রবন্ধের বিস্তারিত তথ্য পূরণ করুন</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {initialData?.id && (
                            <>
                                <Link
                                    href={`/prose/${formData.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    <Eye size={18} />
                                    <span>প্রিভিউ</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 size={18} />
                                    <span>মুছুন</span>
                                </button>
                            </>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="প্রবন্ধের শিরোনাম লিখুন"
                            />
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                বিষয়বস্তু (Content) *
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                required
                                rows={15}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bengali"
                                placeholder="এখানে প্রবন্ধ লিখুন..."
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                প্রতিটি লাইন আলাদা করতে Enter চাপুন
                            </p>
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                সংক্ষিপ্ত বিবরণ (Excerpt)
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="প্রবন্ধের সারসংক্ষেপ"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="url-slug"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        পাঠের সময় (Read Time)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.readTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="৫ মিনিট"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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

            {/* Delete Modal */}
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
                                    এই প্রবন্ধটি মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={loading}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {loading ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
