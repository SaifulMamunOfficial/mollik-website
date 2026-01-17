import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET - Fetch all submission options (with optional type filter)
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user?.role || "")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        const options = await prisma.submissionOption.findMany({
            where: type ? { type: type as any } : undefined,
            orderBy: [{ type: "asc" }, { order: "asc" }, { name: "asc" }],
        });

        return NextResponse.json(options);
    } catch (error) {
        console.error("Error fetching submission options:", error);
        return NextResponse.json({ message: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
    }
}

// POST - Create new submission option
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user?.role || "")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { type, name, icon, order, isActive } = body;

        if (!type || !name) {
            return NextResponse.json({ message: "Type and name are required" }, { status: 400 });
        }

        const option = await prisma.submissionOption.create({
            data: {
                type,
                name,
                icon: icon || null,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return NextResponse.json(option, { status: 201 });
    } catch (error) {
        console.error("Error creating submission option:", error);
        return NextResponse.json({ message: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
    }
}
