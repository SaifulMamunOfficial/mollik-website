
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ProseForm from '@/components/admin/ProseForm'

interface Props {
    params: {
        id: string
    }
}

async function getEssay(id: string) {
    return prisma.writing.findUnique({
        where: { id },
        include: { category: true, book: true },
    })
}

async function getCategories() {
    return prisma.category.findMany({
        where: { type: 'ESSAY' },
        orderBy: { name: 'asc' },
    })
}

async function getBooks() {
    return prisma.book.findMany({
        orderBy: { title: 'asc' },
    })
}

export default async function EditProsePage({ params }: Props) {
    const [essay, categories, books] = await Promise.all([
        getEssay(params.id),
        getCategories(),
        getBooks()
    ])

    if (!essay || essay.type !== 'ESSAY') {
        notFound()
    }

    return (
        <ProseForm
            initialData={{
                id: essay.id,
                title: essay.title,
                slug: essay.slug,
                content: essay.content,
                excerpt: essay.excerpt || undefined,
                readTime: essay.readTime || undefined,
                categoryId: essay.categoryId || undefined,
                bookId: essay.bookId || undefined,
                year: essay.year || undefined,
                status: essay.status,
            }}
            categories={categories}
            books={books}
        />
    )
}
