import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// Approve blog post
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

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date()
            },
        })

        return NextResponse.json({
            post,
            message: 'ব্লগ পোস্ট অনুমোদিত হয়েছে'
        })
    } catch (error) {
        console.error('Approve error:', error)
        return NextResponse.json(
            { message: 'অনুমোদন করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
