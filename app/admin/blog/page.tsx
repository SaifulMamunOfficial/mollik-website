import prisma from '@/lib/prisma'
import BlogClient from './BlogClient'

async function getBlogPosts() {
    return prisma.blogPost.findMany({
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function BlogPage() {
    const posts = await getBlogPosts()

    return <BlogClient posts={posts as any} />
}
