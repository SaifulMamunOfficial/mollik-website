import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get a single writing by slug
export async function GET(
    request: Request,
    context: { params: { slug: string } }
) {
    try {
        const { slug } = context.params;
        const decodedSlug = decodeURIComponent(slug);

        const writing = await prisma.writing.findUnique({
            where: { slug: decodedSlug },
            include: {
                category: true,
                book: true,
                _count: {
                    select: { comments: true }
                }
            }
        });

        if (!writing) {
            return NextResponse.json(
                { message: "লেখাটি পাওয়া যায়নি" },
                { status: 404 }
            );
        }

        // Increment view count
        await prisma.writing.update({
            where: { id: writing.id },
            data: { views: { increment: 1 } }
        });

        // Get related writings (same category, exclude current)
        const relatedWritings = await prisma.writing.findMany({
            where: {
                type: writing.type,
                status: "PUBLISHED",
                id: { not: writing.id },
            },
            take: 2,
            orderBy: { views: "desc" },
            select: {
                id: true,
                slug: true,
                title: true,
                content: true,
                category: { select: { name: true } }
            }
        });

        return NextResponse.json({
            writing: {
                id: writing.id,
                slug: writing.slug,
                title: writing.title,
                type: writing.type,
                content: writing.content,
                excerpt: writing.excerpt,
                category: writing.category?.name,
                categorySlug: writing.category?.slug,
                bookSlug: writing.book?.slug,
                bookTitle: writing.book?.title,
                year: writing.year,
                views: writing.views + 1,
                likes: writing.likes,
                readTime: writing.readTime,
                composer: writing.composer,
                commentCount: writing._count.comments,
            },
            relatedWritings: relatedWritings.map(w => ({
                id: w.id,
                slug: w.slug,
                title: w.title,
                excerpt: w.content?.split('\n')[0]?.substring(0, 100),
                category: w.category?.name || "কবিতা",
            }))
        });

    } catch (error) {
        console.error("Writing GET Error:", error);
        return NextResponse.json(
            { message: "লেখা লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
