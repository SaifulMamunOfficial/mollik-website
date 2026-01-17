'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    folder?: string
    label?: string
    className?: string
}

export default function ImageUpload({
    value,
    onChange,
    folder = 'general',
    label = 'ছবি আপলোড করুন',
    className = ''
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('folder', folder)

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                onChange(data.url)
            } else {
                setError(data.message || 'আপলোড ব্যর্থ হয়েছে')
            }
        } catch (err) {
            console.error('Upload error:', err)
            setError('আপলোড করতে সমস্যা হয়েছে')
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemove = () => {
        onChange('')
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-amber-400 transition-colors">
                {value ? (
                    <div className="relative">
                        <img
                            src={value}
                            alt="Uploaded"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div>
                        {uploading ? (
                            <div className="py-8">
                                <Loader2 className="mx-auto h-10 w-10 text-amber-500 animate-spin" />
                                <p className="mt-2 text-sm text-gray-500">আপলোড হচ্ছে...</p>
                            </div>
                        ) : (
                            <label className="cursor-pointer block py-8">
                                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    ক্লিক করুন অথবা ফাইল ড্রপ করুন
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, GIF, WebP (সর্বোচ্চ 10MB)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                )}
            </div>

            {/* URL Input as fallback */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">অথবা URL দিন:</span>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
