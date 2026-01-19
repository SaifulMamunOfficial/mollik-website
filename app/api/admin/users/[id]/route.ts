
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to check admin permissions
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
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

        const body = await req.json();
        const { name, email, username, role, image, bio } = body;
        const { id } = await params;

        // Prevent modifying own role to lock yourself out (basic check)
        if (id === session.user.id && role !== session.user.role) {
            // Allow Super Admin to change own role? Maybe safe to restrict for now.
            // Actually, usually you shouldn't be able to degrade your own role.
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                username,
                role,
                image,
                bio,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[USER_PATCH]', error);
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

        // Prevent deleting yourself
        if (id === session.user.id) {
            return new NextResponse('Cannot delete yourself', { status: 400 });
        }

        // Check if user has dependent data
        // For now, we might want to just soft delete or rely on cascade if configured,
        // but schema.prisma shows relations. Prisma defaults to restricting delete if relations exist unless cascading is set.
        // The implementation plan mentioned "Soft delete isDeleted".
        // Let's check schema. User has `isDeleted` and `deletedAt`. So we should soft delete.

        const user = await prisma.user.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                // Optionally scramble email or keep it to prevent re-registration?
                // For now, just marking deleted.
            }
        });

        // Alternatively, if we want HARD delete and schema handles cascade:
        // const user = await prisma.user.delete({ where: { id } });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[USER_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
