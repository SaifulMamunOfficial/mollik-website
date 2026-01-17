
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single audio
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const audio = await prisma.audio.findUnique({
            where: { id: params.id },
        })

        if (!audio) {
            return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
        }

        return NextResponse.json(audio)
    } catch (error) {
        console.error('Error fetching audio:', error)
        return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 })
    }
}

// PUT update audio
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
        let { title, slug, audioUrl, coverImage, artist, album, duration, lyrics, status } = body

        const existingAudio = await prisma.audio.findUnique({
            where: { id: params.id },
        })

        if (!existingAudio) {
            return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
        }

        // If slug changed, ensure uniqueness
        if (slug && slug !== existingAudio.slug) {
            let finalSlug = slug
            let counter = 1
            while (await prisma.audio.findFirst({
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

        const updatedAudio = await prisma.audio.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                audioUrl,
                coverImage: coverImage || null,
                artist: artist || null,
                album: album || null,
                duration: duration || null,
                lyrics: lyrics || null,
                status: status || 'DRAFT',
            },
        })

        return NextResponse.json(updatedAudio)
    } catch (error) {
        console.error('Error updating audio:', error)
        return NextResponse.json({ error: 'Failed to update audio' }, { status: 500 })
    }
}

// DELETE audio
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.audio.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Audio deleted successfully' })
    } catch (error) {
        console.error('Error deleting audio:', error)
        return NextResponse.json({ error: 'Failed to delete audio' }, { status: 500 })
    }
}
