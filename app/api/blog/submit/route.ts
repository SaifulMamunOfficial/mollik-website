import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// POST - Create a new blog post submission
export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুগ্রহ করে লগইন করুন" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            title,
            content,
            submissionType,
            categoryName,
            coverImage,
            authorName,
            isOwnWriting = true
        } = body;

        // Validation
        if (!title || !content) {
            return NextResponse.json(
                { message: "শিরোনাম এবং বিষয়বস্তু প্রয়োজন" },
                { status: 400 }
            );
        }

        if (title.length < 5) {
            return NextResponse.json(
                { message: "শিরোনাম কমপক্ষে ৫ অক্ষরের হতে হবে" },
                { status: 400 }
            );
        }

        if (content.length < 50) {
            return NextResponse.json(
                { message: "বিষয়বস্তু কমপক্ষে ৫০ অক্ষরের হতে হবে" },
                { status: 400 }
            );
        }

        // Generate slug from title
        const baseSlug = generateSlug(title);

        // Check for existing slug and make unique if needed
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.blogPost.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Find or create category if provided
        let categoryId: string | null = null;
        if (categoryName) {
            const categorySlug = generateSlug(categoryName);
            let category = await prisma.category.findFirst({
                where: {
                    OR: [
                        { name: categoryName },
                        { slug: categorySlug }
                    ]
                }
            });

            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: categoryName,
                        slug: categorySlug,
                        type: "BLOG",
                    }
                });
            }
            categoryId = category.id;
        }

        // Create blog post
        const blogPost = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
                coverImage: coverImage || null,
                authorId: session.user.id,
                categoryId,
                status: "PENDING", // Always pending for user submissions
                views: 0,
            },
            include: {
                author: {
                    select: { name: true, email: true }
                },
                category: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json({
            message: "আপনার লেখা সফলভাবে জমা হয়েছে! অ্যাডমিন রিভিউয়ের পর প্রকাশিত হবে।",
            post: {
                id: blogPost.id,
                slug: blogPost.slug,
                title: blogPost.title,
                status: blogPost.status,
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Blog Submission Error:", error);
        return NextResponse.json(
            { message: "লেখা জমা দিতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

// Helper function to generate slug from Bengali/English text
function generateSlug(text: string): string {
    // Transliterate common Bengali characters
    const bengaliMap: Record<string, string> = {
        'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u',
        'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
        'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
        'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
        'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
        'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
        'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
        'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh',
        'স': 's', 'হ': 'h', 'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y',
        'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u',
        'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
        '্': '', 'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n',
    };

    let slug = text;

    // Replace Bengali characters
    for (const [bengali, roman] of Object.entries(bengaliMap)) {
        slug = slug.replace(new RegExp(bengali, 'g'), roman);
    }

    // Convert to lowercase, replace spaces and special chars
    slug = slug
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 100);

    // If slug is empty after processing, use timestamp
    if (!slug || slug === '-') {
        slug = `post-${Date.now()}`;
    }

    return slug;
}

// GET - Get user's blog posts
export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুগ্রহ করে লগইন করুন" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: any = { authorId: session.user.id };
        if (status) {
            where.status = status.toUpperCase();
        }

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    excerpt: true,
                    status: true,
                    views: true,
                    coverImage: true,
                    createdAt: true,
                    category: {
                        select: { name: true }
                    }
                }
            }),
            prisma.blogPost.count({ where })
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Get Blog Posts Error:", error);
        return NextResponse.json(
            { message: "ব্লগ পোস্ট লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
