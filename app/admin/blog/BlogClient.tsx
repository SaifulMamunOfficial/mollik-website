'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Eye, Check, X, Clock, Newspaper, Plus, PenTool, Search,
    Filter, MoreVertical, Calendar, User, Tag, TrendingUp,
    FileText, Sparkles, ChevronRight, ExternalLink
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    status: string
    featured: boolean
    views: number
    createdAt: string
    author: { name: string | null; email: string }
    category: { name: string } | null
}

interface Props {
    posts: BlogPost[]
}

export default function BlogClient({ posts }: Props) {
    const [items, setItems] = useState(posts)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const { addToast } = useToast()

    const filteredItems = useMemo(() => {
        return items.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.slug.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [items, searchQuery, statusFilter])

    const pendingPosts = items.filter(p => p.status === 'PENDING')
    const publishedPosts = items.filter(p => p.status === 'PUBLISHED')
    const draftPosts = items.filter(p => p.status === 'DRAFT')
    const totalViews = items.reduce((sum, p) => sum + (p.views || 0), 0)

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/blog/${id}/approve`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(post =>
                    post.id === id ? { ...post, status: 'PUBLISHED' } : post
                ))
                addToast({ type: 'success', title: 'অনুমোদিত!', message: 'পোস্টটি প্রকাশিত হয়েছে' })
            }
        } catch (error) {
            addToast({ type: 'error', title: 'ত্রুটি', message: 'অনুমোদন করতে সমস্যা হয়েছে' })
        }
    }

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/blog/${id}/reject`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(post =>
                    post.id === id ? { ...post, status: 'REJECTED' } : post
                ))
                addToast({ type: 'warning', title: 'বাতিল!', message: 'পোস্টটি বাতিল করা হয়েছে' })
            }
        } catch (error) {
            addToast({ type: 'error', title: 'ত্রুটি', message: 'বাতিল করতে সমস্যা হয়েছে' })
        }
    }

    const StatCard = ({
        icon: Icon,
        count,
        label,
        gradient,
        iconBg
    }: {
        icon: React.ElementType
        count: number
        label: string
        gradient: string
        iconBg: string
    }) => (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 group hover:scale-[1.02] transition-all duration-300`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">{count.toLocaleString('bn-BD')}</p>
                    <p className="text-sm text-white/80 font-medium">{label}</p>
                </div>
            </div>
        </div>
    )

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            PUBLISHED: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/25',
            DRAFT: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-500/25',
            PENDING: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/25',
            REJECTED: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/25'
        }
        const labels: Record<string, string> = {
            PUBLISHED: 'প্রকাশিত',
            DRAFT: 'ড্রাফট',
            PENDING: 'পেন্ডিং',
            REJECTED: 'বাতিল'
        }
        return (
            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-lg ${styles[status] || styles.DRAFT}`}>
                {labels[status] || status}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Newspaper className="w-5 h-5 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold text-white/90 border border-white/10">
                                    ব্লগ ম্যানেজমেন্ট
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                ব্লগ পরিচালনা
                            </h1>
                            <p className="text-white/70">
                                মোট {items.length.toLocaleString('bn-BD')}টি পোস্ট পরিচালনা করুন
                            </p>
                        </div>

                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-purple-700 rounded-xl font-bold hover:bg-white/90 transition-all shadow-xl shadow-black/10 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span>নতুন পোস্ট</span>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Clock}
                    count={pendingPosts.length}
                    label="অপেক্ষমান"
                    gradient="from-amber-500 to-orange-600"
                    iconBg="bg-white/20"
                />
                <StatCard
                    icon={Check}
                    count={publishedPosts.length}
                    label="প্রকাশিত"
                    gradient="from-emerald-500 to-teal-600"
                    iconBg="bg-white/20"
                />
                <StatCard
                    icon={FileText}
                    count={draftPosts.length}
                    label="ড্রাফট"
                    gradient="from-slate-500 to-gray-600"
                    iconBg="bg-white/20"
                />
                <StatCard
                    icon={TrendingUp}
                    count={totalViews}
                    label="মোট ভিউ"
                    gradient="from-blue-500 to-indigo-600"
                    iconBg="bg-white/20"
                />
            </div>

            {/* Pending Posts Alert */}
            {pendingPosts.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-amber-800">অনুমোদনের অপেক্ষায়</h2>
                            <p className="text-sm text-amber-600">{pendingPosts.length}টি পোস্ট রিভিউ করুন</p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {pendingPosts.slice(0, 3).map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-100 hover:shadow-md transition-shadow">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {post.author.name || post.author.email} • {new Date(post.createdAt).toLocaleDateString('bn-BD')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Link
                                        href={`/admin/blog/${post.id}`}
                                        className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleApprove(post.id)}
                                        className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleReject(post.id)}
                                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="পোস্ট খুঁজুন..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'PUBLISHED', 'PENDING', 'DRAFT'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${statusFilter === status
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {status === 'all' ? 'সব' :
                                status === 'PUBLISHED' ? 'প্রকাশিত' :
                                    status === 'PENDING' ? 'পেন্ডিং' : 'ড্রাফট'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Grid/Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-800">সব পোস্ট</h2>
                        <span className="text-sm text-gray-500">{filteredItems.length}টি ফলাফল</span>
                    </div>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Newspaper className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-2">কোনো পোস্ট নেই</h3>
                        <p className="text-gray-500 mb-6">নতুন ব্লগ পোস্ট তৈরি করুন</p>
                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                        >
                            <Plus size={18} />
                            নতুন পোস্ট
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredItems.map((post) => (
                            <div key={post.id} className="p-5 hover:bg-gray-50/50 transition-colors group">
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 relative">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                        {post.featured && (
                                            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                                                <Sparkles className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                                    /{post.slug}
                                                </p>
                                            </div>
                                            <StatusBadge status={post.status} />
                                        </div>

                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <User className="w-4 h-4" />
                                                {post.author.name || post.author.email}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(post.createdAt).toLocaleDateString('bn-BD')}
                                            </span>
                                            {post.category && (
                                                <span className="flex items-center gap-1.5">
                                                    <Tag className="w-4 h-4" />
                                                    {post.category.name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1.5">
                                                <Eye className="w-4 h-4" />
                                                {(post.views || 0).toLocaleString('bn-BD')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                            title="লাইভ দেখুন"
                                        >
                                            <ExternalLink size={18} />
                                        </Link>
                                        <Link
                                            href={`/admin/blog/${post.id}`}
                                            className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                                            title="সম্পাদনা"
                                        >
                                            <PenTool size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
