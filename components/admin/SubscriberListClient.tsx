'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    LayoutGrid,
    List as ListIcon,
    Trash2,
    Download,
    Mail,
    Users,
    CheckCircle2,
    XCircle,
    Loader2,
    Send,
    X,
    Calendar,
    Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

interface Subscriber {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
}

interface SubscriberListClientProps {
    subscribers: Subscriber[];
}

export default function SubscriberListClient({ subscribers }: SubscriberListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'table'>('table'); // Default to table for data
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Selection State (for future bulk actions if needed, or just sending newsletter)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Newsletter State
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
    const [newsletterSubject, setNewsletterSubject] = useState('');
    const [newsletterMessage, setNewsletterMessage] = useState('');
    const [targetRecipients, setTargetRecipients] = useState<string[]>([]); // Empty = All, or specific emails
    const [isSending, setIsSending] = useState(false);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter Logic
    const filteredSubscribers = useMemo(() => {
        return subscribers.filter(sub => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = sub.email.toLowerCase().includes(searchLower);
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' ? sub.isActive : !sub.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [subscribers, searchQuery, statusFilter]);

    // Actions
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await fetch(`/api/admin/subscribers/${deleteId}`, {
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

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/admin/subscribers/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            router.refresh();
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    const handleExportCSV = () => {
        const headers = ["Email", "Status", "Joined Date"];
        const rows = filteredSubscribers.map(sub => [
            sub.email,
            sub.isActive ? "Active" : "Inactive",
            format(new Date(sub.createdAt), 'yyyy-MM-dd')
        ]);

        const csvContent = [headers, ...rows]
            .map(e => e.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openNewsletterModal = (emails: string[] = []) => {
        setTargetRecipients(emails);
        setNewsletterSubject('');
        setNewsletterMessage('');
        setIsNewsletterOpen(true);
    };

    const handleSendNewsletter = async () => {
        setIsSending(true);
        try {
            const response = await fetch('/api/admin/subscribers/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: newsletterSubject,
                    message: newsletterMessage,
                    recipients: targetRecipients.length > 0 ? targetRecipients : undefined // Send undefined to trigger "All" logic in API
                }),
            });

            if (!response.ok) throw new Error('Failed to send');

            alert(targetRecipients.length > 0 ? 'ইমেইল সফলভাবে পাঠানো হয়েছে!' : 'নিউজলেটার সফলভাবে সব সদস্যের কাছে পাঠানো হয়েছে!');
            setIsNewsletterOpen(false);
            setNewsletterSubject('');
            setNewsletterMessage('');
            setTargetRecipients([]);
        } catch (error) {
            console.error('Newsletter failed:', error);
            alert('নিউজলেটার পাঠাতে সমস্যা হয়েছে।');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">নিউজলেটার সাবস্ক্রাইবার</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredSubscribers.length} জন সদস্য</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <Download size={18} /> CSV ডাউনলোড
                    </button>
                    <button
                        onClick={() => openNewsletterModal([])} // Empty array means ALL
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        <Mail size={18} /> সবাইকে পাঠান
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 hover:shadow-md transition-all">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ইমেইল খুঁজুন..."
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
                        <option value="all">সব সদস্য</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ইমেইল</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">যুক্ত হয়েছে</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredSubscribers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    কোনো সাবস্ক্রাইবার পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            filteredSubscribers.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <Users size={14} />
                                            </div>
                                            <span className="font-medium text-gray-900">{sub.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(sub.id, sub.isActive)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border
                                                ${sub.isActive
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}
                                            `}
                                        >
                                            {sub.isActive ? (
                                                <><CheckCircle2 size={12} /> সক্রিয়</>
                                            ) : (
                                                <><XCircle size={12} /> নিষ্ক্রিয়</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-gray-400" />
                                            {format(new Date(sub.createdAt), 'dd MMMM yyyy', { locale: bn })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openNewsletterModal([sub.email])}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="ইমেইল পাঠান"
                                            >
                                                <Send size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(sub.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="মুছে ফেলুন"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Newsletter Modal */}
            {isNewsletterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-indigo-600" />
                                {targetRecipients.length > 0 ? 'ইমেইল পাঠান' : 'নিউজলেটার পাঠান (সবাইকে)'}
                            </h3>
                            <button
                                onClick={() => setIsNewsletterOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                                <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                                <div>
                                    <p className="text-indigo-900 font-semibold text-sm">প্রাপক:</p>
                                    <p className="text-indigo-700 text-sm mt-1">
                                        {targetRecipients.length > 0
                                            ? targetRecipients.join(', ')
                                            : 'এই ইমেইলটি বর্তমানে সক্রিয় থাকা সকল সাবস্ক্রাইবার এর কাছে পাঠানো হবে।'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">বিষয় (Subject)</label>
                                <input
                                    type="text"
                                    value={newsletterSubject}
                                    onChange={(e) => setNewsletterSubject(e.target.value)}
                                    placeholder="ইমেইল এর বিষয়..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">বার্তা (Message)</label>
                                <textarea
                                    value={newsletterMessage}
                                    onChange={(e) => setNewsletterMessage(e.target.value)}
                                    rows={10}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm font-mono"
                                    placeholder="আপনার বার্তা লিখুন (HTML সাপোর্ট করে)..."
                                />
                                <p className="text-xs text-gray-500 text-right">HTML ট্যাগ ব্যবহার করা যাবে</p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsNewsletterOpen(false)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleSendNewsletter}
                                disabled={isSending || !newsletterSubject.trim() || !newsletterMessage.trim()}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
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
                                এই সাবস্ক্রাইবারকে তালিকা থেকে মুছে ফেলা হবে।
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
