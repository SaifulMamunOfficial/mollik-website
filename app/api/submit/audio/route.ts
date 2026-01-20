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
        const { title, audioUrl, artist, album, duration, coverImage, lyrics } = body

        if (!title || !audioUrl) {
            return NextResponse.json(
                { message: 'শিরোনাম এবং অডিও URL প্রয়োজন' },
                { status: 400 }
            )
        }

        // Generate base slug
        let slug = title
            .toLowerCase()
            .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        // Ensure unique slug
        let uniqueSlug = slug
        let counter = 1

        while (await prisma.audio.findFirst({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`
            counter++
        }

        const audio = await prisma.audio.create({
            data: {
                title,
                slug: uniqueSlug,
                audioUrl,
                artist: artist || null,
                album: album || null,
                duration: duration || null,
                coverImage: coverImage || null,
                lyrics: lyrics || null,
                status: 'PENDING',
                submittedBy: session.user.id,
            },
        })

        return NextResponse.json(
            {
                audio,
                message: 'আপনার অডিও সাবমিট হয়েছে। অনুমোদনের পর প্রকাশিত হবে।'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Audio submission error:', error)
        return NextResponse.json(
            { message: 'সাবমিট করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
