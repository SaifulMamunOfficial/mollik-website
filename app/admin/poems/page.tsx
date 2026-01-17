import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import PoemsTable from '@/components/admin/PoemsTable'

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
            <PoemsTable
                poems={poems.map(p => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    status: p.status,
                    views: p.views,
                    category: p.category ? { name: p.category.name } : null,
                    book: p.book ? { title: p.book.title } : null
                }))}
            />
        </div>
    )
}
