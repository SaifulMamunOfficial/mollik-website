import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুগ্রহ করে লগইন করুন" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: "বর্তমান এবং নতুন পাসওয়ার্ড দিন" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: "নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে" },
                { status: 400 }
            );
        }

        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true },
        });

        if (!user?.password) {
            return NextResponse.json(
                { message: "এই অ্যাকাউন্টে পাসওয়ার্ড সেট করা নেই" },
                { status: 400 }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "বর্তমান পাসওয়ার্ড সঠিক নয়" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({
            message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে",
        });
    } catch (error) {
        console.error("Password Change Error:", error);
        return NextResponse.json(
            { message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
