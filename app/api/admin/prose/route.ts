
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all essays
export async function GET() {
    try {
        const essays = await prisma.writing.findMany({
            where: { type: 'ESSAY' },
            include: { category: true, book: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(essays)
    } catch (error) {
        console.error('Error fetching essays:', error)
        return NextResponse.json({ error: 'Failed to fetch essays' }, { status: 500 })
    }
}

// POST create new essay
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, bookId, year, status } = body

        // Validate required fields
        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: 'Title, slug, and content are required' },
                { status: 400 }
            )
        }

        // Make slug unique by appending number if exists
        let finalSlug = slug
        let counter = 1
        while (await prisma.writing.findUnique({ where: { slug: finalSlug } })) {
            finalSlug = `${slug}-${counter}`
            counter++
        }

        const essay = await prisma.writing.create({
            data: {
                title,
                slug: finalSlug,
                content,
                excerpt: excerpt || null,
                type: 'ESSAY',
                status: status || 'DRAFT',
                year: year || null,
                categoryId: categoryId || null,
                bookId: bookId || null,
                authorId: session.user.id,
            },
        })

        return NextResponse.json(essay, { status: 201 })
    } catch (error) {
        console.error('Error creating essay:', error)
        return NextResponse.json({ error: 'Failed to create essay' }, { status: 500 })
    }
}
