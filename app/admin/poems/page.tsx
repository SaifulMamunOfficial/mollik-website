import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import prisma from '@/lib/prisma'

async function getPoems() {
    return prisma.writing.findMany({
        where: { type: 'POEM' },
        include: { category: true, book: true },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function PoemsPage() {
    const poems = await getPoems()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">কবিতা পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">{poems.length}টি কবিতা</p>
                </div>
                <Link
                    href="/admin/poems/new"
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>নতুন কবিতা</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="কবিতা খুঁজুন..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {poems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">কোনো কবিতা পাওয়া যায়নি</p>
                        <Link
                            href="/admin/poems/new"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                        >
                            <Plus size={20} />
                            <span>প্রথম কবিতা যোগ করুন</span>
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
                            {poems.map((poem) => (
                                <tr key={poem.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{poem.title}</div>
                                        <div className="text-sm text-gray-500">{poem.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {poem.category?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {poem.book?.title || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${poem.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : poem.status === 'DRAFT'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }
                    `}>
                                            {poem.status === 'PUBLISHED' ? 'প্রকাশিত' :
                                                poem.status === 'DRAFT' ? 'ড্রাফট' : 'পেন্ডিং'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {poem.views}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/poems/${poem.slug}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="দেখুন"
                                                target="_blank"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/poems/${poem.id}`}
                                                className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
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
