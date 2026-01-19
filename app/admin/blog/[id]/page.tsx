import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import BlogForm from '@/components/admin/BlogForm'

interface Props {
    params: {
        id: string
    }
}

async function getBlogPost(id: string) {
    const post = await prisma.blogPost.findUnique({
        where: { id },
    })

    if (!post) return null
    return post
}

export default async function AdminEditBlogPage({ params }: Props) {
    const post = await getBlogPost(params.id)

    if (!post) {
        notFound()
    }

    // Transform data for the form
    const initialData = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        coverImage: post.coverImage || '',
        categoryId: post.categoryId || '',
        tags: post.tags,
        status: post.status,
        featured: post.featured,
        authorId: post.authorId,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : undefined,
    }

    return <BlogForm initialData={initialData} />
}
