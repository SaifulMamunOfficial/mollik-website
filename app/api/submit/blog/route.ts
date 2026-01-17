import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'লগইন করুন' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { title, content, excerpt, coverImage, categoryId, tags, type } = body

        if (!title || !content) {
            return NextResponse.json(
                { message: 'শিরোনাম এবং বিষয়বস্তু প্রয়োজন' },
                { status: 400 }
            )
        }

        // Generate slug
        const slug = title
            .toLowerCase()
            .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() + '-' + Date.now()

        const blogPost = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || content.substring(0, 200),
                coverImage,
                categoryId: categoryId || null,
                tags: tags || [],
                status: 'PENDING', // User submissions are pending
                authorId: session.user.id,
            },
        })

        return NextResponse.json(
            {
                post: blogPost,
                message: 'আপনার পোস্ট সাবমিট হয়েছে। অনুমোদনের পর প্রকাশিত হবে।'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Blog submission error:', error)
        return NextResponse.json(
            { message: 'সাবমিট করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
