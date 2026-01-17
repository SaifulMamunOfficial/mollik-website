
import prisma from '@/lib/prisma'
import ProseForm from '@/components/admin/ProseForm'

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

export default async function NewProsePage() {
    const [categories, books] = await Promise.all([
        getCategories(),
        getBooks()
    ])

    return (
        <ProseForm
            categories={categories}
            books={books}
        />
    )
}
