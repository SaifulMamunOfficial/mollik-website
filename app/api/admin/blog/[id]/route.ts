import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { sendNewPostEmail } from '@/lib/email'

// GET single blog post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { id: params.id },
            include: { category: true, author: { select: { name: true, image: true } } },
        })

        if (!post) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error('Error fetching blog post:', error)
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
    }
}

// PATCH update blog post
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, coverImage, tags, status, publishedAt, featured } = body

        if (slug) {
            const existingPost = await prisma.blogPost.findFirst({
                where: {
                    slug,
                    id: { not: params.id }
                },
            })

            if (existingPost) {
                return NextResponse.json(
                    { error: 'এই স্লাগ দিয়ে আরেকটি ব্লগ আছে' },
                    { status: 400 }
                )
            }
        }

        // Check if status is changing to PUBLISHED
        const currentPost = await prisma.blogPost.findUnique({ where: { id: params.id }, select: { status: true } });
        const isPublishing = currentPost?.status !== 'PUBLISHED' && status === 'PUBLISHED';

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                content,
                excerpt,
                coverImage,
                tags,
                status,
                publishedAt: publishedAt ? new Date(publishedAt) : undefined,
                readTime: body.readTime,
                categoryId: categoryId || null,
                featured,
                authorId: (['ADMIN', 'SUPER_ADMIN'].includes(session.user.role) && body.authorId) ? body.authorId : undefined,
            },
        })

        if (isPublishing) {
            sendNewPostEmail(post.title, post.slug, post.excerpt || '').catch(err => console.error("Failed to send email:", err));
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error('Error updating blog post:', error)
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
    }
}

// DELETE blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.blogPost.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Blog post deleted successfully' })
    } catch (error) {
        console.error('Error deleting blog post:', error)
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
    }
}
