
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "অনুমোদিত নয়" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Soft delete logic
        // 1. Mark as deleted
        // 2. Anonymize sensitive data (optional but recommended)
        // 3. Clear sessions

        await prisma.$transaction(async (tx) => {
            // Update User
            await tx.user.update({
                where: { id: userId },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                    // We keep the email but modify it to free up the original email
                    // This creates a "shadow" account that holds the content
                    email: `deleted-${Date.now()}-${userId}@deleted.com`,
                    username: null, // Remove username so it's not searchable
                    name: "Deleted User", // Generic name
                    image: null,
                    bio: null,
                    // Clear notification settings
                    notifyUpdates: false,
                    notifyComments: false,
                    notifySubmission: false,
                }
            });

            // Delete Sessions (Force Logout)
            await tx.session.deleteMany({
                where: { userId: userId }
            });

            // Delete Accounts (Social Logins) - preventing re-login with same provider to this account
            await tx.account.deleteMany({
                where: { userId: userId }
            });

            // Note: We DO NOT delete BlogPosts, Writings, etc.
        });

        return NextResponse.json({ message: "একাউন্ট সফলভাবে মুছে ফেলা হয়েছে" });

    } catch (error) {
        console.error("Account deletion error:", error);
        return NextResponse.json(
            { message: "একাউন্ট মুছতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
