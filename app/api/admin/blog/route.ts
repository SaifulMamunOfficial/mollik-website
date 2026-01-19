import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { sendNewPostEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// GET all blog posts (Admin view)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        const posts = await prisma.blogPost.findMany({
            where: status ? { status: status as any } : undefined,
            include: { category: true, author: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
    }
}

// POST create new blog post
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, coverImage, tags, status, publishedAt } = body

        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: 'Title, slug, and content are required' },
                { status: 400 }
            )
        }

        const existingPost = await prisma.blogPost.findUnique({
            where: { slug },
        })

        if (existingPost) {
            return NextResponse.json(
                { error: 'এই স্লাগ দিয়ে আরেকটি ব্লগ আছে' },
                { status: 400 }
            )
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || '',
                coverImage,
                tags: tags || [],
                status: status || 'PENDING',
                publishedAt: publishedAt ? new Date(publishedAt) : (status === 'PUBLISHED' ? new Date() : null),
                readTime: body.readTime || null,
                categoryId,
                authorId: (['ADMIN', 'SUPER_ADMIN'].includes(session.user.role) && body.authorId) ? body.authorId : session.user.id,
            },
        })

        // Send email notification if published immediately
        if (post.status === 'PUBLISHED') {
            // Run in background (don't await)
            sendNewPostEmail(post.title, post.slug, post.excerpt || '').catch(err => console.error("Failed to send email:", err));
        }

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Error creating blog post:', error)
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
    }
}
