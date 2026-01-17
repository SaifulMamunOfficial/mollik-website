import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PUT - Update user profile
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
        const { name, bio, image, username, notifications } = body;

        // Validations for username change
        if (username !== undefined) {
            // 1. Check format
            const usernameRegex = /^[a-zA-Z0-9-]+$/;
            if (!usernameRegex.test(username)) {
                return NextResponse.json(
                    { message: "ইউজারনেম শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা এবং হাইফেন (-) হতে পারে" },
                    { status: 400 }
                );
            }

            // 2. Check time restriction (3 months)
            const currentUser = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { lastUsernameChange: true, username: true }
            });

            if (currentUser?.username === username) {
                // No change needed
            } else if (currentUser?.lastUsernameChange) {
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

                if (currentUser.lastUsernameChange > threeMonthsAgo) {
                    return NextResponse.json(
                        { message: "আপনি ৩ মাসের মধ্যে একবারই ইউজারনেম পরিবর্তন করতে পারবেন" },
                        { status: 403 }
                    );
                }
            }

            // 3. Check uniqueness
            const existingUser = await prisma.user.findUnique({
                where: { username }
            });

            if (existingUser && existingUser.id !== session.user.id) {
                return NextResponse.json(
                    { message: "এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হচ্ছে" },
                    { status: 409 }
                );
            }
        }

        // Handle Newsletter Subscription
        if (notifications?.newsletter !== undefined) {
            const userEmail = session.user.email;
            if (userEmail) {
                if (notifications.newsletter) {
                    // Subscribe (Upsert)
                    await prisma.subscriber.upsert({
                        where: { email: userEmail },
                        update: { isActive: true },
                        create: { email: userEmail, isActive: true }
                    });
                } else {
                    // Unsubscribe (Update only if exists)
                    // usage of updateMany prevents error if record doesn't exist
                    await prisma.subscriber.updateMany({
                        where: { email: userEmail },
                        data: { isActive: false }
                    });
                }
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name && { name }),
                ...(bio !== undefined && { bio }),
                ...(image !== undefined && { image }),
                ...(username && { username, lastUsernameChange: new Date() }),
                ...(notifications && {
                    notifyUpdates: notifications.emailNotifications,
                    notifyComments: notifications.newComments,
                    notifySubmission: notifications.submissionStatus
                }),
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                image: true,
            },
        });

        return NextResponse.json({
            message: "প্রোফাইল সফলভাবে আপডেট হয়েছে",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json(
            { message: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
