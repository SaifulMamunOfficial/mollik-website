'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateSlug } from '@/lib/slugify'
import { ArrowLeft, Save, Eye, Trash2, AlertTriangle, Music } from 'lucide-react'

interface AudioFormProps {
    initialData?: {
        id?: string
        title: string
        slug: string
        audioUrl: string
        coverImage?: string
        artist?: string
        album?: string
        duration?: string
        lyrics?: string
        status: string
    }
}

export default function AudioForm({ initialData }: AudioFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        audioUrl: initialData?.audioUrl || '',
        coverImage: initialData?.coverImage || '',
        artist: initialData?.artist || '',
        album: initialData?.album || '',
        duration: initialData?.duration || '',
        lyrics: initialData?.lyrics || '',
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
            const response = await fetch(`/api/admin/audio/${initialData.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/admin/audio')
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
                ? `/api/admin/audio/${initialData.id}`
                : '/api/admin/audio'

            const method = initialData?.id ? 'PUT' : 'POST'

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push('/admin/audio')
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
                            href="/admin/audio"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {initialData?.id ? 'অডিও সম্পাদনা' : 'নতুন অডিও'}
                            </h1>
                            <p className="text-gray-600 mt-1">অডিওর বিস্তারিত তথ্য পূরণ করুন</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Audio doesn't have a public view page yet like /audio/[slug], but if it did... */}
                        {/* We will omit Play/View button for now or just keep delete */}
                        {initialData?.id && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                            >
                                <Trash2 size={18} />
                                <span>মুছুন</span>
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="অডিওর শিরোনাম লিখুন"
                            />
                        </div>

                        {/* Audio URL */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                অডিও লিঙ্ক (URL) *
                            </label>
                            <input
                                type="text"
                                value={formData.audioUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, audioUrl: e.target.value }))}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="https://..."
                            />
                        </div>

                        {/* Lyrics */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                লিরিক্স (যদি থাকে)
                            </label>
                            <textarea
                                value={formData.lyrics}
                                onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
                                rows={10}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-bengali"
                                placeholder="এখানে গানের কথা বা লিরিক্স..."
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="url-slug"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">মেটাডাটা</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        শিল্পী
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.artist}
                                        onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="শিল্পীর নাম"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        অ্যালবাম
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.album}
                                        onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="অ্যালবামের নাম"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        সময়কাল (Duration)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="০৫:৩০"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                কভার ইমেজ URL
                            </label>
                            <input
                                type="text"
                                value={formData.coverImage}
                                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="https://..."
                            />
                            {formData.coverImage && (
                                <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                                    <img
                                        src={formData.coverImage}
                                        alt="Output"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder.png' // Fallback
                                        }}
                                    />
                                </div>
                            )}
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
                                    এই অডিওটি মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
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
