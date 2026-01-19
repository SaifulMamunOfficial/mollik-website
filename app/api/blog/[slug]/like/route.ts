
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
    context: { params: { slug: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুগ্রহ করে লগইন করুন" },
                { status: 401 }
            );
        }

        const { slug } = context.params;
        const userId = session.user.id;

        // Find the blog post
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!post) {
            return NextResponse.json(
                { message: "পোস্টটি পাওয়া যায়নি" },
                { status: 404 }
            );
        }

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_blogPostId: {
                    userId,
                    blogPostId: post.id
                }
            }
        });

        let isLiked = false;

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: {
                    userId_blogPostId: {
                        userId,
                        blogPostId: post.id
                    }
                }
            });
            isLiked = false;
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId,
                    blogPostId: post.id
                }
            });
            isLiked = true;
        }

        // Get updated count
        const likeCount = await prisma.like.count({
            where: { blogPostId: post.id }
        });

        return NextResponse.json({
            message: isLiked ? "পছন্দ করা হয়েছে" : "পছন্দ তুলে নেওয়া হয়েছে",
            isLiked,
            likeCount
        });

    } catch (error) {
        console.error("Like Error:", error);
        return NextResponse.json(
            { message: "সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    context: { params: { slug: string } }
) {
    try {
        const session = await auth();
        const { slug } = context.params;

        const post = await prisma.blogPost.findUnique({
            where: { slug },
            select: {
                id: true,
                _count: {
                    select: { likes: true }
                }
            }
        });

        if (!post) {
            return NextResponse.json({ isLiked: false, likeCount: 0 });
        }

        let isLiked = false;
        if (session?.user?.id) {
            const checkLike = await prisma.like.findUnique({
                where: {
                    userId_blogPostId: {
                        userId: session.user.id,
                        blogPostId: post.id
                    }
                }
            });
            isLiked = !!checkLike;
        }

        return NextResponse.json({
            isLiked,
            likeCount: post._count.likes
        });

    } catch (error) {
        return NextResponse.json({ isLiked: false, likeCount: 0 });
    }
}
