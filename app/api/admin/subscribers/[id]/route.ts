
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// Helper to check admin permissions
async function checkAdmin() {
    const session = await auth();
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role)) {
        return null;
    }
    return session;
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await checkAdmin();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { isActive } = await req.json();
        const { id } = await params;

        const subscriber = await prisma.subscriber.update({
            where: { id },
            data: { isActive },
        });

        return NextResponse.json(subscriber);
    } catch (error) {
        console.error('[SUBSCRIBER_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await checkAdmin();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const subscriber = await prisma.subscriber.delete({
            where: { id },
        });

        return NextResponse.json(subscriber);
    } catch (error) {
        console.error('[SUBSCRIBER_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
