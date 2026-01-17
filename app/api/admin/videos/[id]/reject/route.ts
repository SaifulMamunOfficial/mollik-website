import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ message: 'অনুমতি নেই' }, { status: 403 })
        }

        const video = await prisma.video.update({
            where: { id: params.id },
            data: { status: 'ARCHIVED' },
        })

        return NextResponse.json({ video, message: 'ভিডিও বাতিল করা হয়েছে' })
    } catch (error) {
        return NextResponse.json({ message: 'বাতিল করতে সমস্যা হয়েছে' }, { status: 500 })
    }
}
