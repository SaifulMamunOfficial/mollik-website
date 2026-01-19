
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                status: "PUBLISHED"
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true,
                        bio: true
                    }
                },
                category: {
                    select: {
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Normalize data
        const normalizedPosts = posts.map(post => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            publishedAt: post.publishedAt || post.createdAt,
            readTime: "5 মিনিট",
            views: post.views,
            featured: post.featured,
            author: {
                name: post.author.name,
                avatar: post.author.image,
                role: post.author.role,
                bio: post.author.bio
            },
            category: post.category?.name || "সাধারণ",
        }));

        // Sort by publishedAt (Latest first) manually to handle nulls safely
        normalizedPosts.sort((a, b) => {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });

        return NextResponse.json(normalizedPosts);
    } catch (error) {
        console.error("Blog Fetch Error:", error);
        return NextResponse.json(
            { message: "ব্লগ পোস্ট লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
