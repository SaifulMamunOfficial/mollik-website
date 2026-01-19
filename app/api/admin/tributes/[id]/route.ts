import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth()

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { content, district, name, designation, displayOption, manualDate, isFeatured } = body

        // Validate basic requirement if content is provided
        if (content && content.trim().length < 5) {
            return NextResponse.json(
                { message: 'শোকবার্তা অন্তত ৫ অক্ষরের হতে হবে' },
                { status: 400 }
            )
        }

        const tribute = await prisma.tribute.update({
            where: { id: params.id },
            data: {
                content: content?.trim(),
                district: district || null,
                name: name?.trim(),
                designation: designation?.trim() || null,
                displayOption: displayOption || 'DISTRICT',
                manualDate: manualDate ? new Date(manualDate) : null,
                isFeatured: isFeatured !== undefined ? isFeatured : undefined,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Tribute updated successfully',
            tribute
        })
    } catch (error) {
        console.error('Update tribute error:', error)
        return NextResponse.json(
            { message: 'Failed to update tribute' },
            { status: 500 }
        )
    }
}
