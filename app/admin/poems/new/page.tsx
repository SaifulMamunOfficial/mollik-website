import prisma from '@/lib/prisma'
import PoemForm from '@/components/admin/PoemForm'

async function getData() {
    const [categories, books] = await Promise.all([
        prisma.category.findMany({
            where: { type: 'POEM' },
            orderBy: { name: 'asc' },
        }),
        prisma.book.findMany({
            orderBy: { title: 'asc' },
        }),
    ])

    return { categories, books }
}

export default async function NewPoemPage() {
    const { categories, books } = await getData()

    return <PoemForm categories={categories} books={books} />
}
