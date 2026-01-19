
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BlogPostContent from "./BlogPostContent";

// Helper to format date
const formatDate = (dateString: Date) => {
    return dateString.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function BlogDetailPage({ params }: PageProps) {
    const decodedSlug = decodeURIComponent(params.slug);

    // Fetch the post
    const post = await prisma.blogPost.findUnique({
        where: {
            slug: decodedSlug,
            status: 'PUBLISHED'
        },
        include: {
            author: true,
            category: true
        }
    });

    if (!post) {
        notFound();
    }

    // Increment view count (non-blocking)
    prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } }
    }).catch(() => { /* ignore errors */ });

    // Fetch related posts (same category, different id)
    const relatedPostsData = await prisma.blogPost.findMany({
        where: {
            status: 'PUBLISHED',
            categoryId: post.categoryId,
            id: { not: post.id }
        },
        include: {
            author: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 2
    });

    // Normalize data for the client component
    const normalizedPost = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || "",
        publishedAt: formatDate(post.publishedAt || post.createdAt),
        category: post.category?.name || "সাধারণ",
        tags: post.tags || [],
        author: {
            id: post.author.id,
            name: post.author.name || "অজানা লেখক",
            avatar: post.author.image || "",
            role: post.author.role,
            bio: post.author.bio || ""
        }
    };

    const normalizedRelatedPosts = relatedPostsData.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage || "",
        publishedAt: formatDate(p.publishedAt || p.createdAt),
        category: "সম্পর্কিত", // Not currently used in related card
        tags: [],
        author: {
            id: p.author.id,
            name: p.author.name || "অজানা",
            avatar: p.author.image || "",
            role: p.author.role,
            bio: ""
        }
    }));

    return <BlogPostContent post={normalizedPost} relatedPosts={normalizedRelatedPosts} />;
}
