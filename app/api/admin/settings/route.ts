import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic'

// GET - Fetch current settings
export async function GET() {
    try {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: "main" }
        });

        // Create default settings if not exists
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    id: "main",
                    siteName: "মতিউর রহমান মল্লিক",
                    siteDescription: "কবি মতিউর রহমান মল্লিকের অফিসিয়াল ওয়েবসাইট",
                    contactEmail: "info@mollik.com",
                    bornDate: "১৯৫০",
                    deathDate: "২০১০",
                    socialLinks: {
                        facebook: "https://facebook.com",
                        twitter: "https://twitter.com",
                        youtube: "https://youtube.com",
                        email: "contact@motiurrahmanmollik.com"
                    },
                    footerExplore: [
                        { name: "ছবিঘর", href: "/gallery" },
                        { name: "অডিও", href: "/audio" },
                        { name: "ভিডিও", href: "/videos" },
                        { name: "শোকবার্তা", href: "/tributes" },
                    ],
                    footerAbout: [
                        { name: "জীবনী", href: "/biography" },
                        { name: "টাইমলাইন", href: "/biography#timeline" },
                        { name: "ব্লগ", href: "/blog" },
                    ],
                    footerConnect: [
                        { name: "লেখা পাঠান", href: "/blog/new" },
                        { name: "যোগাযোগ", href: "/contact" },
                    ]
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json(
            { message: "সেটিংস লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

// PUT - Update settings
export async function PUT(request: Request) {
    try {
        const session = await auth();

        // Check authentication
        if (!session?.user) {
            return NextResponse.json(
                { message: "অনুমতি নেই" },
                { status: 401 }
            );
        }

        // Check if user has admin access
        const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
        if (!allowedRoles.includes(session.user.role || "")) {
            return NextResponse.json(
                { message: "শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারেন" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            siteName,
            siteDescription,
            contactEmail,
            bornDate,
            deathDate,
            socialLinks,
            footerExplore,
            footerAbout,
            footerConnect
        } = body;

        const settings = await prisma.siteSettings.upsert({
            where: { id: "main" },
            update: {
                siteName,
                siteDescription,
                contactEmail,
                bornDate,
                deathDate,
                socialLinks,
                footerExplore,
                footerAbout,
                footerConnect
            },
            create: {
                id: "main",
                siteName,
                siteDescription,
                contactEmail,
                bornDate,
                deathDate,
                socialLinks,
                footerExplore,
                footerAbout,
                footerConnect
            }
        });

        return NextResponse.json({
            message: "সেটিংস সংরক্ষিত হয়েছে",
            settings
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { message: "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
