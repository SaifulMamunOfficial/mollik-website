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
        const { coverImage, url, title, description, year, location } = body

        // Support both 'coverImage' (from frontend) and 'url' field names
        const imageUrl = coverImage || url

        if (!imageUrl) {
            return NextResponse.json(
                { message: 'ছবির URL প্রয়োজন' },
                { status: 400 }
            )
        }

        const image = await prisma.galleryImage.create({
            data: {
                url: imageUrl,
                title: title || null,
                description: description || null,
                year: year || null,
                location: location || null,

                status: 'PENDING',
                submittedBy: session.user.id,
            },
        })

        return NextResponse.json(
            {
                image,
                message: 'আপনার ছবি সাবমিট হয়েছে। অনুমোদনের পর প্রকাশিত হবে।'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Gallery submission error:', error)
        return NextResponse.json(
            { message: 'সাবমিট করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
