import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import ProseTable from '@/components/admin/ProseTable'

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
            <ProseTable
                essays={essays.map(essay => ({
                    id: essay.id,
                    title: essay.title,
                    slug: essay.slug,
                    status: essay.status,
                    views: essay.views,
                    category: essay.category ? { name: essay.category.name } : null,
                    book: essay.book ? { title: essay.book.title } : null
                }))}
            />
        </div>
    )
}
