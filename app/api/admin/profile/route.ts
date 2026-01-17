import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

// GET - Fetch current user profile
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুমতি নেই" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { message: "প্রোফাইল লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

// PUT - Update user profile
export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুমতি নেই" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, image, currentPassword, newPassword } = body;

        // Build update data
        const updateData: { name?: string; image?: string; password?: string } = {};

        if (name) {
            updateData.name = name;
        }

        if (image) {
            updateData.image = image;
        }

        // Handle password change
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { message: "বর্তমান পাসওয়ার্ড দিতে হবে" },
                    { status: 400 }
                );
            }

            // Verify current password
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { password: true }
            });

            if (!user?.password) {
                return NextResponse.json(
                    { message: "পাসওয়ার্ড যাচাই করা যায়নি" },
                    { status: 400 }
                );
            }

            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json(
                    { message: "বর্তমান পাসওয়ার্ড সঠিক নয়" },
                    { status: 400 }
                );
            }

            // Hash new password
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
            }
        });

        return NextResponse.json({
            message: "প্রোফাইল আপডেট হয়েছে",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { message: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
