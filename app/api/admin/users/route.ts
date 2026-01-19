
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role)) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name, email, username, role, password, image, bio } = body;

        if (!name || !email || !password) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new NextResponse('User with this email already exists', { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                username: username || email.split('@')[0], // Fallback username
                role: role || 'USER',
                password: hashedPassword,
                image,
                bio,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[USERS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
