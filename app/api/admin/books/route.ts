import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all books
export async function GET() {
    try {
        const books = await prisma.book.findMany({
            include: { _count: { select: { writings: true } } },
            orderBy: { year: 'desc' },
        })

        return NextResponse.json(books)
    } catch (error) {
        console.error('Error fetching books:', error)
        return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
    }
}

// POST create new book
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, subtitle, description, year, publisher, categoryId } = body

        if (!title || !slug) {
            return NextResponse.json(
                { error: 'Title and slug are required' },
                { status: 400 }
            )
        }

        const existingBook = await prisma.book.findUnique({
            where: { slug },
        })

        if (existingBook) {
            return NextResponse.json(
                { error: 'এই স্লাগ দিয়ে আরেকটি বই আছে' },
                { status: 400 }
            )
        }

        const book = await prisma.book.create({
            data: {
                title,
                slug,
                subtitle,
                description,
                year,
                publisher,
                categoryId: categoryId || 'poetry', // Default category
            },
        })

        return NextResponse.json(book, { status: 201 })
    } catch (error) {
        console.error('Error creating book:', error)
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
    }
}
