import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import AudioTable from '@/components/admin/AudioTable'

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
            <AudioTable audios={audios} />
        </div>
    )
}
