
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from "@/auth"

// POST: Create a new video
export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { title, slug, description, youtubeId, duration, category, featured } = body

        if (!title || !youtubeId) {
            return NextResponse.json(
                { error: 'শিরোনাম এবং YouTube ID আবশ্যক' },
                { status: 400 }
            )
        }

        // Ensure unique slug
        let finalSlug = slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
        let counter = 1
        while (await prisma.video.findUnique({ where: { slug: finalSlug } })) {
            finalSlug = `${slug}-${counter}`
            counter++
        }

        const video = await prisma.video.create({
            data: {
                title,
                slug: finalSlug,
                description,
                youtubeId,
                duration,
                category,
                featured: featured || false,
                status: 'PUBLISHED', // Default to published for valid admin creations
            },
        })

        return NextResponse.json(video)
    } catch (error) {
        console.error('Error creating video:', error)
        return NextResponse.json(
            { error: 'ভিডিও তৈরি করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}

// GET: List videos (optional, for admin list if needed via API)
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(videos)
    } catch (error) {
        console.error('Error fetching videos:', error)
        return NextResponse.json(
            { error: 'ভিডিও লোড করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
