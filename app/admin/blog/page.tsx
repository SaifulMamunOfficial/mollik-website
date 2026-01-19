import prisma from '@/lib/prisma'
import BlogClient from './BlogClient'

async function getBlogPosts() {
    return prisma.blogPost.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            status: true,
            featured: true,
            views: true,
            createdAt: true,
            author: {
                select: { name: true, email: true }
            },
            category: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function BlogPage() {
    const posts = await getBlogPosts()

    return <BlogClient posts={posts as any} />
}
