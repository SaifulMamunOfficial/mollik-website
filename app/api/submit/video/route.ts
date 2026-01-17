import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'লগইন করুন' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { title, youtubeUrl, description, duration, category } = body

        if (!title || !youtubeUrl) {
            return NextResponse.json(
                { message: 'শিরোনাম এবং YouTube URL প্রয়োজন' },
                { status: 400 }
            )
        }

        // Extract YouTube ID
        const youtubeIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : youtubeUrl

        // Generate slug
        const slug = title
            .toLowerCase()
            .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() + '-' + Date.now()

        const video = await prisma.video.create({
            data: {
                title,
                slug,
                youtubeId,
                description: description || null,
                duration: duration || null,
                category: category || null,
                thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
                status: 'PENDING',
                submittedBy: session.user.id,
            },
        })

        return NextResponse.json(
            {
                video,
                message: 'আপনার ভিডিও সাবমিট হয়েছে। অনুমোদনের পর প্রকাশিত হবে।'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Video submission error:', error)
        return NextResponse.json(
            { message: 'সাবমিট করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
