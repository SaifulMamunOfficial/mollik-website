import Prisma from '@/lib/prisma'
import ProseListClient from '@/components/admin/ProseListClient'

export const dynamic = 'force-dynamic'

async function getEssays() {
    return Prisma.writing.findMany({
        where: { type: { in: ['ESSAY', 'ARTICLE'] } },
        include: { category: true, book: true },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function ProsePage() {
    const essays = await getEssays()

    return (
        <div className="space-y-6">
            <ProseListClient
                essays={essays.map(essay => ({
                    id: essay.id,
                    title: essay.title,
                    slug: essay.slug,
                    status: essay.status,
                    views: essay.views,
                    category: essay.category ? { name: essay.category.name } : null,
                    book: essay.book ? { title: essay.book.title } : null,
                    createdAt: essay.createdAt
                }))}
            />
        </div>
    )
}
