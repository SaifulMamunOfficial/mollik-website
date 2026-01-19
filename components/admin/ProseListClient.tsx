'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Plus,
    LayoutGrid,
    List as ListIcon,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    FileText,
    AlignLeft
} from 'lucide-react';

interface Prose {
    id: string;
    title: string;
    slug: string;
    status: string;
    views: number;
    category?: { name: string } | null;
    book?: { title: string } | null;
    createdAt?: Date;
}

interface ProseListClientProps {
    essays: Prose[];
}

export default function ProseListClient({ essays }: ProseListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter Logic
    const filteredEssays = useMemo(() => {
        return essays.filter(essay => {
            const matchesSearch = essay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                essay.book?.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [essays, searchQuery]);

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/prose/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
                setDeleteId(null);
            } else {
                alert('মুছতে সমস্যা হয়েছে');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('মুছতে সমস্যা হয়েছে');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">গদ্য ও প্রবন্ধ</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredEssays.length} টি লেখা</p>
                </div>

                <Link
                    href="/admin/prose/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>নতুন লেখা</span>
                </Link>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 transition-all hover:shadow-md">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="শিরোনাম বা বই খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="List View"
                    >
                        <ListIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {filteredEssays.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো লেখা পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার সার্চ কুয়েরি পরিবর্তন করে দেখুন</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEssays.map((essay) => (
                                <div key={essay.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full">
                                    <div className="p-6 flex-1">
                                        {/* Meta Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                                <AlignLeft className="w-3 h-3" />
                                                {essay.category?.name || 'সাধারণ'}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${essay.status === 'PUBLISHED'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-gray-50 text-gray-500 border-gray-100'
                                                }`}>
                                                {essay.status}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 font-serif group-hover:text-indigo-700 transition-colors">
                                            {essay.title}
                                        </h3>

                                        {/* Book Info */}
                                        {essay.book && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                                <span className="line-clamp-1">{essay.book.title}</span>
                                            </div>
                                        )}

                                        {/* Placeholder Excerpt Visual */}
                                        <div className="space-y-2 mb-4 opacity-40">
                                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                                            <div className="h-2 bg-gray-200 rounded w-[90%]"></div>
                                            <div className="h-2 bg-gray-200 rounded w-[80%]"></div>
                                        </div>
                                    </div>

                                    {/* Footer / Actions */}
                                    <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30 rounded-b-2xl">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <Eye className="w-3.5 h-3.5" />
                                            {essay.views}
                                        </div>

                                        <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/prose/${essay.id}`}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="সম্পাদনা"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(essay.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="মুছুন"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">শিরোনাম</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">বই / ক্যাটাগরি</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ভিউজ</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredEssays.map((essay) => (
                                        <tr key={essay.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{essay.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{essay.slug}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {essay.book && (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 w-fit">
                                                            <BookOpen className="w-3 h-3" />
                                                            {essay.book.title}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500">{essay.category?.name || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${essay.status === 'PUBLISHED'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${essay.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`} />
                                                    {essay.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {essay.views}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/prose/${essay.id}`}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(essay.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">আপনি কি নিশ্চিত?</h3>
                            <p className="text-gray-500 text-sm">
                                এই লেখাটি স্থায়ীভাবে মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
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
