import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// PATCH update status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { status } = body

        const submission = await prisma.contactSubmission.update({
            where: { id: params.id },
            data: { status },
        })

        return NextResponse.json(submission)
    } catch (error) {
        console.error('Error updating contact:', error)
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
    }
}

// DELETE submission
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.contactSubmission.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Submission deleted successfully' })
    } catch (error) {
        console.error('Error deleting contact:', error)
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
    }
}
