import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all contact submissions
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const submissions = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(submissions)
    } catch (error) {
        console.error('Error fetching contacts:', error)
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
    }
}
