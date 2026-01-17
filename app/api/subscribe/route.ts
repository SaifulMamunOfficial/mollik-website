import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { message: "অনুগ্রহ করে একটি সঠিক ইমেইল প্রদান করুন" },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existingSubscriber = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            if (!existingSubscriber.isActive) {
                // Reactivate if previously unsubscribed
                await prisma.subscriber.update({
                    where: { email },
                    data: { isActive: true },
                });
                return NextResponse.json({ message: "স্বাগতম! আপনি আবার সাবস্ক্রাইব করেছেন।" });
            }
            return NextResponse.json(
                { message: "আপনি ইতিমধ্যে সাবস্ক্রাইব করেছেন!" },
                { status: 409 }
            );
        }

        // Create new subscriber
        await prisma.subscriber.create({
            data: { email },
        });

        return NextResponse.json({ message: "সাবস্ক্রিপশন সফল হয়েছে! ধন্যবাদ।" });
    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json(
            { message: "সাবস্ক্রিপশন করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" },
            { status: 500 }
        );
    }
}
