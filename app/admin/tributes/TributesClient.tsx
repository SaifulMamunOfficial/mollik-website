'use client'

import { useState } from 'react'
import { Check, X, Clock, Heart, Trash2 } from 'lucide-react'

interface Tribute {
    id: string
    content: string
    status: string
    createdAt: string
    author: { name: string | null; email: string }
}

interface Props {
    tributes: Tribute[]
}

export default function TributesClient({ tributes }: Props) {
    const [items, setItems] = useState(tributes)

    const pendingTributes = items.filter(t => t.status === 'PENDING')
    const publishedTributes = items.filter(t => t.status === 'PUBLISHED')

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/tributes/${id}/approve`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(t =>
                    t.id === id ? { ...t, status: 'PUBLISHED' } : t
                ))
            }
        } catch (error) {
            console.error('Approve error:', error)
        }
    }

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/tributes/${id}/reject`, { method: 'POST' })
            if (res.ok) {
                setItems(items.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error('Reject error:', error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">শোকবার্তা পরিচালনা</h1>
                <p className="text-gray-600 mt-1">মোট {items.length}টি শোকবার্তা</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="text-amber-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-amber-700">{pendingTributes.length}</p>
                            <p className="text-sm text-amber-600">অনুমোদনের অপেক্ষায়</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Check className="text-green-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-green-700">{publishedTributes.length}</p>
                            <p className="text-sm text-green-600">প্রকাশিত</p>
                        </div>
                    </div>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Heart className="text-rose-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-rose-700">{items.length}</p>
                            <p className="text-sm text-rose-600">মোট শোকবার্তা</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Tributes */}
            {pendingTributes.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
                        <h2 className="font-semibold text-amber-800">অনুমোদনের অপেক্ষায় ({pendingTributes.length})</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {pendingTributes.map((tribute) => (
                            <div key={tribute.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-gray-900 whitespace-pre-wrap line-clamp-4">{tribute.content}</p>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span>লেখক: {tribute.author.name || tribute.author.email}</span>
                                            <span>•</span>
                                            <span>{new Date(tribute.createdAt).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleApprove(tribute.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="অনুমোদন"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleReject(tribute.id)}
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

            {/* All Tributes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">প্রকাশিত শোকবার্তা</h2>
                </div>
                {publishedTributes.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">কোনো প্রকাশিত শোকবার্তা নেই</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {publishedTributes.map((tribute) => (
                            <div key={tribute.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-gray-900 whitespace-pre-wrap">{tribute.content}</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-sm text-gray-500">
                                                {tribute.author.name || tribute.author.email}
                                            </span>
                                            <span className="text-sm text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(tribute.createdAt).toLocaleDateString('bn-BD')}
                                            </span>
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                প্রকাশিত
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleReject(tribute.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="মুছুন"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
