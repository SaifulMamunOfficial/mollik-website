import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MANAGER']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users list:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}
