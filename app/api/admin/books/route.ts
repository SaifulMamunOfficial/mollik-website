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

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        let { title, slug, subtitle, description, year, publisher, categoryId, coverImage } = body

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        // If no slug provided, generate from title (will be handled by client)
        if (!slug) {
            slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        }

        // Make slug unique by appending number if exists
        let finalSlug = slug
        let counter = 1
        while (await prisma.book.findUnique({ where: { slug: finalSlug } })) {
            finalSlug = `${slug}-${counter}`
            counter++
        }

        const book = await prisma.book.create({
            data: {
                title,
                slug: finalSlug,
                subtitle,
                description,
                year,
                publisher,
                coverImage,
                categoryId: categoryId || 'poetry', // Default category
            },
        })

        return NextResponse.json(book, { status: 201 })
    } catch (error) {
        console.error('Error creating book:', error)
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
    }
}
