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
        const { url, title, description, year } = body

        if (!url) {
            return NextResponse.json(
                { message: 'ছবির URL প্রয়োজন' },
                { status: 400 }
            )
        }

        const image = await prisma.galleryImage.create({
            data: {
                url,
                title: title || null,
                description: description || null,
                year: year || null,
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
