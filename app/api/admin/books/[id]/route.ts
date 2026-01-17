import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// GET single book
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const book = await prisma.book.findUnique({
            where: { id: params.id },
            include: { writings: true },
        })

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 })
        }

        return NextResponse.json(book)
    } catch (error) {
        console.error('Error fetching book:', error)
        return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
    }
}

// PATCH update book
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, subtitle, description, year, publisher, categoryId } = body

        if (slug) {
            const existingBook = await prisma.book.findFirst({
                where: {
                    slug,
                    id: { not: params.id }
                },
            })

            if (existingBook) {
                return NextResponse.json(
                    { error: 'এই স্লাগ দিয়ে আরেকটি বই আছে' },
                    { status: 400 }
                )
            }
        }

        const book = await prisma.book.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                subtitle,
                description,
                year,
                publisher,
                categoryId,
            },
        })

        return NextResponse.json(book)
    } catch (error) {
        console.error('Error updating book:', error)
        return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
    }
}

// DELETE book
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.book.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Book deleted successfully' })
    } catch (error) {
        console.error('Error deleting book:', error)
        return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
    }
}
