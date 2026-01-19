'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    LayoutGrid,
    List as ListIcon,
    Inbox,
    MailOpen,
    Archive,
    Reply,
    Trash2,
    CheckCircle2,
    Clock,
    Send,
    Loader2,
    X,
    Mail
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
    createdAt: Date;
}

interface ContactListClientProps {
    contacts: ContactSubmission[];
}

export default function ContactListClient({ contacts }: ContactListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Reply State
    const [replyingTo, setReplyingTo] = useState<ContactSubmission | null>(null);
    const [replySubject, setReplySubject] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter Logic
    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                contact.name.toLowerCase().includes(searchLower) ||
                contact.email.toLowerCase().includes(searchLower) ||
                contact.subject.toLowerCase().includes(searchLower);

            const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [contacts, searchQuery, statusFilter]);

    // Actions
    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await fetch(`/api/admin/contacts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            router.refresh();
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await fetch(`/api/admin/contacts/${deleteId}`, {
                method: 'DELETE',
            });
            router.refresh();
            setDeleteId(null);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('মুছতে সমস্যা হয়েছে');
        } finally {
            setIsDeleting(false);
        }
    };

    const openReplyModal = (contact: ContactSubmission) => {
        setReplyingTo(contact);
        setReplySubject(`Re: ${contact.subject}`);
        setReplyMessage('');
    };

    const handleSendReply = async () => {
        if (!replyingTo) return;
        setIsSending(true);

        try {
            const response = await fetch('/api/admin/contacts/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: replyingTo.id,
                    to: replyingTo.email,
                    subject: replySubject,
                    message: replyMessage,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send email');
            }

            alert('ইমেইল সফলভাবে পাঠানো হয়েছে!');
            setReplyingTo(null);
            router.refresh();
        } catch (error) {
            console.error('Reply failed:', error);
            alert('ইমেইল পাঠাতে সমস্যা হয়েছে। আপনার SMTP সেটিংস চেক করুন।');
        } finally {
            setIsSending(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'UNREAD':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200"><Inbox size={12} /> নতুন</span>;
            case 'READ':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"><MailOpen size={12} /> পঠিত</span>;
            case 'REPLIED':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"><Reply size={12} /> উত্তর দেওয়া হয়েছে</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"><Archive size={12} /> আর্কাইভ</span>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">মেসেজ বক্স / যোগাযোগ</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredContacts.length} টি বার্তা</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 hover:shadow-md transition-all">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="নাম, ইমেইল বা বিষয় খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-sm font-medium text-gray-700 min-w-[140px] hover:bg-gray-100 transition-colors"
                    >
                        <option value="all">সব মেসেজ</option>
                        <option value="UNREAD">নতুন (Unread)</option>
                        <option value="READ">পঠিত (Read)</option>
                        <option value="REPLIED">উত্তর দেওয়া (Replied)</option>
                    </select>

                    <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {filteredContacts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Inbox className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো বার্তা পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার ইনবক্স ফাঁকা অথবা সার্চ এর সাথে মিলছে না</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col relative overflow-hidden
                                        ${contact.status === 'UNREAD' ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200'}
                                    `}
                                >
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                                                    ${contact.status === 'UNREAD' ? 'bg-indigo-500' : 'bg-gray-400'}
                                                `}>
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 line-clamp-1">{contact.name}</h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true, locale: bn })}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(contact.status)}
                                        </div>

                                        <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-1">{contact.subject}</h4>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 whitespace-pre-line bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            {contact.message}
                                        </p>

                                        <div className="flex items-center gap-2 pt-4 border-t border-gray-50 mt-auto">
                                            <button
                                                onClick={() => openReplyModal(contact)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Reply size={14} /> রিপ্লাই
                                            </button>

                                            {contact.status === 'UNREAD' && (
                                                <button
                                                    onClick={() => handleStatusChange(contact.id, 'READ')}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                    title="Mark as Read"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setDeleteId(contact.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">প্রেরক</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">বিষয়</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">সময়</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredContacts.map((contact) => (
                                        <tr key={contact.id} className={`group hover:bg-gray-50/50 transition-colors ${contact.status === 'UNREAD' ? 'bg-indigo-50/10' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                                                        ${contact.status === 'UNREAD' ? 'bg-indigo-500' : 'bg-gray-400'}
                                                    `}>
                                                        {contact.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
                                                        <p className="text-xs text-gray-500">{contact.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-gray-900 font-medium truncate">{contact.subject}</p>
                                                    <p className="text-xs text-gray-500 truncate">{contact.message}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(contact.status)}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true, locale: bn })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openReplyModal(contact)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Reply"
                                                    >
                                                        <Reply className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(contact.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Reply Modal */}
            {replyingTo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Reply className="w-4 h-4 text-indigo-600" />
                                ইমেইল এর উত্তর দিন
                            </h3>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-sm">
                                <p className="text-blue-900 font-medium mb-1">প্রাপক:</p>
                                <div className="flex items-center gap-2 text-blue-700">
                                    <UserAvatar name={replyingTo.name} />
                                    <span>{replyingTo.name}</span>
                                    <span className="text-blue-400">&lt;{replyingTo.email}&gt;</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">বিষয়</label>
                                <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">বার্তা</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm"
                                    placeholder="আপনার উত্তর লিখুন..."
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleSendReply}
                                disabled={isSending || !replyMessage.trim()}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                            >
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                পাঠান
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">আপনি কি নিশ্চিত?</h3>
                            <p className="text-gray-500 text-sm">
                                এই বার্তাটি মুছে ফেলা হবে। এটি আর পুনরুদ্ধার করা সম্ভব নয়।
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting && <span className="animate-spin">⏳</span>}
                                মুছে ফেলুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function UserAvatar({ name }: { name: string }) {
    return (
        <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[10px] font-bold">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}
