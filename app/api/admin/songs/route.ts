import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// GET all songs
export async function GET() {
    try {
        const songs = await prisma.writing.findMany({
            where: { type: 'SONG' },
            include: { category: true, book: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(songs)
    } catch (error) {
        console.error('Error fetching songs:', error)
        return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
    }
}

// POST create new song
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, bookId, year, status, composer } = body

        // Validate required fields
        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: 'Title, slug, and content are required' },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existingSong = await prisma.writing.findUnique({
            where: { slug },
        })

        if (existingSong) {
            return NextResponse.json(
                { error: 'এই স্লাগ দিয়ে আরেকটি গান আছে' },
                { status: 400 }
            )
        }

        const song = await prisma.writing.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                type: 'SONG',
                status: status || 'DRAFT',
                year: year || null,
                categoryId: categoryId || null,
                bookId: bookId || null,
                composer: composer || null, // Specific to songs
                authorId: session.user.id,
            },
        })

        return NextResponse.json(song, { status: 201 })
    } catch (error) {
        console.error('Error creating song:', error)
        return NextResponse.json({ error: 'Failed to create song' }, { status: 500 })
    }
}
