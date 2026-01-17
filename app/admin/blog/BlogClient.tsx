'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Check, X, Clock, Newspaper, Plus } from 'lucide-react'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    status: string
    createdAt: string
    author: { name: string | null; email: string }
    category: { name: string } | null
}

interface Props {
    posts: BlogPost[]
}

export default function BlogClient({ posts }: Props) {
    const [items, setItems] = useState(posts)

    const pendingPosts = items.filter(p => p.status === 'PENDING')
    const publishedPosts = items.filter(p => p.status === 'PUBLISHED')
    const draftPosts = items.filter(p => p.status === 'DRAFT')

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/blog/${id}/approve`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(post =>
                    post.id === id ? { ...post, status: 'PUBLISHED' } : post
                ))
            }
        } catch (error) {
            console.error('Approve error:', error)
        }
    }

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/blog/${id}/reject`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(post =>
                    post.id === id ? { ...post, status: 'REJECTED' } : post
                ))
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
                    <h1 className="text-2xl font-bold text-gray-900">ব্লগ পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">মোট {items.length}টি পোস্ট</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>নতুন পোস্ট</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="text-amber-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-amber-700">{pendingPosts.length}</p>
                            <p className="text-sm text-amber-600">অনুমোদনের অপেক্ষায়</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Check className="text-green-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-green-700">{publishedPosts.length}</p>
                            <p className="text-sm text-green-600">প্রকাশিত</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Newspaper className="text-gray-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{draftPosts.length}</p>
                            <p className="text-sm text-gray-600">ড্রাফট</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Posts */}
            {pendingPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
                        <h2 className="font-semibold text-amber-800">অনুমোদনের অপেক্ষায় ({pendingPosts.length})</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {pendingPosts.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{post.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span>লেখক: {post.author.name || post.author.email}</span>
                                            <span>•</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link
                                            href={`/admin/blog/${post.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="দেখুন"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleApprove(post.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="অনুমোদন"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleReject(post.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="বাতিল"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Posts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">সব পোস্ট</h2>
                </div>
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <Newspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">কোনো ব্লগ পোস্ট পাওয়া যায়নি</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">শিরোনাম</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">লেখক</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">স্ট্যাটাস</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">তারিখ</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{post.title}</div>
                                        <div className="text-sm text-gray-500">{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {post.author.name || post.author.email}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${post.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : post.status === 'DRAFT'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : post.status === 'REJECTED'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-amber-100 text-amber-700'
                                            }
                    `}>
                                            {post.status === 'PUBLISHED' ? 'প্রকাশিত' :
                                                post.status === 'DRAFT' ? 'ড্রাফট' :
                                                    post.status === 'REJECTED' ? 'বাতিল' : 'পেন্ডিং'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(post.createdAt).toLocaleDateString('bn-BD')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/blog/${post.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="দেখুন/সম্পাদনা"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
