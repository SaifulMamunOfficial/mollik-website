import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PoemForm from '@/components/admin/PoemForm'

export const dynamic = 'force-dynamic'

interface Props {
    params: { id: string }
}

async function getPoem(id: string) {
    const poem = await prisma.writing.findUnique({
        where: { id, type: 'POEM' },
        include: { category: true, book: true }
    })
    return poem
}

async function getCategories() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

async function getBooks() {
    return prisma.book.findMany({ orderBy: { title: 'asc' } })
}

export default async function EditPoemPage({ params }: Props) {
    const [poem, categories, books] = await Promise.all([
        getPoem(params.id),
        getCategories(),
        getBooks()
    ])

    if (!poem) {
        notFound()
    }

    return (
        <PoemForm
            initialData={{
                id: poem.id,
                title: poem.title,
                slug: poem.slug,
                content: poem.content,
                excerpt: poem.excerpt || undefined,
                categoryId: poem.categoryId || undefined,
                bookId: poem.bookId || undefined,
                year: poem.year || undefined,
                status: poem.status
            }}
            categories={categories}
            books={books}
        />
    )
}
