import prisma from '@/lib/prisma'
import BooksTable from '@/components/admin/BooksTable'

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

    return <BooksTable books={books as any} />
}
