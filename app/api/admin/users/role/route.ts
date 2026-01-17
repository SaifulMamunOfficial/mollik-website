import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic'

const HIERARCHY = {
    "SUPER_ADMIN": 4,
    "ADMIN": 3,
    "MANAGER": 2,
    "EDITOR": 1,
    "USER": 0
};

export async function PUT(req: Request) {
    try {
        const session = await auth();

        // 1. Check Authentication
        if (!session?.user?.id) {
            return NextResponse.json({ message: "লগইন করা প্রয়োজন" }, { status: 401 });
        }

        // 2. Fetch Current User Role from DB (Don't trust session role strictly for critical actions)
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        const currentUserRole = currentUser?.role as keyof typeof HIERARCHY;
        const currentUserLevel = HIERARCHY[currentUserRole] || 0;

        // Minimum ADMIN level required to access this API
        if (currentUserLevel < HIERARCHY.ADMIN) {
            return NextResponse.json({ message: "অনুমতি নেই" }, { status: 403 });
        }

        const body = await req.json();
        const { userId, newRole } = body;

        if (!userId || !newRole) {
            return NextResponse.json({ message: "তথ্য অসম্পূর্ণ" }, { status: 400 });
        }

        // Validate New Role
        if (!Object.keys(HIERARCHY).includes(newRole)) {
            return NextResponse.json({ message: "অগ্রহণযোগ্য রোল" }, { status: 400 });
        }

        // 3. Prevent Self-Modification (Safety)
        if (userId === session.user.id) {
            return NextResponse.json({ message: "নিজের রোল নিজে পরিবর্তন করা যাবে না" }, { status: 400 });
        }

        // 4. Fetch Target User
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!targetUser) {
            return NextResponse.json({ message: "ব্যবহারকারী পাওয়া যায়নি" }, { status: 404 });
        }

        const targetUserRole = targetUser.role as keyof typeof HIERARCHY;
        const targetUserLevel = HIERARCHY[targetUserRole] || 0;
        const newRoleLevel = HIERARCHY[newRole as keyof typeof HIERARCHY] || 0;

        // 5. Hierarchy Checks
        // Can only modify users with lower role level than self
        if (targetUserLevel >= currentUserLevel) {
            return NextResponse.json({ message: "আপনার সমপর্যায় বা উপরের কারো রোল পরিবর্তন করতে পারবেন না" }, { status: 403 });
        }

        // Can only promote to a role lower than self
        if (newRoleLevel >= currentUserLevel) {
            return NextResponse.json({ message: "আপনার নিজের রোলের সমান বা উপরে কাউকে প্রমোট করতে পারবেন না" }, { status: 403 });
        }

        // 6. Update User Role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }, // @ts-ignore - Prisma enum types might not be regenerated in IDE intellisense yet
        });

        return NextResponse.json({
            message: "রোল সফলভাবে আপডেট হয়েছে",
            user: updatedUser
        });

    } catch (error) {
        console.error("Role Update Error:", error);
        return NextResponse.json(
            { message: "রোল আপডেট করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
