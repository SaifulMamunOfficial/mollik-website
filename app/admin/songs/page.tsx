import SongListClient from '@/components/admin/SongListClient'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getSongs() {
    return prisma.writing.findMany({
        where: { type: 'SONG' },
        include: {
            category: true,
            book: true
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function SongsPage() {
    const songs = await getSongs()

    // Transform data to match client interface
    const formattedSongs = songs.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        status: s.status,
        views: s.views,
        composer: s.composer,
        excerpt: s.excerpt || s.content.substring(0, 100) + '...', // Fallback to content if no excerpt
        category: s.category ? { name: s.category.name } : null,
        book: s.book ? { title: s.book.title, coverImage: s.book.coverImage } : null
    }))

    return (
        <div className="space-y-6">
            <SongListClient songs={formattedSongs} />
        </div>
    )
}
