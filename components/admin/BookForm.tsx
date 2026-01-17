'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from './ImageUpload'
import { generateSlug } from '@/lib/slugify'
import { AlertTriangle } from 'lucide-react'

interface BookFormProps {
    initialData?: {
        id?: string
        title: string
        slug: string
        subtitle?: string
        description?: string
        year?: string
        publisher?: string
        coverImage?: string
        categoryId: string
    }
}

export default function BookForm({ initialData }: BookFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        subtitle: initialData?.subtitle || '',
        description: initialData?.description || '',
        year: initialData?.year || '',
        publisher: initialData?.publisher || '',
        coverImage: initialData?.coverImage || '',
        categoryId: initialData?.categoryId || 'poetry',
    })

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            // Always update slug when title changes (for new books)
            slug: !initialData?.id ? generateSlug(title) : prev.slug
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const endpoint = initialData?.id
                ? `/api/admin/books/${initialData.id}`
                : '/api/admin/books'

            const method = initialData?.id ? 'PUT' : 'POST'

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push('/admin/books')
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

    const handleDelete = async () => {
        if (!initialData?.id) return
        setDeleteLoading(true)

        try {
            const response = await fetch(`/api/admin/books/${initialData.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/admin/books')
                router.refresh()
            } else {
                alert('বইটি ডিলিট করতে সমস্যা হয়েছে')
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
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/books"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {initialData?.id ? 'বই সম্পাদনা' : 'নতুন বই'}
                            </h1>
                            <p className="text-gray-600 mt-1">বইয়ের বিস্তারিত তথ্য পূরণ করুন</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {initialData?.id && (
                            <>
                                <Link
                                    href={`/books/${formData.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    <Eye size={18} />
                                    <span>প্রিভিউ</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-300"
                                    title="মুছুন"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
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
                                বইয়ের নাম *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleTitleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="বইয়ের নাম লিখুন"
                            />
                        </div>

                        {/* Subtitle */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                উপশিরোনাম
                            </label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="বইয়ের উপশিরোনাম (যদি থাকে)"
                            />
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                বর্ণনা
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="বইয়ের বর্ণনা লিখুন..."
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <ImageUpload
                                value={formData.coverImage}
                                onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                                folder="books"
                                label="বইয়ের প্রচ্ছদ"
                            />
                        </div>

                        {/* Settings */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">সেটিংস</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        স্লাগ
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="url-slug"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ক্যাটাগরি
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="poetry">কবিতা সংকলন</option>
                                        <option value="songs">গান সংকলন</option>
                                        <option value="essays">প্রবন্ধ সংকলন</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        প্রকাশের বছর
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.year}
                                        onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="১৯৯০"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        প্রকাশনী
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.publisher}
                                        onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="প্রকাশনীর নাম"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
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
                                    এই বইটি মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
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
