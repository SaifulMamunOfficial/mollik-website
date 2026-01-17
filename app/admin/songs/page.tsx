import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import SongsTable from '@/components/admin/SongsTable'

async function getSongs() {
    return prisma.writing.findMany({
        where: { type: 'SONG' },
        include: { category: true, book: true },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function SongsPage() {
    const songs = await getSongs()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">গান পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">{songs.length}টি গান</p>
                </div>
                <Link
                    href="/admin/songs/new"
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>নতুন গান</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="গান খুঁজুন..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
            </div>

            {/* Table */}
            <SongsTable
                songs={songs.map(s => ({
                    id: s.id,
                    title: s.title,
                    slug: s.slug,
                    status: s.status,
                    views: s.views,
                    composer: s.composer,
                    category: s.category ? { name: s.category.name } : null,
                    book: s.book ? { title: s.book.title } : null
                }))}
            />
        </div>
    )
}
