'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Music, Upload } from 'lucide-react'

export default function NewAudioPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        artist: 'মতিউর রহমান মল্লিক',
        album: '',
        duration: '',
        audioUrl: '',
        coverImage: '',
        lyrics: ''
    })

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
            const response = await fetch('/api/admin/audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push('/admin/audio')
            } else {
                alert('অডিও সেভ করতে সমস্যা হয়েছে')
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
                    href="/admin/audio"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">নতুন অডিও যোগ করুন</h1>
                    <p className="text-gray-600 mt-1">গান বা আবৃত্তি আপলোড করুন</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Audio URL */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Music className="inline mr-2" size={18} />
                        অডিও ফাইল URL *
                    </label>
                    <input
                        type="url"
                        value={formData.audioUrl}
                        onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                        placeholder="https://example.com/audio.mp3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        MP3, WAV বা OGG ফরম্যাটের ফাইল URL দিন
                    </p>
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                শিল্পী
                            </label>
                            <input
                                type="text"
                                value={formData.artist}
                                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                অ্যালবাম
                            </label>
                            <input
                                type="text"
                                value={formData.album}
                                onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
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
                                placeholder="৪:৩০"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                কভার ইমেজ URL
                            </label>
                            <input
                                type="url"
                                value={formData.coverImage}
                                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            লিরিক্স (ঐচ্ছিক)
                        </label>
                        <textarea
                            value={formData.lyrics}
                            onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="গানের কথা লিখুন..."
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/audio"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        বাতিল
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                </div>
            </form>
        </div>
    )
}
