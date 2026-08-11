import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single video
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const video = await prisma.video.findUnique({
            where: { id: params.id },
        })

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        }

        return NextResponse.json(video)
    } catch (error) {
        console.error('Error fetching video:', error)
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
    }
}

// PUT update video
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
        let { title, slug, description, youtubeId, duration, category, featured, status } = body

        const existingVideo = await prisma.video.findUnique({
            where: { id: params.id },
        })

        if (!existingVideo) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        }

        // If slug changed, ensure uniqueness
        if (slug && slug !== existingVideo.slug) {
            let finalSlug = slug
            let counter = 1
            while (await prisma.video.findFirst({
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

        const updatedVideo = await prisma.video.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                description,
                youtubeId,
                duration,
                category,
                featured: featured || false,
                status: status || 'PUBLISHED',
            },
        })

        return NextResponse.json(updatedVideo)
    } catch (error) {
        console.error('Error updating video:', error)
        return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
    }
}

// DELETE video
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.video.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Video deleted successfully' })
    } catch (error) {
        console.error('Error deleting video:', error)
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
    }
}
