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

// PUT update song
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
        let { title, slug, content, excerpt, categoryId, bookId, year, status, composer } = body

        const existingSong = await prisma.writing.findUnique({
            where: { id: params.id },
        })

        if (!existingSong) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 })
        }

        // If slug changed, ensure uniqueness
        if (slug && slug !== existingSong.slug) {
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

        const updatedSong = await prisma.writing.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                status: status || 'DRAFT',
                year: year || null,
                categoryId: categoryId || null,
                bookId: bookId || null,
                composer: composer || null,
            },
        })

        return NextResponse.json(updatedSong)
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

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
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
