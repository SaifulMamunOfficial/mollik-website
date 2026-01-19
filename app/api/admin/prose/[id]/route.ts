
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single essay
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const essay = await prisma.writing.findUnique({
            where: { id: params.id },
            include: { category: true, book: true },
        })

        if (!essay || essay.type !== 'ESSAY') {
            return NextResponse.json({ error: 'Essay not found' }, { status: 404 })
        }

        return NextResponse.json(essay)
    } catch (error) {
        console.error('Error fetching essay:', error)
        return NextResponse.json({ error: 'Failed to fetch essay' }, { status: 500 })
    }
}

// PUT update essay
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        let { title, slug, content, excerpt, categoryId, bookId, year, status } = body

        const existingEssay = await prisma.writing.findUnique({
            where: { id: params.id },
        })

        if (!existingEssay) {
            return NextResponse.json({ error: 'Essay not found' }, { status: 404 })
        }

        // If slug changed, ensure uniqueness
        if (slug && slug !== existingEssay.slug) {
            let finalSlug = slug
            let counter = 1
            while (await prisma.writing.findFirst({
                where: {
                    slug: finalSlug,
                    id: { not: params.id }
                }
            })) {
                finalSlug = `${slug}-${counter}`
                counter++
            }
            slug = finalSlug
        }

        const updatedEssay = await prisma.writing.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                type: 'ESSAY',
                status: status || 'DRAFT',
                year: year || null,
                categoryId: categoryId || null,
                bookId: bookId || null,
            },
        })

        return NextResponse.json(updatedEssay)
    } catch (error) {
        console.error('Error updating essay:', error)
        return NextResponse.json({ error: 'Failed to update essay' }, { status: 500 })
    }
}

// DELETE essay
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.writing.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Essay deleted successfully' })
    } catch (error) {
        console.error('Error deleting essay:', error)
        return NextResponse.json({ error: 'Failed to delete essay' }, { status: 500 })
    }
}
