import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search, Video, Play } from 'lucide-react'
import prisma from '@/lib/prisma'

async function getVideos() {
    return prisma.video.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function VideosPage() {
    const videos = await getVideos()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ভিডিও পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">{videos.length}টি ভিডিও</p>
                </div>
                <Link
                    href="/admin/videos/new"
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>নতুন ভিডিও</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ভিডিও খুঁজুন..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                        <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">কোনো ভিডিও পাওয়া যায়নি</p>
                        <Link
                            href="/admin/videos/new"
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            <Plus size={20} />
                            <span>প্রথম ভিডিও যোগ করুন</span>
                        </Link>
                    </div>
                ) : (
                    videos.map((video) => (
                        <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                            <div className="relative">
                                <img
                                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-red-600 p-3 rounded-full text-white hover:bg-red-700"
                                    >
                                        <Play size={24} />
                                    </a>
                                </div>
                                {video.duration && (
                                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        {video.duration}
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">{video.views}</span> ভিউ
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/videos/${video.slug}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="দেখুন"
                                            target="_blank"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            href={`/admin/videos/${video.id}`}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="সম্পাদনা"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="মুছুন"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
