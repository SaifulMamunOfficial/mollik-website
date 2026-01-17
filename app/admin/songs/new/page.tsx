import prisma from '@/lib/prisma'
import SongForm from '@/components/admin/SongForm'

async function getData() {
    const [categories, books] = await Promise.all([
        prisma.category.findMany({
            where: { type: 'SONG' },
            orderBy: { name: 'asc' },
        }),
        prisma.book.findMany({
            orderBy: { title: 'asc' },
        }),
    ])

    return { categories, books }
}

export default async function NewSongPage() {
    const { categories, books } = await getData()

    return <SongForm categories={categories} books={books} />
}
