import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReadingPageClient from './ReadingPageClient'
import { Metadata } from 'next'

// Keep dynamic for fresh data
export const dynamic = 'force-dynamic'

interface Props {
    params: {
        slug: string
        writingSlug: string
    }
}

async function getBookAndWriting(slug: string, writingSlug: string) {
    const decodedSlug = decodeURIComponent(slug)
    const decodedWritingSlug = decodeURIComponent(writingSlug)

    const book = await prisma.book.findUnique({
        where: { slug: decodedSlug },
        include: {
            writings: {
                select: {
                    id: true,
                    title: true,
                    slug: true
                },
                orderBy: { title: 'asc' }
            }
        }
    })

    if (!book) return null

    const writing = await prisma.writing.findUnique({
        where: { slug: decodedWritingSlug },
    })

    if (!writing || writing.bookId !== book.id) return null

    return { book, writing }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const data = await getBookAndWriting(params.slug, params.writingSlug)
    if (!data) return {}

    return {
        title: `${data.writing.title} - ${data.book.title} | মতিউর রহমান মল্লিক`,
        description: data.writing.excerpt || data.writing.content.substring(0, 160),
    }
}

export default async function ReadingPage({ params }: Props) {
    const data = await getBookAndWriting(params.slug, params.writingSlug)

    if (!data) {
        notFound()
    }

    const { book, writing } = data

    // Determine Prev/Next logic
    const currentIndex = book.writings.findIndex(w => w.id === writing.id)
    const prevWriting = currentIndex > 0 ? book.writings[currentIndex - 1] : null
    const nextWriting = currentIndex < book.writings.length - 1 ? book.writings[currentIndex + 1] : null

    return (
        <ReadingPageClient
            book={{ title: book.title, slug: book.slug }}
            writing={{
                id: writing.id,
                title: writing.title,
                slug: writing.slug,
                content: writing.content,
                type: 'রচনা' // Default type or fetch from writing.type if needed
            }}
            allWritings={book.writings}
            prevWriting={prevWriting}
            nextWriting={nextWriting}
        />
    )
}
