import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get public user profile by ID or Username
export async function GET(
    request: Request,
    context: { params: { userId: string } }
) {
    try {
        const { userId } = context.params;

        // Common selection object
        const userSelect = {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            createdAt: true,
            role: true,
            _count: {
                select: {
                    comments: true,
                    blogPosts: true,
                }
            }
        };

        // Try to find by ID first
        let user = await prisma.user.findUnique({
            where: { id: userId },
            select: userSelect
        });

        // If not found by ID, try finding by username
        if (!user) {
            user = await prisma.user.findUnique({
                where: { username: userId },
                select: userSelect
            });
        }

        if (!user) {
            return NextResponse.json(
                { message: "ব্যবহারকারী পাওয়া যায়নি" },
                { status: 404 }
            );
        }

        // Get user's published blog posts
        const blogPosts = await prisma.blogPost.findMany({
            where: {
                authorId: user.id, // Use the resolved user ID
                status: "PUBLISHED"
            },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                createdAt: true,
                views: true,
            },
            orderBy: { createdAt: "desc" },
            take: 6
        });

        // Format date in Bengali
        const toBengali = (num: number) => {
            const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
            return num.toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");
        };

        const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
            "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
        const joinDate = user.createdAt;
        const joinDateFormatted = `${toBengali(joinDate.getDate())} ${months[joinDate.getMonth()]} ${toBengali(joinDate.getFullYear())}`;

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                image: user.image,
                bio: user.bio,
                role: user.role,
                joinDate: joinDateFormatted,
                stats: {
                    comments: user._count.comments,
                    posts: user._count.blogPosts,
                }
            },
            posts: blogPosts.map(post => ({
                id: post.id,
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                createdAt: post.createdAt,
                views: post.views
            }))
        });

    } catch (error) {
        console.error("Public Profile Error:", error);
        return NextResponse.json(
            { message: "প্রোফাইল লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
