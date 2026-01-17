
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import SongForm from '@/components/admin/SongForm'

interface Props {
    params: {
        id: string
    }
}

async function getSong(id: string) {
    return prisma.writing.findUnique({
        where: { id },
        include: { category: true, book: true },
    })
}

async function getCategories() {
    return prisma.category.findMany({
        where: { type: 'SONG' },
        orderBy: { name: 'asc' },
    })
}

async function getBooks() {
    return prisma.book.findMany({
        orderBy: { title: 'asc' },
    })
}

export default async function EditSongPage({ params }: Props) {
    const [song, categories, books] = await Promise.all([
        getSong(params.id),
        getCategories(),
        getBooks()
    ])

    if (!song) {
        notFound()
    }

    return (
        <SongForm
            initialData={{
                id: song.id,
                title: song.title,
                slug: song.slug,
                content: song.content,
                excerpt: song.excerpt || undefined,
                categoryId: song.categoryId || undefined,
                bookId: song.bookId || undefined,
                year: song.year || undefined,
                status: song.status,
                composer: song.composer || undefined
            }}
            categories={categories}
            books={books}
        />
    )
}
