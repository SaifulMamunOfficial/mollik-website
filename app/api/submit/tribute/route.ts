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
        const { content, district } = body

        if (!content || content.trim().length < 10) {
            return NextResponse.json(
                { message: 'শ্রদ্ধাঞ্জলি অন্তত ১০ অক্ষরের হতে হবে' },
                { status: 400 }
            )
        }

        const tribute = await prisma.tribute.create({
            data: {
                content: content.trim(),
                district: district || null,
                status: 'PENDING',
                authorId: session.user.id,
            },
        })

        return NextResponse.json(
            {
                tribute,
                message: 'আপনার শ্রদ্ধাঞ্জলি সাবমিট হয়েছে। অনুমোদনের পর প্রকাশিত হবে।'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Tribute submission error:', error)
        return NextResponse.json(
            { message: 'সাবমিট করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
