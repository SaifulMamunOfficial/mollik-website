import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET - Get public user profile by ID
export async function GET(
    request: Request,
    context: { params: { userId: string } }
) {
    try {
        const { userId } = context.params;
        const session = await auth();

        // 1. Fetch User
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
                role: true,
                _count: {
                    select: {
                        comments: true,
                        followedBy: true, // followers
                        following: true, // following
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "ব্যবহারকারী পাওয়া যায়নি" },
                { status: 404 }
            );
        }

        // Check if current user is following this profile
        let isFollowing = false;
        if (session?.user?.id) {
            const checkFollow = await prisma.user.findFirst({
                where: {
                    id: userId,
                    followedBy: {
                        some: {
                            id: session.user.id
                        }
                    }
                }
            });
            isFollowing = !!checkFollow;
        }

        // 2. Fetch All Content Types (Published Only)

        // Blog Posts (Articles & Poems)
        const blogPosts = await prisma.blogPost.findMany({
            where: {
                authorId: userId,
                status: "PUBLISHED"
            },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                createdAt: true,
                views: true,
                category: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        // Tributes (Condolences)
        const tributes = await prisma.tribute.findMany({
            where: {
                authorId: userId,
                status: "PUBLISHED"
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" }
        });

        // Gallery Images (Photos)
        const galleryImages = await prisma.galleryImage.findMany({
            where: {
                submittedBy: userId,
                status: "PUBLISHED"
            },
            select: {
                id: true,
                title: true,
                url: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" }
        });

        // Audios
        const audios = await prisma.audio.findMany({
            where: {
                submittedBy: userId,
                status: "PUBLISHED"
            },
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                views: true,
            },
            orderBy: { createdAt: "desc" }
        });

        // Videos
        const videos = await prisma.video.findMany({
            where: {
                submittedBy: userId,
                status: "PUBLISHED"
            },
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                views: true,
            },
            orderBy: { createdAt: "desc" }
        });

        // 3. Normalize and Merge Data
        const normalizedPosts = [
            ...blogPosts.map(post => {
                const isPoem = post.category?.name === "কবিতা" || post.category?.name?.toLowerCase() === "poem";
                return {
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    createdAt: post.createdAt,
                    views: post.views,
                    type: isPoem ? "কবিতা" : "প্রবন্ধ",
                    image: null
                };
            }),
            ...tributes.map(tribute => ({
                id: tribute.id,
                slug: null,
                title: "শোকবার্তা",
                excerpt: tribute.content,
                createdAt: tribute.createdAt,
                views: 0,
                type: "শোকবার্তা",
                image: null
            })),
            ...galleryImages.map(img => ({
                id: img.id,
                slug: null,
                title: img.title || "ছবি",
                excerpt: "চিত্রশালা থেকে",
                createdAt: img.createdAt,
                views: 0,
                type: "ছবিঘর",
                image: img.url
            })),
            ...audios.map(audio => ({
                id: audio.id,
                slug: audio.slug,
                title: audio.title,
                excerpt: "অডিও গ্যালারি",
                createdAt: audio.createdAt,
                views: audio.views,
                type: "অডিও",
                image: null
            })),
            ...videos.map(video => ({
                id: video.id,
                slug: video.slug,
                title: video.title,
                excerpt: "ভিডিও গ্যালারি",
                createdAt: video.createdAt,
                views: video.views,
                type: "ভিডিও",
                image: null
            }))
        ];

        // Sort by Date Descending
        normalizedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Calculate Stats
        const totalViews = normalizedPosts.reduce((sum, post) => sum + (post.views || 0), 0);

        // Format User Join Date (Bengali)
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
                image: user.image,
                bio: user.bio,
                role: user.role,
                joinDate: joinDateFormatted,
                isFollowing, // New Field
                stats: {
                    comments: user._count.comments,
                    publications: normalizedPosts.length,
                    totalViews: totalViews,
                    followers: user._count.followedBy, // New Field
                    following: user._count.following   // New Field
                }
            },
            posts: normalizedPosts
        });

    } catch (error) {
        console.error("Public Profile Error:", error);
        return NextResponse.json(
            { message: "প্রোফাইল লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
