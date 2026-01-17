'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Star, Search, Image, Upload, Check, X, Clock } from 'lucide-react'

interface GalleryImage {
    id: string
    title: string | null
    url: string
    year: string | null
    featured: boolean
    status: string
    submittedBy: string | null
}

interface Props {
    images: GalleryImage[]
}

export default function GalleryClient({ images }: Props) {
    const [items, setItems] = useState(images)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const pendingImages = items.filter(i => i.status === 'PENDING')
    const publishedImages = items.filter(i => i.status === 'PUBLISHED')
    const featuredCount = publishedImages.filter(i => i.featured).length

    const filteredImages = items.filter(img => {
        if (filter === 'pending') return img.status === 'PENDING'
        if (filter === 'featured') return img.featured
        if (filter === 'published') return img.status === 'PUBLISHED'
        return true
    }).filter(img =>
        !search || img.title?.toLowerCase().includes(search.toLowerCase())
    )

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/gallery/${id}/approve`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(img =>
                    img.id === id ? { ...img, status: 'PUBLISHED' } : img
                ))
            }
        } catch (error) {
            console.error('Approve error:', error)
        }
    }

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/gallery/${id}/reject`, { method: 'POST' })
            if (res.ok) {
                setItems(items.filter(img => img.id !== id))
            }
        } catch (error) {
            console.error('Reject error:', error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">গ্যালারি পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">
                        {publishedImages.length}টি ছবি • {featuredCount}টি ফিচার্ড
                        {pendingImages.length > 0 && (
                            <span className="text-amber-600"> • {pendingImages.length}টি অনুমোদনের অপেক্ষায়</span>
                        )}
                    </p>
                </div>
                <Link
                    href="/admin/gallery/upload"
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                    <Upload size={20} />
                    <span>ছবি আপলোড</span>
                </Link>
            </div>

            {/* Pending Section */}
            {pendingImages.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="text-amber-600" size={20} />
                        <h2 className="font-semibold text-amber-800">অনুমোদনের অপেক্ষায় ({pendingImages.length})</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {pendingImages.map((image) => (
                            <div key={image.id} className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                                <img
                                    src={image.url}
                                    alt={image.title || 'Pending Image'}
                                    className="w-full h-24 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleApprove(image.id)}
                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                                        title="অনুমোদন"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleReject(image.id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        title="বাতিল"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="ছবি খুঁজুন..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="all">সব ছবি</option>
                        <option value="published">প্রকাশিত</option>
                        <option value="pending">পেন্ডিং</option>
                        <option value="featured">ফিচার্ড</option>
                    </select>
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                        <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">কোনো ছবি নেই</p>
                        <Link
                            href="/admin/gallery/upload"
                            className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                        >
                            <Upload size={20} />
                            <span>প্রথম ছবি আপলোড করুন</span>
                        </Link>
                    </div>
                ) : (
                    filteredImages.filter(i => i.status === 'PUBLISHED').map((image) => (
                        <div key={image.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.title || 'Gallery Image'}
                                className="w-full h-40 object-cover"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    className={`p-2 rounded-full transition-colors ${image.featured
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-white/20 text-white hover:bg-amber-500'
                                        }`}
                                    title={image.featured ? 'ফিচার্ড' : 'ফিচার করুন'}
                                >
                                    <Star size={18} fill={image.featured ? 'currentColor' : 'none'} />
                                </button>
                                <button
                                    className="p-2 bg-white/20 text-white rounded-full hover:bg-red-500 transition-colors"
                                    title="মুছুন"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Featured Badge */}
                            {image.featured && (
                                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Star size={12} fill="currentColor" />
                                    ফিচার্ড
                                </div>
                            )}

                            {/* Info */}
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {image.title || 'Untitled'}
                                </p>
                                {image.year && (
                                    <p className="text-xs text-gray-500">{image.year}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
