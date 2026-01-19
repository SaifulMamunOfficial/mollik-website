'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Search,
    Plus,
    LayoutGrid,
    List as ListIcon,
    Book,
    Edit,
    Trash2,
    Calendar,
    Building2,
    FileText,
    Layers
} from 'lucide-react';

interface BookItem {
    id: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    coverImage?: string | null;
    publisher?: string | null;
    year?: string | null;
    writingsCount: number;
}

interface BookListClientProps {
    books: BookItem[];
}

export default function BookListClient({ books }: BookListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter Logic
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.publisher?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesSearch;
        });
    }, [books, searchQuery]);

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/books/${deleteId}`, {
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
                    <h1 className="text-2xl font-bold text-gray-900">বইসমূহ</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredBooks.length} টি বই</p>
                </div>

                <Link
                    href="/admin/books/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all shadow-md shadow-teal-600/20 hover:shadow-teal-600/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>নতুন বই</span>
                </Link>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 transition-all hover:shadow-md">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="বই খুঁজুন (শিরোনাম, প্রকাশক)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />

                    <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="List View"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredBooks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Book className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো বই পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার সার্চ কুয়েরি পরিবর্তন করে দেখুন</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                            {filteredBooks.map((book) => (
                                <div key={book.id} className="group relative perspective-1000">
                                    {/* 3D Book Layout Container */}
                                    <div className="flex flex-col items-center">

                                        {/* Book Cover with 3D Effect */}
                                        <div className="relative w-40 h-60 mb-6 transition-transform duration-500 hover:-translate-y-2">
                                            <div className={`absolute inset-0 rounded-r-md shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-teal-900/20 bg-gray-200 overflow-hidden ${!book.coverImage ? 'bg-gradient-to-br from-teal-800 to-teal-900 flex items-center justify-center' : ''
                                                }`}>
                                                {book.coverImage ? (
                                                    <Image
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <Book className="w-10 h-10 text-teal-200/50 mx-auto mb-2" />
                                                        <span className="text-teal-100/70 text-xs font-serif leading-tight line-clamp-3">
                                                            {book.title}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Spine Effect (Left Border) */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/20 z-10" />
                                                <div className="absolute left-1.5 top-0 bottom-0 w-[1px] bg-white/30 z-10" />
                                            </div>

                                            {/* Action Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] rounded-r-md">
                                                <Link
                                                    href={`/admin/books/${book.id}`}
                                                    className="p-2 bg-white/10 hover:bg-white text-white hover:text-teal-600 rounded-full transition-all transform hover:scale-110"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(book.id)}
                                                    className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-full transition-all transform hover:scale-110"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Book Info */}
                                        <div className="text-center w-full px-2">
                                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-teal-700 transition-colors" title={book.title}>
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                                                {book.subtitle || book.publisher || 'প্রকাশক নেই'}
                                            </p>

                                            <div className="flex items-center justify-center gap-3 text-xs text-gray-400 border-t border-dashed border-gray-200 pt-3">
                                                <div className="flex items-center gap-1" title="প্রকাশকাল">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {book.year || '-'}
                                                </div>
                                                <div className="flex items-center gap-1" title="মোট লেখা">
                                                    <FilesCount count={book.writingsCount} />
                                                </div>
                                            </div>
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
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">বই</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">প্রকাশক ও সাল</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">লেখা</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredBooks.map((book) => (
                                        <tr key={book.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-14 rounded shadow-sm bg-gray-200 flex-shrink-0 relative overflow-hidden ${!book.coverImage ? 'bg-gradient-to-br from-teal-800 to-teal-900' : ''}`}>
                                                        {book.coverImage ? (
                                                            <Image
                                                                src={book.coverImage}
                                                                alt={book.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full flex items-center justify-center">
                                                                <Book className="w-5 h-5 text-white/30" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">{book.title}</p>
                                                        {book.subtitle && (
                                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{book.subtitle}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="flex items-center gap-1.5 text-gray-700">
                                                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                        {book.publisher || '-'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                        <Calendar className="w-3 h-3 text-gray-400" />
                                                        {book.year || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                    <FileText className="w-3 h-3" />
                                                    {book.writingsCount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/books/${book.id}`}
                                                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(book.id)}
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
                                এই বইটি এবং এর সাথে সম্পর্কিত সকল তথ্য স্থায়ীভাবে মুছে ফেলা হবে।
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

function FilesCount({ count }: { count: number }) {
    return (
        <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {count}টি লেখা
        </span>
    );
}
