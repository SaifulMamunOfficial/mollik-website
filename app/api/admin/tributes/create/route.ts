
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json(
                { message: 'অনুমতি নেই' },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { content, district, name, designation, displayOption, manualDate, isFeatured } = body

        if (!content || content.trim().length < 5) {
            return NextResponse.json(
                { message: 'শোকবার্তা অন্তত ৫ অক্ষরের হতে হবে' },
                { status: 400 }
            )
        }

        if (!name) {
            return NextResponse.json(
                { message: 'নাম আবশ্যক' },
                { status: 400 }
            )
        }

        const tribute = await prisma.tribute.create({
            data: {
                content: content.trim(),
                district: district || null,
                name: name.trim(),
                designation: designation?.trim() || null,
                displayOption: displayOption || 'DISTRICT',
                manualDate: manualDate ? new Date(manualDate) : null,
                isFeatured: isFeatured !== undefined ? isFeatured : undefined,
                status: 'PUBLISHED', // Auto-publish for admin entries
                authorId: session.user.id,
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

        return NextResponse.json(
            {
                tribute,
                message: 'শোকবার্তা সফলভাবে যোগ করা হয়েছে'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Manual tribute creation error:', error)
        return NextResponse.json(
            { message: 'শোকবার্তা যোগ করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
