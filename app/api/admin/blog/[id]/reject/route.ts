import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// Reject blog post
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json(
                { message: 'অনুমতি নেই' },
                { status: 403 }
            )
        }

        const body = await req.json().catch(() => ({}))
        const reason = body.reason || 'কন্টেন্ট নীতিমালা অনুযায়ী গ্রহণযোগ্য নয়'

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: { status: 'ARCHIVED' },
        })

        // TODO: Send notification to author about rejection with reason

        return NextResponse.json({
            post,
            message: 'ব্লগ পোস্ট বাতিল করা হয়েছে'
        })
    } catch (error) {
        console.error('Reject error:', error)
        return NextResponse.json(
            { message: 'বাতিল করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
