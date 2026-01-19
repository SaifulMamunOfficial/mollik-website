import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুগ্রহ করে লগইন করুন" },
                { status: 401 }
            );
        }

        // Fetch user with related data
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                username: true,
                lastUsernameChange: true,
                email: true,
                image: true,
                bio: true,
                role: true,
                notifyUpdates: true,
                notifyComments: true,
                notifySubmission: true,
                createdAt: true,
                _count: {
                    select: {
                        blogPosts: true,
                        comments: true,
                        tributes: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "ইউজার পাওয়া যায়নি" },
                { status: 404 }
            );
        }

        // Check if user is subscribed to newsletter
        const subscriber = await prisma.subscriber.findUnique({
            where: { email: user.email }
        });

        // Get user's blog posts
        const blogPosts = await prisma.blogPost.findMany({
            where: { authorId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
                id: true,
                slug: true,
                title: true,
                status: true,
                views: true,
                createdAt: true,
                category: {
                    select: { name: true },
                },
            },
        });

        // Get user's tributes
        const tributes = await prisma.tribute.findMany({
            where: { authorId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
                id: true,
                content: true,
                status: true,
                createdAt: true,
            },
        });

        // Get user's comments (recent activity)
        const recentComments = await prisma.comment.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                content: true,
                createdAt: true,
                writing: {
                    select: { title: true, slug: true },
                },
                blogPost: {
                    select: { title: true, slug: true },
                },
            },
        });

        // Get user's liked posts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const likedposts = await (prisma as any).like.findMany({
            where: { userId: session.user.id, blogPostId: { not: null } },
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                blogPost: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        status: true,
                        views: true,
                        createdAt: true,
                        category: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        // Calculate total views on user's posts
        const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);

        // Format the response
        const profileData = {
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                lastUsernameChange: user.lastUsernameChange,
                email: user.email,
                image: user.image,
                bio: user.bio || "কবিতাপ্রেমী ও পাঠক।",
                role: user.role,
                notifications: {
                    emailNotifications: user.notifyUpdates,
                    newComments: user.notifyComments,
                    submissionStatus: user.notifySubmission,
                    newsletter: subscriber?.isActive || false,
                },
                joinedDate: formatBengaliDate(user.createdAt),
                stats: {
                    submissions: user._count.blogPosts,
                    comments: user._count.comments,
                    tributes: user._count.tributes,
                    views: totalViews,
                },
            },
            submissions: [
                ...blogPosts.map((post) => ({
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    type: post.category?.name || "ব্লগ",
                    status: post.status.toLowerCase(),
                    date: formatBengaliDate(post.createdAt),
                    createdAt: post.createdAt.getTime(),
                    views: post.views,
                })),
                ...tributes.map((tribute) => ({
                    id: tribute.id,
                    slug: tribute.id,
                    title: tribute.content.length > 50
                        ? tribute.content.substring(0, 50) + "..."
                        : tribute.content,
                    type: "শোকবার্তা",
                    status: tribute.status.toLowerCase(),
                    date: formatBengaliDate(tribute.createdAt),
                    createdAt: tribute.createdAt.getTime(),
                    views: 0,
                })),
            ].sort((a, b) => b.createdAt - a.createdAt),
            favorites: likedposts.map((like: any) => ({
                id: like.blogPost!.id,
                slug: like.blogPost!.slug,
                title: like.blogPost!.title,
                type: like.blogPost!.category?.name || "ব্লগ",
                status: like.blogPost!.status.toLowerCase(),
                date: formatBengaliDate(like.blogPost!.createdAt),
                views: like.blogPost!.views,
            })),
            recentActivity: recentComments.map((comment) => ({
                id: comment.id,
                action: "মন্তব্য করেছেন",
                target: comment.writing?.title || comment.blogPost?.title || "একটি পোস্টে",
                time: getRelativeTime(comment.createdAt),
            })),
        };

        return NextResponse.json(profileData);
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json(
            { message: "প্রোফাইল লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

// Helper function to format date in Bengali
function formatBengaliDate(date: Date): string {
    const months = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

    const day = date.getDate().toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");

    return `${day} ${month} ${year}`;
}

// Helper function for relative time in Bengali
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    const toBengali = (num: number) => {
        const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        return num.toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");
    };

    if (diffMins < 1) return "এইমাত্র";
    if (diffMins < 60) return `${toBengali(diffMins)} মিনিট আগে`;
    if (diffHours < 24) return `${toBengali(diffHours)} ঘণ্টা আগে`;
    if (diffDays < 7) return `${toBengali(diffDays)} দিন আগে`;
    if (diffDays < 30) return `${toBengali(Math.floor(diffDays / 7))} সপ্তাহ আগে`;
    return formatBengaliDate(date);
}
