
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all gallery images
export async function GET() {
    try {
        const images = await prisma.galleryImage.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(images)
    } catch (error) {
        console.error('Error fetching gallery images:', error)
        return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
    }
}

// POST create new gallery image
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, url, year, featured } = body

        // Validate required fields
        if (!url) {
            return NextResponse.json(
                { error: 'Image URL is required' },
                { status: 400 }
            )
        }

        const image = await prisma.galleryImage.create({
            data: {
                title: title || null,
                description: description || null,
                url,
                year: year || null,
                featured: featured || false,
                status: 'PUBLISHED', // Default to PUBLISHED for now as per upload form logic implies direct add, though client has pending logic.
                // Wait, client has pending/published logic.
                // Let's set status to PUBLISHED if Admin, or PENDING if User (but this is admin route).
                // Existing GalleryClient had Approve/Reject logic.
                // If I upload from Admin, maybe direct PUBLISH?
                // The schema has default PUBLISHED.
                submittedBy: session.user.id,
            },
        })

        return NextResponse.json(image, { status: 201 })
    } catch (error) {
        console.error('Error creating gallery image:', error)
        return NextResponse.json({ error: 'Failed to create image' }, { status: 500 })
    }
}
