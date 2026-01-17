import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single song
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const song = await prisma.writing.findUnique({
            where: { id: params.id },
            include: { category: true, book: true },
        })

        if (!song || song.type !== 'SONG') {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 })
        }

        return NextResponse.json(song)
    } catch (error) {
        console.error('Error fetching song:', error)
        return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 })
    }
}

// PATCH update song
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, bookId, year, status, composer } = body

        // Check if slug exists for other songs
        if (slug) {
            const existingSong = await prisma.writing.findFirst({
                where: {
                    slug,
                    id: { not: params.id }
                },
            })

            if (existingSong) {
                return NextResponse.json(
                    { error: 'এই স্লাগ দিয়ে আরেকটি গান আছে' },
                    { status: 400 }
                )
            }
        }

        const song = await prisma.writing.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                content,
                excerpt,
                status,
                year,
                categoryId,
                bookId,
                composer,
            },
        })

        return NextResponse.json(song)
    } catch (error) {
        console.error('Error updating song:', error)
        return NextResponse.json({ error: 'Failed to update song' }, { status: 500 })
    }
}

// DELETE song
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.writing.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Song deleted successfully' })
    } catch (error) {
        console.error('Error deleting song:', error)
        return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 })
    }
}
