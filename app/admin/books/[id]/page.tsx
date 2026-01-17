import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BookForm from '@/components/admin/BookForm'

export const dynamic = 'force-dynamic'

interface Props {
    params: { id: string }
}

async function getBook(id: string) {
    const book = await prisma.book.findUnique({
        where: { id }
    })
    return book
}

export default async function EditBookPage({ params }: Props) {
    const book = await getBook(params.id)

    if (!book) {
        notFound()
    }

    return (
        <BookForm
            initialData={{
                id: book.id,
                title: book.title,
                slug: book.slug,
                subtitle: book.subtitle || undefined,
                description: book.description || undefined,
                year: book.year || undefined,
                publisher: book.publisher || undefined,
                coverImage: book.coverImage || undefined,
                categoryId: book.categoryId
            }}
        />
    )
}
