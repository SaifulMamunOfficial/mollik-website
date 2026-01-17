import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'অনুমতি নেই' }, { status: 403 })
        }

        const audio = await prisma.audio.update({
            where: { id: params.id },
            data: { status: 'ARCHIVED' },
        })

        return NextResponse.json({ audio, message: 'অডিও বাতিল করা হয়েছে' })
    } catch (error) {
        return NextResponse.json({ message: 'বাতিল করতে সমস্যা হয়েছে' }, { status: 500 })
    }
}
