import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET - Fetch active submission options (Public API for blog/new page)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        // If no type specified, fetch all active options grouped
        if (!type) {
            const options = await prisma.submissionOption.findMany({
                where: { isActive: true },
                orderBy: [{ type: "asc" }, { order: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    type: true,
                    name: true,
                    icon: true,
                    order: true,
                },
            });

            // Group by type
            const grouped = options.reduce((acc, option) => {
                if (!acc[option.type]) {
                    acc[option.type] = [];
                }
                acc[option.type].push(option);
                return acc;
            }, {} as Record<string, typeof options>);

            return NextResponse.json(grouped);
        }

        // Fetch options by specific type
        const options = await prisma.submissionOption.findMany({
            where: {
                type: type as any,
                isActive: true,
            },
            orderBy: [{ order: "asc" }, { name: "asc" }],
            select: {
                id: true,
                name: true,
                icon: true,
            },
        });

        return NextResponse.json(options);
    } catch (error) {
        console.error("Error fetching submission options:", error);
        return NextResponse.json({ message: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
    }
}
