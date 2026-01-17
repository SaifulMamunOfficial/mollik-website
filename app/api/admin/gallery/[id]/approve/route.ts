import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// Approve gallery image
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'অনুমতি নেই' },
                { status: 403 }
            )
        }

        const image = await prisma.galleryImage.update({
            where: { id: params.id },
            data: { status: 'PUBLISHED' },
        })

        return NextResponse.json({
            image,
            message: 'ছবি অনুমোদিত হয়েছে'
        })
    } catch (error) {
        console.error('Approve error:', error)
        return NextResponse.json(
            { message: 'অনুমোদন করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
