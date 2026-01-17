import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search, FileText } from 'lucide-react'
import prisma from '@/lib/prisma'

async function getEssays() {
    return prisma.writing.findMany({
        where: { type: 'ESSAY' },
        include: { category: true, book: true },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function ProsePage() {
    const essays = await getEssays()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">গদ্য/প্রবন্ধ পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">{essays.length}টি গদ্য/প্রবন্ধ</p>
                </div>
                <Link
                    href="/admin/prose/new"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>নতুন গদ্য</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="গদ্য/প্রবন্ধ খুঁজুন..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {essays.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">কোনো গদ্য/প্রবন্ধ পাওয়া যায়নি</p>
                        <Link
                            href="/admin/prose/new"
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            <Plus size={20} />
                            <span>প্রথম গদ্য যোগ করুন</span>
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">শিরোনাম</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ক্যাটাগরি</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">বই</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">স্ট্যাটাস</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ভিউ</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {essays.map((essay) => (
                                <tr key={essay.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{essay.title}</div>
                                        <div className="text-sm text-gray-500">{essay.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {essay.category?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {essay.book?.title || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${essay.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : essay.status === 'DRAFT'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }
                    `}>
                                            {essay.status === 'PUBLISHED' ? 'প্রকাশিত' :
                                                essay.status === 'DRAFT' ? 'ড্রাফট' : 'পেন্ডিং'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {essay.views}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/prose/${essay.slug}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="দেখুন"
                                                target="_blank"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/prose/${essay.id}`}
                                                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
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
