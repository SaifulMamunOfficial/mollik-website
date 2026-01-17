'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Video, Youtube } from 'lucide-react'

import { generateSlug } from '@/lib/slugify'

export default function NewVideoPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        youtubeId: '',
        duration: '',
        category: '',
        featured: false
    })

    const extractYoutubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        return match ? match[1] : url
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/admin/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    youtubeId: extractYoutubeId(formData.youtubeId)
                }),
            })

            const data = await response.json()

            if (response.ok) {
                router.push('/admin/videos')
                router.refresh()
            } else {
                alert(data.error || 'ভিডিও সেভ করতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/videos"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">নতুন ভিডিও যোগ করুন</h1>
                    <p className="text-gray-600 mt-1">YouTube ভিডিও লিংক দিন</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* YouTube URL */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Youtube className="inline mr-2" size={18} />
                        YouTube ভিডিও URL বা ID *
                    </label>
                    <input
                        type="text"
                        value={formData.youtubeId}
                        onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=xxxxx অথবা xxxxx"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                    />
                    {formData.youtubeId && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">প্রিভিউ:</p>
                            <img
                                src={`https://img.youtube.com/vi/${extractYoutubeId(formData.youtubeId)}/maxresdefault.jpg`}
                                alt="Video thumbnail"
                                className="w-full max-w-md rounded-lg"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            বিবরণ
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                সময়কাল
                            </label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="৫:৩০"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ক্যাটাগরি
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">নির্বাচন করুন</option>
                                <option value="hamd">হামদ</option>
                                <option value="naat">নাত</option>
                                <option value="gojol">গজল</option>
                                <option value="interview">সাক্ষাৎকার</option>
                                <option value="documentary">ডকুমেন্টারি</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="rounded text-red-600 focus:ring-red-500"
                        />
                        <label htmlFor="featured" className="text-sm text-gray-700">
                            ফিচার্ড ভিডিও হিসেবে দেখান
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/videos"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        বাতিল
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                </div>
            </form>
        </div>
    )
}
