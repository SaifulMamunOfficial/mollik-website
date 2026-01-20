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
    ImageIcon,
    MapPin,
    Calendar,
    Edit,
    Trash2,
    Eye,
    Maximize2,
    X,
    Check,
    Clock
} from 'lucide-react';

interface GalleryImage {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    year: string | null;
    location: string | null;
    featured: boolean;
    status: string;
}

interface GalleryListClientProps {
    images: GalleryImage[];
}

export default function GalleryListClient({ images }: GalleryListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED'>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [isApproving, setIsApproving] = useState<string | null>(null);
    const [isRejecting, setIsRejecting] = useState<string | null>(null);

    // Filter Logic
    const filteredImages = useMemo(() => {
        return images.filter(image => {
            const matchesSearch =
                (image.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (image.location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (image.year?.toLowerCase() || '').includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || image.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [images, searchQuery, statusFilter]);

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/gallery/${deleteId}`, {
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

    // Approve Handler
    const handleApprove = async (id: string) => {
        setIsApproving(id);
        try {
            const response = await fetch(`/api/admin/gallery/${id}/approve`, {
                method: 'POST',
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('অনুমোদন করতে সমস্যা হয়েছে');
            }
        } catch (error) {
            console.error('Approve error:', error);
            alert('অনুমোদন করতে সমস্যা হয়েছে');
        } finally {
            setIsApproving(null);
        }
    };

    // Reject Handler
    const handleReject = async (id: string) => {
        setIsRejecting(id);
        try {
            const response = await fetch(`/api/admin/gallery/${id}/reject`, {
                method: 'POST',
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('বাতিল করতে সমস্যা হয়েছে');
            }
        } catch (error) {
            console.error('Reject error:', error);
            alert('বাতিল করতে সমস্যা হয়েছে');
        } finally {
            setIsRejecting(null);
        }
    };

    // Count by status
    const pendingCount = images.filter(img => img.status === 'PENDING').length;
    const publishedCount = images.filter(img => img.status === 'PUBLISHED').length;

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">গ্যালারি</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredImages.length} টি ছবি</p>
                </div>

                <Link
                    href="/admin/gallery/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>নতুন ছবি</span>
                </Link>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 transition-all hover:shadow-md">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ছবি খুঁজুন (ক্যাপশন, স্থান, সাল)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            সব
                        </button>
                        <button
                            onClick={() => setStatusFilter('PENDING')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${statusFilter === 'PENDING' ? 'bg-yellow-100 text-yellow-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Clock className="w-3.5 h-3.5" />
                            অপেক্ষমান
                            {pendingCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full">{pendingCount}</span>
                            )}
                        </button>
                        <button
                            onClick={() => setStatusFilter('PUBLISHED')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            প্রকাশিত
                        </button>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />

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
            </div>

            {/* Content Area */}
            {filteredImages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো ছবি পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার সার্চ কুয়েরি পরিবর্তন করে দেখুন</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredImages.map((image) => (
                                <div key={image.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                                    {/* Image Aspect Ratio Container */}
                                    <div className="relative aspect-[4/5] bg-gray-100">
                                        <Image
                                            src={image.url}
                                            alt={image.title || 'Gallery Image'}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                                {/* Meta Info */}
                                                <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
                                                    {image.year && (
                                                        <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                            <Calendar className="w-3 h-3" />
                                                            {image.year}
                                                        </span>
                                                    )}
                                                    {image.location && (
                                                        <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm truncate max-w-[100px]">
                                                            <MapPin className="w-3 h-3" />
                                                            {image.location}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-white font-medium text-sm line-clamp-2 mb-3">
                                                    {image.title || 'শিরোনাম নেই'}
                                                </h3>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedImage(image)}
                                                        className="p-2 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-lg backdrop-blur-sm transition-colors"
                                                        title="প্রিভিউ"
                                                    >
                                                        <Maximize2 className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/gallery/${image.id}`}
                                                        className="p-2 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-lg backdrop-blur-sm transition-colors"
                                                        title="সম্পাদনা"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(image.id)}
                                                        className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors ml-auto"
                                                        title="মুছুন"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Indicators (Top Right) */}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            {image.status === 'PENDING' && (
                                                <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    অপেক্ষমান
                                                </span>
                                            )}
                                            {image.featured && (
                                                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                    FEATURED
                                                </span>
                                            )}
                                        </div>

                                        {/* Approve/Reject Buttons for PENDING (Top Left) */}
                                        {image.status === 'PENDING' && (
                                            <div className="absolute top-3 left-3 flex gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleApprove(image.id); }}
                                                    disabled={isApproving === image.id}
                                                    className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md transition-colors disabled:opacity-50"
                                                    title="অনুমোদন করুন"
                                                >
                                                    {isApproving === image.id ? <span className="animate-spin">⏳</span> : <Check className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleReject(image.id); }}
                                                    disabled={isRejecting === image.id}
                                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors disabled:opacity-50"
                                                    title="বাতিল করুন"
                                                >
                                                    {isRejecting === image.id ? <span className="animate-spin">⏳</span> : <X className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ছবি</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">তথ্য</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredImages.map((image) => (
                                        <tr key={image.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative border border-gray-200">
                                                        <Image
                                                            src={image.url}
                                                            alt={image.title || 'Preview'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-semibold text-gray-900 line-clamp-1">{image.title || 'শিরোনাম নেই'}</p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        {image.year && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {image.year}
                                                            </span>
                                                        )}
                                                        {image.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {image.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${image.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' :
                                                        image.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            image.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-red-50 text-red-700'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${image.status === 'PUBLISHED' ? 'bg-emerald-500' :
                                                            image.status === 'PENDING' ? 'bg-yellow-500' :
                                                                image.status === 'DRAFT' ? 'bg-gray-500' :
                                                                    'bg-red-500'
                                                            }`} />
                                                        {image.status === 'PENDING' ? 'অপেক্ষমান' : image.status === 'PUBLISHED' ? 'প্রকাশিত' : image.status}
                                                    </span>
                                                    {image.featured && (
                                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full w-fit">Featured</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Approve/Reject for PENDING */}
                                                    {image.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(image.id)}
                                                                disabled={isApproving === image.id}
                                                                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                                                title="অনুমোদন করুন"
                                                            >
                                                                {isApproving === image.id ? <span className="animate-spin">⏳</span> : <Check className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(image.id)}
                                                                disabled={isRejecting === image.id}
                                                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                                                title="বাতিল করুন"
                                                            >
                                                                {isRejecting === image.id ? <span className="animate-spin">⏳</span> : <X className="w-4 h-4" />}
                                                            </button>
                                                            <div className="w-px h-6 bg-gray-200" />
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedImage(image)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <Maximize2 className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/gallery/${image.id}`}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(image.id)}
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

            {/* Lightbox / Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full max-w-5xl h-[85vh] p-4 flex flex-col items-center">
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <Image
                                src={selectedImage.url}
                                alt={selectedImage.title || 'Preview'}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="mt-4 text-center text-white">
                            <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                            <div className="flex items-center justify-center gap-4 mt-2 text-white/60 text-sm">
                                {selectedImage.location && <span>📍 {selectedImage.location}</span>}
                                {selectedImage.year && <span>📅 {selectedImage.year}</span>}
                            </div>
                            {selectedImage.description && (
                                <p className="mt-2 text-white/80 max-w-2xl mx-auto">{selectedImage.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">আপনি কি নিশ্চিত?</h3>
                            <p className="text-gray-500 text-sm">
                                এই ছবিটি স্থায়ীভাবে মুছে ফেলা হবে।
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
