import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// PUT - Update submission option
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user?.role || "")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, icon, order, isActive } = body;

        const option = await prisma.submissionOption.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(icon !== undefined && { icon }),
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        return NextResponse.json(option);
    } catch (error) {
        console.error("Error updating submission option:", error);
        return NextResponse.json({ message: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
    }
}

// DELETE - Delete submission option
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user?.role || "")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.submissionOption.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting submission option:", error);
        return NextResponse.json({ message: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
    }
}
