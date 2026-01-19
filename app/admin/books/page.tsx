import BookListClient from '@/components/admin/BookListClient'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getBooks() {
    return prisma.book.findMany({
        include: {
            _count: {
                select: { writings: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function BooksPage() {
    const books = await getBooks()

    // Transform data to match client interface
    const formattedBooks = books.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        subtitle: b.subtitle,
        publisher: b.publisher,
        year: b.year,
        coverImage: b.coverImage,
        writingsCount: b._count.writings
    }))

    return (
        <div className="space-y-6">
            <BookListClient books={formattedBooks} />
        </div>
    )
}
