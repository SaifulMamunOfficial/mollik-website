
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all audios
export async function GET() {
    try {
        const audios = await prisma.audio.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(audios)
    } catch (error) {
        console.error('Error fetching audios:', error)
        return NextResponse.json({ error: 'Failed to fetch audios' }, { status: 500 })
    }
}

// POST create new audio
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, audioUrl, coverImage, artist, album, duration, lyrics, status } = body

        // Validate required fields
        if (!title || !slug || !audioUrl) {
            return NextResponse.json(
                { error: 'Title, slug, and audio URL are required' },
                { status: 400 }
            )
        }

        // Make slug unique by appending number if exists
        let finalSlug = slug
        let counter = 1
        while (await prisma.audio.findUnique({ where: { slug: finalSlug } })) {
            finalSlug = `${slug}-${counter}`
            counter++
        }

        const audio = await prisma.audio.create({
            data: {
                title,
                slug: finalSlug,
                audioUrl,
                coverImage: coverImage || null,
                artist: artist || null,
                album: album || null,
                duration: duration || null,
                lyrics: lyrics || null,
                status: status || 'DRAFT',
                submittedBy: session.user.id,
            },
        })

        return NextResponse.json(audio, { status: 201 })
    } catch (error) {
        console.error('Error creating audio:', error)
        return NextResponse.json({ error: 'Failed to create audio' }, { status: 500 })
    }
}
