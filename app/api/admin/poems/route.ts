import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// GET all poems
export async function GET() {
    try {
        const poems = await prisma.writing.findMany({
            where: { type: 'POEM' },
            include: { category: true, book: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(poems)
    } catch (error) {
        console.error('Error fetching poems:', error)
        return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 })
    }
}

// POST create new poem
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, bookId, year, status, type } = body

        // Validate required fields
        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: 'Title, slug, and content are required' },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existingPoem = await prisma.writing.findUnique({
            where: { slug },
        })

        if (existingPoem) {
            return NextResponse.json(
                { error: 'এই স্লাগ দিয়ে আরেকটি রচনা আছে' },
                { status: 400 }
            )
        }

        const poem = await prisma.writing.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                type: type || 'POEM',
                status: status || 'DRAFT',
                year: year || null,
                categoryId: categoryId || null,
                bookId: bookId || null,
                authorId: session.user.id,
            },
        })

        return NextResponse.json(poem, { status: 201 })
    } catch (error) {
        console.error('Error creating poem:', error)
        return NextResponse.json({ error: 'Failed to create poem' }, { status: 500 })
    }
}
