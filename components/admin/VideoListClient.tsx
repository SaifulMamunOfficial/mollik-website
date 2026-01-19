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
    Video,
    MoreVertical,
    Edit,
    Trash2,
    Play,
    Eye,
    Clock,
    Youtube
} from 'lucide-react';

interface Video {
    id: string;
    title: string;
    slug: string;
    youtubeId: string;
    description?: string | null;
    thumbnail?: string | null;
    views: number;
    duration?: string | null;

    createdAt: Date;
}

interface VideoListClientProps {
    videos: Video[];
}

export default function VideoListClient({ videos }: VideoListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);

    // Filter Logic
    const filteredVideos = useMemo(() => {
        return videos.filter(video => {
            return video.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [videos, searchQuery]);

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/videos/${deleteId}`, {
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
                    <h1 className="text-2xl font-bold text-gray-900">ভিডিও গ্যালারি</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredVideos.length} টি ভিডিও</p>
                </div>

                <Link
                    href="/admin/videos/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all shadow-md shadow-red-600/20 hover:shadow-red-600/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>নতুন ভিডিও</span>
                </Link>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 transition-all hover:shadow-md">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ভিডিও খুঁজুন (শিরোনাম)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="List View"
                    >
                        <ListIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {filteredVideos.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো ভিডিও পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার সার্চ কুয়েরি পরিবর্তন করে দেখুন</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVideos.map((video) => (
                                <div key={video.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 overflow-hidden">
                                    {/* Thumbnail Area */}
                                    <div className="relative aspect-video overflow-hidden bg-gray-900">
                                        <Image
                                            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                            alt={video.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                                        {/* Play Button Overlay */}
                                        <a
                                            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                                                <Play className="w-6 h-6 fill-current ml-1" />
                                            </div>
                                        </a>

                                        {/* Duration Badge */}
                                        {video.duration && (
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-medium text-white flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {video.duration}
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors" title={video.title}>
                                            {video.title}
                                        </h3>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Eye className="w-4 h-4" />
                                                <span>{video.views} ভিউ</span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/admin/videos/${video.id}`}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="সম্পাদনা"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(video.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="মুছুন"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ভিডিও</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ভিউজ</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredVideos.map((video) => (
                                        <tr key={video.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 group">
                                                        <Image
                                                            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                            alt={video.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <a
                                                            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                                                            <Youtube className="w-8 h-8 text-red-600 fill-white" />
                                                        </a>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 max-w-sm">{video.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1 font-mono">{video.youtubeId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {video.views}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/videos/${video.id}`}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(video.id)}
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
                                এই ভিডিওটি স্থায়ীভাবে মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
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
