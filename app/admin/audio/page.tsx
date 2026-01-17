import Link from 'next/link'
import { Plus, Edit, Trash2, Play, Pause, Search, Mic, Music } from 'lucide-react'
import prisma from '@/lib/prisma'

async function getAudios() {
    return prisma.audio.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function AudioPage() {
    const audios = await getAudios()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">অডিও পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">{audios.length}টি অডিও</p>
                </div>
                <Link
                    href="/admin/audio/new"
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>নতুন অডিও</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="অডিও খুঁজুন..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {audios.length === 0 ? (
                    <div className="text-center py-12">
                        <Mic className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">কোনো অডিও পাওয়া যায়নি</p>
                        <Link
                            href="/admin/audio/new"
                            className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                        >
                            <Plus size={20} />
                            <span>প্রথম অডিও যোগ করুন</span>
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">অডিও</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">শিল্পী</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">অ্যালবাম</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">সময়কাল</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ভিউ</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {audios.map((audio) => (
                                <tr key={audio.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                                {audio.coverImage ? (
                                                    <img
                                                        src={audio.coverImage}
                                                        alt={audio.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <Music className="text-orange-500" size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{audio.title}</div>
                                                <div className="text-sm text-gray-500">{audio.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{audio.artist || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{audio.album || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{audio.duration || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {audio.views}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                title="প্লে"
                                            >
                                                <Play size={18} />
                                            </button>
                                            <Link
                                                href={`/admin/audio/${audio.id}`}
                                                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
