import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// GET single poem
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const poem = await prisma.writing.findUnique({
            where: { id },
            include: { category: true, book: true },
        })

        if (!poem) {
            return NextResponse.json({ error: 'Poem not found' }, { status: 404 })
        }

        return NextResponse.json(poem)
    } catch (error) {
        console.error('Error fetching poem:', error)
        return NextResponse.json({ error: 'Failed to fetch poem' }, { status: 500 })
    }
}

// PUT update poem
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        let { title, slug, content, excerpt, categoryId, bookId, year, status } = body

        // Check if poem exists
        const existingPoem = await prisma.writing.findUnique({
            where: { id },
        })

        if (!existingPoem) {
            return NextResponse.json({ error: 'Poem not found' }, { status: 404 })
        }

        // If slug changed, ensure uniqueness
        if (slug && slug !== existingPoem.slug) {
            let finalSlug = slug
            let counter = 1
            while (await prisma.writing.findFirst({
                where: {
                    slug: finalSlug,
                    id: { not: id }
                }
            })) {
                finalSlug = `${slug}-${counter}`
                counter++
            }
            slug = finalSlug
        }

        const poem = await prisma.writing.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                status: status || 'DRAFT',
                year: year || null,
                categoryId: categoryId || null,
                bookId: bookId || null,
            },
        })

        return NextResponse.json(poem)
    } catch (error) {
        console.error('Error updating poem:', error)
        return NextResponse.json({ error: 'Failed to update poem' }, { status: 500 })
    }
}

// DELETE poem
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.writing.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting poem:', error)
        return NextResponse.json({ error: 'Failed to delete poem' }, { status: 500 })
    }
}
