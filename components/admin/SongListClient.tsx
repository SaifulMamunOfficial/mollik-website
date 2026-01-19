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
    Music,
    Mic,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    Quote
} from 'lucide-react';

interface Song {
    id: string;
    title: string;
    slug: string;
    status: string;
    views: number;
    composer?: string | null;
    excerpt?: string | null;
    category?: { name: string } | null;
    book?: { title: string; coverImage?: string | null } | null;
}

interface SongListClientProps {
    songs: Song[];
}

export default function SongListClient({ songs }: SongListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter Logic
    const filteredSongs = useMemo(() => {
        return songs.filter(song => {
            const matchesSearch =
                song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                song.composer?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || song.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [songs, searchQuery, statusFilter]);

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/writing/${deleteId}`, {
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
                    <h1 className="text-2xl font-bold text-gray-900">গানের তালিকা</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredSongs.length} টি গান</p>
                </div>

                <Link
                    href="/admin/songs/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all shadow-md shadow-purple-600/20 hover:shadow-purple-600/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>নতুন গান</span>
                </Link>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 transition-all hover:shadow-md">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="গান খুঁজুন (শিরোনাম, সুরকার)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none cursor-pointer text-sm font-medium text-gray-700 min-w-[140px] hover:bg-gray-100 transition-colors"
                    >
                        <option value="all">সব স্ট্যাটাস</option>
                        <option value="PUBLISHED">প্রকাশিত</option>
                        <option value="DRAFT">ড্রাফট</option>
                        <option value="ARCHIVED">আর্কাইভ</option>
                    </select>

                    <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="List View"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredSongs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো গান পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার সার্চ কুয়েরি পরিবর্তন করে দেখুন</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSongs.map((song) => (
                                <div key={song.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 overflow-hidden flex flex-col h-full bg-gradient-to-b from-white to-purple-50/30">

                                    {/* Lyric Card Design */}
                                    <div className="p-6 flex-1 flex flex-col relative">
                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <Music className="w-24 h-24 text-purple-600 transform rotate-12" />
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className={`w-2 h-2 rounded-full block ${song.status === 'PUBLISHED' ? 'bg-emerald-500' :
                                                    song.status === 'DRAFT' ? 'bg-gray-400' :
                                                        'bg-red-500'
                                                }`} title={song.status} />
                                        </div>

                                        {/* Category Tag */}
                                        <div className="mb-4">
                                            <span className="inline-block px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold tracking-wider uppercase border border-purple-100">
                                                {song.category?.name || 'গান'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-purple-700 transition-colors">
                                            {song.title}
                                        </h3>

                                        {/* Composer info */}
                                        <div className="flex items-center gap-1.5 text-xs text-purple-600 font-medium mb-4">
                                            <Mic className="w-3 h-3" />
                                            <span>{song.composer || 'সুরকার অজ্ঞাত'}</span>
                                        </div>

                                        {/* Lyric Excerpt */}
                                        <div className="relative mb-6 flex-1">
                                            <Quote className="w-4 h-4 text-gray-300 absolute -top-1 -left-1 transform -scale-x-100" />
                                            <p className="text-sm text-gray-600 italic leading-relaxed pl-4 line-clamp-4 font-serif">
                                                {song.excerpt ? song.excerpt.replace(/<[^>]*>?/gm, '') : 'কোনো লিরিক্স প্রিভিউ নেই...'}
                                            </p>
                                        </div>

                                        {/* Footer Info */}
                                        <div className="pt-4 border-t border-purple-100 flex items-center justify-between mt-auto">
                                            <div className="flex flex-col gap-1">
                                                {song.book ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-purple-600 transition-colors">
                                                        <BookOpen className="w-3 h-3" />
                                                        <span className="font-medium max-w-[100px] truncate" title={song.book.title}>
                                                            {song.book.title}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400">অ্যালবাম নেই</span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/songs/${song.id}`}
                                                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(song.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom border line */}
                                    <div className="h-1 w-full bg-gradient-to-r from-purple-100 via-purple-300 to-purple-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">গান</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">বই / অ্যালবাম</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">সুরকার</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredSongs.map((song) => (
                                        <tr key={song.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0 font-serif font-bold text-lg">
                                                        {song.title.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{song.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]">
                                                            {song.excerpt ? song.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 30) + '...' : song.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {song.book ? (
                                                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                                                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                                                        {song.book.title}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${song.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' :
                                                        song.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                                            'bg-red-50 text-red-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${song.status === 'PUBLISHED' ? 'bg-emerald-500' :
                                                            song.status === 'DRAFT' ? 'bg-gray-500' :
                                                                'bg-red-500'
                                                        }`} />
                                                    {song.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {song.composer || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/songs/${song.id}`}
                                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(song.id)}
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
                                এই গানটি স্থায়ীভাবে মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
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
