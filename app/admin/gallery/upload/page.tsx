'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Image, Upload, X, Plus } from 'lucide-react'

export default function GalleryUploadPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([{
        url: '',
        title: '',
        description: '',
        year: '',
        featured: false
    }])

    const addImage = () => {
        setImages([...images, {
            url: '',
            title: '',
            description: '',
            year: '',
            featured: false
        }])
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const updateImage = (index: number, field: string, value: any) => {
        const updated = [...images]
        updated[index] = { ...updated[index], [field]: value }
        setImages(updated)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Upload each image
            for (const image of images) {
                if (!image.url) continue

                await fetch('/api/admin/gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(image),
                })
            }

            router.push('/admin/gallery')
        } catch (error) {
            console.error('Error:', error)
            alert('ছবি সেভ করতে সমস্যা হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/gallery"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">গ্যালারিতে ছবি যোগ করুন</h1>
                    <p className="text-gray-600 mt-1">একাধিক ছবি একসাথে যোগ করতে পারেন</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {images.map((image, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">ছবি #{index + 1}</h3>
                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left - Image Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ছবির URL *
                                </label>
                                <input
                                    type="url"
                                    value={image.url}
                                    onChange={(e) => updateImage(index, 'url', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                                {image.url && (
                                    <div className="mt-4">
                                        <img
                                            src={image.url}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Right - Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        শিরোনাম
                                    </label>
                                    <input
                                        type="text"
                                        value={image.title}
                                        onChange={(e) => updateImage(index, 'title', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        বিবরণ
                                    </label>
                                    <textarea
                                        value={image.description}
                                        onChange={(e) => updateImage(index, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            সাল
                                        </label>
                                        <input
                                            type="text"
                                            value={image.year}
                                            onChange={(e) => updateImage(index, 'year', e.target.value)}
                                            placeholder="২০০৫"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={image.featured}
                                                onChange={(e) => updateImage(index, 'featured', e.target.checked)}
                                                className="rounded text-teal-600 focus:ring-teal-500"
                                            />
                                            <span className="text-sm text-gray-700">ফিচার্ড</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add More */}
                <button
                    type="button"
                    onClick={addImage}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    আরো ছবি যোগ করুন
                </button>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/gallery"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        বাতিল
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'সেভ হচ্ছে...' : `${images.length}টি ছবি সেভ করুন`}
                    </button>
                </div>
            </form>
        </div>
    )
}
