import prisma from '@/lib/prisma'
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import BooksPageClient from "./BooksPageClient"

export const dynamic = 'force-dynamic'

async function getBooks() {
    const books = await prisma.book.findMany({
        include: {
            _count: {
                select: { writings: true }
            }
        },
        orderBy: { year: 'desc' }
    })
    return books
}

export default async function BooksPage() {
    const books = await getBooks()

    // Transform for client component
    const booksData = books.map(book => ({
        id: book.id,
        title: book.title,
        slug: book.slug,
        subtitle: book.subtitle || '',
        description: book.description || '',
        year: book.year || '',
        publisher: book.publisher || '',
        coverImage: book.coverImage || '',
        categoryId: book.categoryId,
        category: getCategoryName(book.categoryId),
        totalWritings: book._count.writings
    }))

    return (
        <>
            <Header />
            <BooksPageClient books={booksData} />
            <Footer />
        </>
    )
}

function getCategoryName(categoryId: string): string {
    const categories: Record<string, string> = {
        'poetry': 'কবিতা সংকলন',
        'songs': 'গান সংকলন',
        'essays': 'প্রবন্ধ',
        'children': 'শিশু সাহিত্য',
        'complete': 'রচনাবলী'
    }
    return categories[categoryId] || categoryId
}
