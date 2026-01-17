
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single image
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const image = await prisma.galleryImage.findUnique({
            where: { id: params.id },
        })

        if (!image) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 })
        }

        return NextResponse.json(image)
    } catch (error) {
        console.error('Error fetching image:', error)
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
    }
}

// PATCH update image (toggle featured, update details)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, url, year, featured, status } = body

        const updatedImage = await prisma.galleryImage.update({
            where: { id: params.id },
            data: {
                title,
                description,
                url,
                year,
                featured,
                status,
            },
        })

        return NextResponse.json(updatedImage)
    } catch (error) {
        console.error('Error updating image:', error)
        return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
    }
}


// DELETE image
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.galleryImage.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Image deleted successfully' })
    } catch (error) {
        console.error('Error deleting image:', error)
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }
}
