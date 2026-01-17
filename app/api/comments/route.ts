import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// POST - Create a new comment
export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "মন্তব্য করতে লগইন করুন" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { content, writingId, blogPostId } = body;

        // Validation
        if (!content || content.trim().length < 3) {
            return NextResponse.json(
                { message: "মন্তব্য কমপক্ষে ৩ অক্ষরের হতে হবে" },
                { status: 400 }
            );
        }

        // Block URLs/Links in comments
        if (containsUrl(content)) {
            return NextResponse.json(
                { message: "মন্তব্যে কোনো লিংক বা URL দেওয়া যাবে না" },
                { status: 400 }
            );
        }

        if (!writingId && !blogPostId) {
            return NextResponse.json(
                { message: "কোথায় মন্তব্য করতে চান তা নির্দিষ্ট করুন" },
                { status: 400 }
            );
        }

        // Check if writing/blog post exists
        if (writingId) {
            const writing = await prisma.writing.findUnique({
                where: { id: writingId }
            });
            if (!writing) {
                return NextResponse.json(
                    { message: "লেখাটি পাওয়া যায়নি" },
                    { status: 404 }
                );
            }
        }

        if (blogPostId) {
            const blogPost = await prisma.blogPost.findUnique({
                where: { id: blogPostId }
            });
            if (!blogPost) {
                return NextResponse.json(
                    { message: "ব্লগ পোস্টটি পাওয়া যায়নি" },
                    { status: 404 }
                );
            }
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId: session.user.id,
                writingId: writingId || null,
                blogPostId: blogPostId || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
        });

        return NextResponse.json({
            message: "মন্তব্য সফলভাবে পোস্ট হয়েছে",
            comment: {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: comment.user,
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Comment Create Error:", error);
        return NextResponse.json(
            { message: "মন্তব্য করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

// GET - Get comments for a writing or blog post
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const writingId = searchParams.get("writingId");
        const blogPostId = searchParams.get("blogPostId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        if (!writingId && !blogPostId) {
            return NextResponse.json(
                { message: "writingId বা blogPostId প্রয়োজন" },
                { status: 400 }
            );
        }

        const where: any = {};
        if (writingId) where.writingId = writingId;
        if (blogPostId) where.blogPostId = blogPostId;

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    }
                }
            }),
            prisma.comment.count({ where })
        ]);

        // Format dates in Bengali
        const formattedComments = comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            timeAgo: getRelativeTime(comment.createdAt),
            user: comment.user,
        }));

        return NextResponse.json({
            comments: formattedComments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Get Comments Error:", error);
        return NextResponse.json(
            { message: "মন্তব্য লোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

// DELETE - Delete own comment
export async function DELETE(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "লগইন করুন" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get("id");

        if (!commentId) {
            return NextResponse.json(
                { message: "মন্তব্য ID প্রয়োজন" },
                { status: 400 }
            );
        }

        // Find comment
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return NextResponse.json(
                { message: "মন্তব্য পাওয়া যায়নি" },
                { status: 404 }
            );
        }

        // Check ownership (only owner can delete, unless admin)
        if (comment.userId !== session.user.id) {
            return NextResponse.json(
                { message: "আপনি শুধু নিজের মন্তব্য মুছতে পারবেন" },
                { status: 403 }
            );
        }

        // Delete comment
        await prisma.comment.delete({
            where: { id: commentId }
        });

        return NextResponse.json({
            message: "মন্তব্য মুছে ফেলা হয়েছে"
        });

    } catch (error) {
        console.error("Delete Comment Error:", error);
        return NextResponse.json(
            { message: "মন্তব্য মুছতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}

// Helper function for relative time in Bengali
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    const toBengali = (num: number) => {
        const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        return num.toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");
    };

    if (diffMins < 1) return "এইমাত্র";
    if (diffMins < 60) return `${toBengali(diffMins)} মিনিট আগে`;
    if (diffHours < 24) return `${toBengali(diffHours)} ঘণ্টা আগে`;
    if (diffDays < 7) return `${toBengali(diffDays)} দিন আগে`;
    if (diffDays < 30) return `${toBengali(Math.floor(diffDays / 7))} সপ্তাহ আগে`;

    // Format date
    const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    const day = toBengali(date.getDate());
    const month = months[date.getMonth()];
    const year = toBengali(date.getFullYear());
    return `${day} ${month} ${year}`;
}

// Helper function to detect URLs/Links in text
function containsUrl(text: string): boolean {
    // Pattern matches various URL formats
    const urlPatterns = [
        // Standard URLs with protocol
        /https?:\/\/[^\s]+/gi,
        // URLs starting with www.
        /www\.[^\s]+/gi,
        // Domain patterns like example.com, site.org, etc.
        /[a-zA-Z0-9][-a-zA-Z0-9]*\.(com|org|net|io|co|dev|me|info|biz|xyz|app|site|online|store|blog|page|link|click|tk|ml|ga|cf|gq|top|live|pro|tech|website|space|fun|today|world|life|cloud|digital|solutions|studio|design|media|agency|works|center|zone|network|systems|services|group|plus|direct|news|tv|fm|am|edu|gov|mil|int|asia|africa|eu|us|uk|ca|au|in|cn|jp|de|fr|br|ru|id|my|sg|ph|vn|th|kr|tw|hk|bd|pk|lk|np|mm|kh|la|vn)\b/gi,
        // IP addresses
        /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
        // Telegram, WhatsApp, etc. links
        /t\.me\/[^\s]+/gi,
        /wa\.me\/[^\s]+/gi,
        /bit\.ly\/[^\s]+/gi,
        /tinyurl\.com\/[^\s]+/gi,
        /goo\.gl\/[^\s]+/gi,
        // Email addresses (also blocked as they can be used for spam)
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    ];

    for (const pattern of urlPatterns) {
        if (pattern.test(text)) {
            return true;
        }
    }

    return false;
}
