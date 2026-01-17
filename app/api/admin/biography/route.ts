import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { getBiographyFromDB } from '@/lib/data';

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await getBiographyFromDB();

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch biography settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const settings = await prisma.siteSettings.upsert({
            where: { id: 'main' },
            create: {
                id: 'main',
                ...body
            },
            update: body
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error updating biography:", error);
        return NextResponse.json({ error: 'Failed to update biography settings' }, { status: 500 });
    }
}
