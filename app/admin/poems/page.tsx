import PoemListClient from '@/components/admin/PoemListClient'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getPoems() {
    return prisma.writing.findMany({
        where: { type: 'POEM' },
        include: {
            category: true,
            book: true
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function PoemsPage() {
    const poems = await getPoems()

    // Transform data to match client interface
    const formattedPoems = poems.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        views: p.views,
        excerpt: p.excerpt || p.content.substring(0, 150) + '...', // Longer excerpt for poems
        category: p.category ? { name: p.category.name } : null,
        book: p.book ? { title: p.book.title, coverImage: p.book.coverImage } : null
    }))

    return (
        <div className="space-y-6">
            <PoemListClient poems={formattedPoems} />
        </div>
    )
}
