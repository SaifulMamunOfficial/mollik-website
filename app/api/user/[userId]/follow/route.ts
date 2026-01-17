
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(
    request: Request,
    context: { params: { userId: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুগ্রহ করে লগইন করুন" },
                { status: 401 }
            );
        }

        const targetUserId = context.params.userId;
        const currentUserId = session.user.id;

        if (targetUserId === currentUserId) {
            return NextResponse.json(
                { message: "আপনি নিজেকে অনুসরণ করতে পারবেন না" },
                { status: 400 }
            );
        }

        // Check if already following
        const existingFollow = await prisma.user.findFirst({
            where: {
                id: targetUserId,
                followedBy: {
                    some: {
                        id: currentUserId
                    }
                }
            }
        });

        if (existingFollow) {
            // Unfollow
            await prisma.user.update({
                where: { id: targetUserId },
                data: {
                    followedBy: {
                        disconnect: {
                            id: currentUserId
                        }
                    }
                }
            });
            return NextResponse.json({ message: "আনফলো করা হয়েছে", isFollowing: false });
        } else {
            // Follow
            await prisma.user.update({
                where: { id: targetUserId },
                data: {
                    followedBy: {
                        connect: {
                            id: currentUserId
                        }
                    }
                }
            });

            // TODO: Add notification here if implemented

            return NextResponse.json({ message: "অনুসরণ করা হচ্ছে", isFollowing: true });
        }

    } catch (error) {
        console.error("Follow/Unfollow Error:", error);
        return NextResponse.json(
            { message: "সার্ভার এরর" },
            { status: 500 }
        );
    }
}
