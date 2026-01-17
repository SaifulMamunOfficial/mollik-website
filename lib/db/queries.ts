import prisma from '@/lib/prisma'
import { WritingType, Status } from '@prisma/client'

// ==================== POEMS ====================
export async function getPoems(options?: {
    category?: string
    limit?: number
    page?: number
    featured?: boolean
}) {
    return prisma.writing.findMany({
        where: {
            type: WritingType.POEM,
            status: Status.PUBLISHED,
            ...(options?.category && { category: { slug: options.category } }),
            ...(options?.featured !== undefined && { featured: options.featured }),
        },
        include: { category: true, book: true },
        take: options?.limit,
        skip: options?.page ? (options.page - 1) * (options.limit || 10) : 0,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getPoemBySlug(slug: string) {
    return prisma.writing.findFirst({
        where: {
            slug,
            type: WritingType.POEM,
            status: Status.PUBLISHED
        },
        include: {
            category: true,
            book: true,
            comments: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        },
    })
}

export async function getPoemsCount() {
    return prisma.writing.count({
        where: { type: WritingType.POEM, status: Status.PUBLISHED }
    })
}

// ==================== SONGS ====================
export async function getSongs(options?: {
    category?: string
    limit?: number
    page?: number
}) {
    return prisma.writing.findMany({
        where: {
            type: WritingType.SONG,
            status: Status.PUBLISHED,
            ...(options?.category && { category: { slug: options.category } }),
        },
        include: { category: true, book: true },
        take: options?.limit,
        skip: options?.page ? (options.page - 1) * (options.limit || 10) : 0,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getSongBySlug(slug: string) {
    return prisma.writing.findFirst({
        where: {
            slug,
            type: WritingType.SONG,
            status: Status.PUBLISHED
        },
        include: { category: true, book: true },
    })
}

// ==================== ESSAYS ====================
export async function getEssays(options?: {
    category?: string
    limit?: number
    page?: number
}) {
    return prisma.writing.findMany({
        where: {
            type: WritingType.ESSAY,
            status: Status.PUBLISHED,
            ...(options?.category && { category: { slug: options.category } }),
        },
        include: { category: true, book: true },
        take: options?.limit,
        skip: options?.page ? (options.page - 1) * (options.limit || 10) : 0,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getEssayBySlug(slug: string) {
    return prisma.writing.findFirst({
        where: {
            slug,
            type: WritingType.ESSAY,
            status: Status.PUBLISHED
        },
        include: { category: true, book: true },
    })
}

// ==================== BOOKS ====================
export async function getBooks(options?: {
    categoryId?: string
    limit?: number
}) {
    return prisma.book.findMany({
        where: options?.categoryId ? { categoryId: options.categoryId } : {},
        include: {
            writings: {
                where: { status: Status.PUBLISHED },
                orderBy: { createdAt: 'asc' }
            }
        },
        take: options?.limit,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getBookBySlug(slug: string) {
    return prisma.book.findUnique({
        where: { slug },
        include: {
            writings: {
                where: { status: Status.PUBLISHED },
                orderBy: { createdAt: 'asc' }
            }
        },
    })
}

// ==================== BLOG ====================
export async function getBlogPosts(options?: {
    status?: Status
    featured?: boolean
    authorId?: string
    limit?: number
    page?: number
}) {
    return prisma.blogPost.findMany({
        where: {
            ...(options?.status && { status: options.status }),
            ...(options?.featured !== undefined && { featured: options.featured }),
            ...(options?.authorId && { authorId: options.authorId }),
        },
        include: {
            author: true,
            category: true,
            _count: { select: { comments: true } }
        },
        take: options?.limit,
        skip: options?.page ? (options.page - 1) * (options.limit || 10) : 0,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getBlogPostBySlug(slug: string) {
    return prisma.blogPost.findUnique({
        where: { slug },
        include: {
            author: true,
            category: true,
            comments: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        },
    })
}

// ==================== CATEGORIES ====================
export async function getCategories(type?: 'POEM' | 'SONG' | 'ESSAY' | 'BLOG') {
    return prisma.category.findMany({
        where: type ? { type } : {},
        orderBy: { name: 'asc' },
    })
}

// ==================== GALLERY ====================
export async function getGalleryImages(options?: {
    featured?: boolean
    limit?: number
}) {
    return prisma.galleryImage.findMany({
        where: options?.featured !== undefined ? { featured: options.featured } : {},
        take: options?.limit,
        orderBy: { createdAt: 'desc' },
    })
}

// ==================== AUDIO ====================
export async function getAudioTracks(options?: {
    album?: string
    limit?: number
}) {
    return prisma.audio.findMany({
        where: options?.album ? { albumSlug: options.album } : {},
        take: options?.limit,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getAudioBySlug(slug: string) {
    return prisma.audio.findUnique({
        where: { slug },
    })
}

// ==================== VIDEOS ====================
export async function getVideos(options?: {
    category?: string
    featured?: boolean
    limit?: number
}) {
    return prisma.video.findMany({
        where: {
            ...(options?.category && { category: options.category }),
            ...(options?.featured !== undefined && { featured: options.featured }),
        },
        take: options?.limit,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getVideoBySlug(slug: string) {
    return prisma.video.findUnique({
        where: { slug },
    })
}

// ==================== VIEW COUNTER ====================
export async function incrementWritingViews(id: string) {
    return prisma.writing.update({
        where: { id },
        data: { views: { increment: 1 } },
    })
}

export async function incrementBlogViews(id: string) {
    return prisma.blogPost.update({
        where: { id },
        data: { views: { increment: 1 } },
    })
}

// ==================== SEARCH ====================
export async function searchWritings(query: string, type?: WritingType) {
    return prisma.writing.findMany({
        where: {
            status: Status.PUBLISHED,
            ...(type && { type }),
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
            ],
        },
        include: { category: true, book: true },
        take: 20,
        orderBy: { views: 'desc' },
    })
}

// ==================== STATS (for Admin) ====================
export async function getDashboardStats() {
    const [
        poemsCount,
        songsCount,
        essaysCount,
        booksCount,
        blogPostsCount,
        pendingBlogPosts,
        usersCount,
    ] = await Promise.all([
        prisma.writing.count({ where: { type: WritingType.POEM, status: Status.PUBLISHED } }),
        prisma.writing.count({ where: { type: WritingType.SONG, status: Status.PUBLISHED } }),
        prisma.writing.count({ where: { type: WritingType.ESSAY, status: Status.PUBLISHED } }),
        prisma.book.count(),
        prisma.blogPost.count({ where: { status: Status.PUBLISHED } }),
        prisma.blogPost.count({ where: { status: Status.PENDING } }),
        prisma.user.count(),
    ])

    return {
        poemsCount,
        songsCount,
        essaysCount,
        booksCount,
        blogPostsCount,
        pendingBlogPosts,
        usersCount,
    }
}
