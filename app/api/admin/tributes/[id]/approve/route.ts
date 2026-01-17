import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// Approve tribute
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

        const tribute = await prisma.tribute.update({
            where: { id: params.id },
            data: { status: 'PUBLISHED' },
        })

        return NextResponse.json({
            tribute,
            message: 'শ্রদ্ধাঞ্জলি অনুমোদিত হয়েছে'
        })
    } catch (error) {
        console.error('Approve error:', error)
        return NextResponse.json(
            { message: 'অনুমোদন করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
