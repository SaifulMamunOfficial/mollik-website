'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Save, Image as ImageIcon, Trash2, AlertTriangle,
    FileText, Tag, Calendar, User, Sparkles, Eye, Upload, X, Check,
    Loader2, PenLine, Hash, FolderOpen
} from 'lucide-react'
import { generateSlug } from '@/lib/slugify'
import { useToast } from '@/components/ui/Toast'

interface Category {
    id: string
    name: string
    slug: string
}

interface BlogFormProps {
    initialData?: {
        id?: string
        title: string
        slug: string
        excerpt: string
        content: string
        coverImage: string
        categoryId: string
        tags: string[]
        status: string
        featured: boolean
        authorId?: string
        publishedAt?: string
    }
}

export default function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [authors, setAuthors] = useState<{ id: string, name: string }[]>([])
    const [uploading, setUploading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const { addToast } = useToast()

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        coverImage: initialData?.coverImage || '',
        categoryId: initialData?.categoryId || '',
        tags: initialData?.tags?.join(', ') || '',
        status: initialData?.status || 'PUBLISHED',
        featured: initialData?.featured || false,
        authorId: initialData?.authorId || '',
        publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().slice(0, 16) : ''
    })

    useEffect(() => {
        fetch('/api/categories?type=BLOG')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error)

        fetch('/api/admin/users/list')
            .then(res => res.json())
            .then(data => setAuthors(data))
            .catch(console.error)
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'blog')

        setUploading(true)
        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (res.ok) {
                setFormData(prev => ({ ...prev, coverImage: data.url }))
            } else {
                addToast({ type: 'error', title: 'আপলোড ব্যর্থ', message: data.message || 'ছবি আপলোড করা যায়নি' })
            }
        } catch (error) {
            console.error('Upload error:', error)
            addToast({ type: 'error', title: 'আপলোড ব্যর্থ', message: 'ছবি আপলোড করতে সমস্যা হয়েছে' })
        } finally {
            setUploading(false)
        }
    }

    const handleGenerateSlug = (value: string) => {
        if (!initialData || !formData.slug) {
            setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
        }
    }

    const handleSubmit = async (e: React.FormEvent, statusOverride?: string) => {
        e.preventDefault()
        setLoading(true)

        const finalStatus = statusOverride || formData.status
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            status: finalStatus
        }

        try {
            const url = initialData?.id
                ? `/api/admin/blog/${initialData.id}`
                : '/api/admin/blog'

            const method = initialData?.id ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                router.push('/admin/blog')
                router.refresh()
            } else {
                const data = await response.json()
                addToast({ type: 'error', title: 'সেভ ব্যর্থ', message: data.error || 'ব্লগ পোস্ট সেভ করতে সমস্যা হয়েছে' })
            }
        } catch (error) {
            console.error('Error:', error)
            addToast({ type: 'error', title: 'ত্রুটি', message: 'কিছু সমস্যা হয়েছে' })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!initialData?.id) return
        setDeleteLoading(true)

        try {
            const response = await fetch(`/api/admin/blog/${initialData.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/admin/blog')
                router.refresh()
            } else {
                addToast({ type: 'error', title: 'ডিলিট ব্যর্থ', message: 'পোস্ট ডিলিট করতে সমস্যা হয়েছে' })
            }
        } catch (error) {
            console.error('Error:', error)
            addToast({ type: 'error', title: 'ত্রুটি', message: 'কিছু সমস্যা হয়েছে' })
        } finally {
            setDeleteLoading(false)
            setShowDeleteModal(false)
        }
    }

    const SectionCard = ({
        title,
        icon: Icon,
        children,
        gradient = "from-gray-50 to-white",
        iconColor = "text-gray-600"
    }: {
        title: string
        icon: React.ElementType
        children: React.ReactNode
        gradient?: string
        iconColor?: string
    }) => (
        <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                </div>
                {children}
            </div>
        </div>
    )

    const InputField = ({
        label,
        required = false,
        children,
        hint
    }: {
        label: string
        required?: boolean
        children: React.ReactNode
        hint?: string
    }) => (
        <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/blog"
                                className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all duration-200 border border-white/10"
                            >
                                <ArrowLeft size={22} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2.5 py-0.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium text-white/90 border border-white/10">
                                        {initialData ? 'সম্পাদনা' : 'নতুন'}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {initialData ? 'ব্লগ পোস্ট সম্পাদনা' : 'নতুন ব্লগ পোস্ট তৈরি করুন'}
                                </h1>
                                <p className="text-white/70 mt-1 text-sm">
                                    {initialData ? 'আপনার পোস্টের তথ্য আপডেট করুন' : 'আকর্ষণীয় কনটেন্ট দিয়ে পাঠকদের মুগ্ধ করুন'}
                                </p>
                            </div>
                        </div>

                        {initialData && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="p-2.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl text-white transition-all duration-200 border border-red-400/20"
                                title="মুছুন"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Cover Image */}
                            <SectionCard title="কভার ইমেজ" icon={ImageIcon}>
                                <div className="space-y-4">
                                    {formData.coverImage ? (
                                        <div className="relative rounded-xl overflow-hidden border border-gray-200 group/img">
                                            <img
                                                src={formData.coverImage}
                                                alt="Cover preview"
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+URL'
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors bg-gray-50/50">
                                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                                <Upload className="w-7 h-7 text-emerald-600" />
                                            </div>
                                            <p className="text-gray-600 mb-2">ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="cover-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="cover-upload"
                                                className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        আপলোড হচ্ছে...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={16} />
                                                        ছবি নির্বাচন করুন
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>অথবা URL দিন:</span>
                                        <input
                                            type="url"
                                            value={formData.coverImage}
                                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Title & Slug */}
                            <SectionCard title="শিরোনাম ও লিংক" icon={PenLine}>
                                <div className="space-y-5">
                                    <InputField label="শিরোনাম" required>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => {
                                                setFormData({ ...formData, title: e.target.value })
                                                handleGenerateSlug(e.target.value)
                                            }}
                                            className="w-full px-4 py-3 text-lg font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white placeholder:text-gray-400"
                                            placeholder="আকর্ষণীয় শিরোনাম লিখুন..."
                                            required
                                        />
                                    </InputField>

                                    <InputField label="Slug (URL)" hint="এটি অটোমেটিক তৈরি হয়, প্রয়োজনে পরিবর্তন করুন">
                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                                            <span className="text-gray-400 text-sm font-mono">/blog/</span>
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-gray-700"
                                            />
                                        </div>
                                    </InputField>
                                </div>
                            </SectionCard>

                            {/* Excerpt */}
                            <SectionCard title="সংক্ষিপ্ত বিবরণ" icon={FileText}>
                                <InputField label="এক্সার্প্ট" required hint="পোস্টের প্রিভিউ হিসেবে দেখানো হবে">
                                    <textarea
                                        value={formData.excerpt || ''}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white placeholder:text-gray-400 resize-none"
                                        placeholder="২-৩ লাইনে পোস্টের সারসংক্ষেপ..."
                                        required
                                    />
                                </InputField>
                            </SectionCard>

                            {/* Content */}
                            <SectionCard title="পূর্ণ বিষয়বস্তু" icon={FileText}>
                                <InputField label="কনটেন্ট" required hint="Markdown ফরম্যাট সমর্থিত: **বোল্ড**, *ইটালিক*, # শিরোনাম">
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={18}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white placeholder:text-gray-400 font-mono text-sm leading-relaxed resize-none"
                                        placeholder="বিস্তারিত লিখুন..."
                                        required
                                    />
                                </InputField>
                            </SectionCard>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">

                            {/* Publish Settings */}
                            <div className="sticky top-6 space-y-6">

                                {/* Quick Actions */}
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                                        <Sparkles className="w-5 h-5 text-emerald-600" />
                                        দ্রুত অ্যাকশন
                                    </h3>
                                    <div className="space-y-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    সেভ হচ্ছে...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    {initialData ? 'আপডেট করুন' : 'প্রকাশ করুন'}
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => handleSubmit(e, 'DRAFT')}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                        >
                                            ড্রাফট হিসেবে সেভ
                                        </button>

                                        <Link
                                            href="/admin/blog"
                                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                                        >
                                            বাতিল করুন
                                        </Link>
                                    </div>
                                </div>

                                {/* Category & Tags */}
                                <SectionCard title="ক্যাটাগরি ও ট্যাগ" icon={FolderOpen}>
                                    <div className="space-y-4">
                                        <InputField label="ক্যাটাগরি">
                                            <select
                                                value={formData.categoryId}
                                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                                            >
                                                <option value="">নির্বাচন করুন</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </InputField>

                                        <InputField label="ট্যাগসমূহ" hint="কমা দিয়ে আলাদা করুন">
                                            <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 bg-white">
                                                <Hash className="w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.tags}
                                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                    placeholder="সাহিত্য, ইসলাম"
                                                    className="flex-1 border-none outline-none text-sm"
                                                />
                                            </div>
                                        </InputField>
                                    </div>
                                </SectionCard>

                                {/* Meta Settings */}
                                <SectionCard title="অতিরিক্ত সেটিংস" icon={Calendar}>
                                    <div className="space-y-4">
                                        <InputField label="প্রকাশের তারিখ">
                                            <input
                                                type="datetime-local"
                                                value={formData.publishedAt}
                                                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                                            />
                                        </InputField>

                                        <InputField label="লেখক">
                                            <select
                                                value={formData.authorId}
                                                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                                            >
                                                <option value="">ডিফল্ট (আপনি)</option>
                                                {authors.map(author => (
                                                    <option key={author.id} value={author.id}>{author.name}</option>
                                                ))}
                                            </select>
                                        </InputField>

                                        <div className="pt-2">
                                            <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.featured}
                                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 border-amber-300"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                                    <span className="text-sm font-medium text-amber-800">ফিচার্ড পোস্ট</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </SectionCard>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-7 h-7 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">আপনি কি নিশ্চিত?</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    এই পোস্টটি স্থায়ীভাবে মুছে যাবে।
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleteLoading}
                                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all flex items-center gap-2 font-medium shadow-lg shadow-red-500/25"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        মুছে ফেলা হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        মুছে ফেলুন
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
