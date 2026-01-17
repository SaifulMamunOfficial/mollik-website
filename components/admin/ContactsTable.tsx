'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, Eye, Trash2, MailOpen, Reply, Archive, Clock, CheckCircle } from 'lucide-react'

interface ContactSubmission {
    id: string
    name: string
    email: string
    phone: string | null
    subject: string
    message: string
    status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED'
    createdAt: string
}

interface ContactsTableProps {
    submissions: ContactSubmission[]
}

export default function ContactsTable({ submissions: initialSubmissions }: ContactsTableProps) {
    const router = useRouter()
    const [submissions, setSubmissions] = useState(initialSubmissions)
    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ARCHIVED'>('ALL')
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const filteredSubmissions = submissions.filter(s => {
        if (filter === 'UNREAD') return s.status === 'UNREAD'
        if (filter === 'ARCHIVED') return s.status === 'ARCHIVED'
        return s.status !== 'ARCHIVED' // Show all except archived by default
    })

    const unreadCount = submissions.filter(c => c.status === 'UNREAD').length
    const totalCount = submissions.length

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        // Optimistic update
        setSubmissions(prev => prev.map(s =>
            s.id === id ? { ...s, status: newStatus as any } : s
        ))

        try {
            await fetch(`/api/admin/contacts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
            router.refresh()
        } catch (error) {
            console.error('Update error:', error)
            // Revert on error could be added here
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/contacts/${deleteId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setSubmissions(prev => prev.filter(s => s.id !== deleteId))
                router.refresh()
            } else {
                alert('বার্তা মুছতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">যোগাযোগ বার্তা</h1>
                    <p className="text-gray-600 mt-1">
                        মোট {totalCount}টি বার্তা
                        {unreadCount > 0 && <span className="text-amber-600 font-medium"> • {unreadCount}টি অপঠিত</span>}
                    </p>
                </div>
            </div>

            {/* Stats / Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`p-4 rounded-xl border text-left transition-all ${filter === 'ALL' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3">
                        <Mail className={filter === 'ALL' ? "text-blue-600" : "text-gray-500"} size={24} />
                        <div>
                            <p className={`text-2xl font-bold ${filter === 'ALL' ? "text-blue-700" : "text-gray-700"}`}>
                                {submissions.filter(s => s.status !== 'ARCHIVED').length}
                            </p>
                            <p className={`text-sm ${filter === 'ALL' ? "text-blue-600" : "text-gray-500"}`}>ইনবক্স</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setFilter('UNREAD')}
                    className={`p-4 rounded-xl border text-left transition-all ${filter === 'UNREAD' ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3">
                        <Clock className={filter === 'UNREAD' ? "text-amber-600" : "text-gray-500"} size={24} />
                        <div>
                            <p className={`text-2xl font-bold ${filter === 'UNREAD' ? "text-amber-700" : "text-gray-700"}`}>
                                {unreadCount}
                            </p>
                            <p className={`text-sm ${filter === 'UNREAD' ? "text-amber-600" : "text-gray-500"}`}>অপঠিত</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setFilter('ARCHIVED')}
                    className={`p-4 rounded-xl border text-left transition-all ${filter === 'ARCHIVED' ? 'bg-gray-100 border-gray-300 ring-1 ring-gray-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3">
                        <Archive className={filter === 'ARCHIVED' ? "text-gray-700" : "text-gray-500"} size={24} />
                        <div>
                            <p className={`text-2xl font-bold ${filter === 'ARCHIVED' ? "text-gray-800" : "text-gray-700"}`}>
                                {submissions.filter(s => s.status === 'ARCHIVED').length}
                            </p>
                            <p className={`text-sm ${filter === 'ARCHIVED' ? "text-gray-700" : "text-gray-500"}`}>আর্কাইভ</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                        <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-2">কোনো বার্তা নেই</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredSubmissions.map((contact) => (
                            <div
                                key={contact.id}
                                className={`p-6 transition-colors ${contact.status === 'UNREAD' ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className={`font-semibold text-gray-900 ${contact.status === 'UNREAD' ? 'text-lg' : ''}`}>
                                                {contact.subject}
                                            </h3>
                                            {contact.status === 'UNREAD' && (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                                    নতুন
                                                </span>
                                            )}
                                            {contact.status === 'REPLIED' && (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                    <CheckCircle size={12} /> উত্তর দেওয়া হয়েছে
                                                </span>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 text-gray-700 whitespace-pre-wrap text-sm">
                                            {contact.message}
                                        </div>

                                        <div className="flex items-center gap-x-6 gap-y-2 flex-wrap text-sm text-gray-500">
                                            <span className="font-medium text-gray-900">{contact.name}</span>
                                            <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-blue-600 hover:underline">
                                                <Mail size={14} />
                                                {contact.email}
                                            </a>
                                            {contact.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone size={14} />
                                                    {contact.phone}
                                                </span>
                                            )}
                                            <span>•</span>
                                            <span>{new Date(contact.createdAt).toLocaleDateString('bn-BD', {
                                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 border-l pl-4 border-gray-100">
                                        <a
                                            href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                            onClick={() => handleStatusUpdate(contact.id, 'REPLIED')}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
                                            title="উত্তর দিন (Email)"
                                        >
                                            <Reply size={18} className="mx-auto" />
                                        </a>

                                        {contact.status !== 'UNREAD' ? (
                                            <button
                                                onClick={() => handleStatusUpdate(contact.id, 'UNREAD')}
                                                className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="অপঠিত হিসেবে চিহ্নিত"
                                            >
                                                <Mail size={18} className="mx-auto" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusUpdate(contact.id, 'READ')}
                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="পঠিত হিসেবে চিহ্নিত"
                                            >
                                                <MailOpen size={18} className="mx-auto" />
                                            </button>
                                        )}

                                        {contact.status !== 'ARCHIVED' ? (
                                            <button
                                                onClick={() => handleStatusUpdate(contact.id, 'ARCHIVED')}
                                                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="আর্কাইভ করুন"
                                            >
                                                <Archive size={18} className="mx-auto" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusUpdate(contact.id, 'READ')}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="ইনবক্সে ফিরিয়ে আনুন"
                                            >
                                                <Mail size={18} className="mx-auto" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setDeleteId(contact.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2 border-t border-gray-100 pt-3"
                                            title="মুছুন"
                                        >
                                            <Trash2 size={18} className="mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">স্থায়ীভাবে মুছতে চান?</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    এই বার্তাটি স্থায়ীভাবে মুছে ফেলা হবে। এটি আর পুনরুদ্ধার করা যাবে না।
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
