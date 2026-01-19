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
    MoreVertical,
    Edit,
    Trash2,
    Play,
    Pause,
    Calendar,
    Clock,
    Eye,
    Filter,
    X,
    CheckCircle2
} from 'lucide-react';

interface Audio {
    id: string;
    title: string;
    slug: string;
    status: string;
    views: number;
    artist?: string | null;
    album?: string | null;
    duration?: string | null;
    coverImage?: string | null;
    audioUrl?: string;
    createdAt: Date;
}

interface AudioListClientProps {
    audios: Audio[];
}

export default function AudioListClient({ audios }: AudioListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter and Sort Logic
    const filteredAudios = useMemo(() => {
        return audios.filter(audio => {
            const matchesSearch =
                audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                audio.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                audio.album?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || audio.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [audios, searchQuery, statusFilter]);

    // Play/Pause Handler
    const togglePlay = (id: string, url?: string) => {
        if (playingId === id) {
            setPlayingId(null);
            const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
            audio?.pause();
        } else {
            // Pause currently playing
            if (playingId) {
                const prev = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
                prev?.pause();
            }
            // Play new
            setPlayingId(id);
            const next = document.getElementById(`audio-${id}`) as HTMLAudioElement;
            if (next) {
                next.play();
                next.onended = () => setPlayingId(null);
            }
        }
    };

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/audio/${deleteId}`, {
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
                    <h1 className="text-2xl font-bold text-gray-900">অডিও লাইব্রেরি</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredAudios.length} টি অডিও ট্র্যাক</p>
                </div>

                <Link
                    href="/admin/audio/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>নতুন অডিও আপলোড</span>
                </Link>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 transition-all hover:shadow-md">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="অডিও খুঁজুন (নাম, শিল্পী, অ্যালবাম)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Divider for desktop */}
                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none cursor-pointer text-sm font-medium text-gray-700 min-w-[140px] hover:bg-gray-100 transition-colors"
                    >
                        <option value="all">সব স্ট্যাটাস</option>
                        <option value="PUBLISHED">প্রকাশিত</option>
                        <option value="DRAFT">ড্রাফট</option>
                        <option value="ARCHIVED">আর্কাইভ</option>
                    </select>

                    <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="List View"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredAudios.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো অডিও পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার সার্চ কুয়েরি পরিবর্তন করে দেখুন</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAudios.map((audio) => (
                                <div key={audio.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 overflow-hidden">
                                    {/* Cover Image Area */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        {audio.coverImage ? (
                                            <Image
                                                src={audio.coverImage}
                                                alt={audio.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                                                <Music className="w-16 h-16 text-orange-300" />
                                            </div>
                                        )}
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                            <button
                                                onClick={() => togglePlay(audio.id, audio.audioUrl)}
                                                className="w-12 h-12 rounded-full bg-white text-orange-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                            >
                                                {playingId === audio.id ? (
                                                    <Pause className="w-5 h-5 fill-current" />
                                                ) : (
                                                    <Play className="w-5 h-5 fill-current ml-1" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md shadow-sm ${audio.status === 'PUBLISHED' ? 'bg-emerald-500/90 text-white' :
                                                audio.status === 'DRAFT' ? 'bg-gray-500/90 text-white' :
                                                    'bg-red-500/90 text-white'
                                                }`}>
                                                {audio.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Audio Player (Hidden but functional) */}
                                    {audio.audioUrl && (
                                        <audio id={`audio-${audio.id}`} src={audio.audioUrl} preload="none" />
                                    )}

                                    {/* Details */}
                                    <div className="p-5">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-gray-900 line-clamp-1 mb-1" title={audio.title}>
                                                {audio.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Mic className="w-3.5 h-3.5" />
                                                <span className="line-clamp-1">{audio.artist || 'অজানা শিল্পী'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {audio.duration || 'N/A'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {audio.views}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/admin/audio/${audio.id}`}
                                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="সম্পাদনা"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(audio.id)}
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
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ট্র্যাক ইনফো</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">অ্যালবাম</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">সময়কাল</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAudios.map((audio) => (
                                        <tr key={audio.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 group">
                                                        {audio.coverImage ? (
                                                            <Image src={audio.coverImage} alt={audio.title} fill className="object-cover" />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-orange-300">
                                                                <Music className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                                            onClick={() => togglePlay(audio.id, audio.audioUrl)}>
                                                            {playingId === audio.id ? (
                                                                <Pause className="w-5 h-5 text-white fill-current" />
                                                            ) : (
                                                                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {audio.audioUrl && (
                                                        <audio id={`audio-${audio.id}`} src={audio.audioUrl} preload="none" />
                                                    )}

                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{audio.title}</p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                            <Mic className="w-3 h-3" />
                                                            {audio.artist || 'অজানা শিল্পী'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {audio.album || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${audio.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' :
                                                    audio.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-red-50 text-red-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${audio.status === 'PUBLISHED' ? 'bg-emerald-500' :
                                                        audio.status === 'DRAFT' ? 'bg-gray-500' :
                                                            'bg-red-500'
                                                        }`} />
                                                    {audio.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                                {audio.duration || '--:--'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/audio/${audio.id}`}
                                                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(audio.id)}
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
                                এই অডিওটি স্থায়ীভাবে মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
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
