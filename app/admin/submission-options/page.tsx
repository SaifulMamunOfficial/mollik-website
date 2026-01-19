import { prisma } from "@/lib/prisma";
import SubmissionOptionsClient from "@/components/admin/SubmissionOptionsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Submission Options | Admin Dashboard",
    description: "Manage dropdown options for various categories",
};

export const dynamic = "force-dynamic";

export default async function SubmissionOptionsPage() {
    const options = await prisma.submissionOption.findMany({
        orderBy: [
            { type: "asc" },
            { order: "asc" },
            { name: "asc" },
        ],
    });

    const formattedOptions = options.map((opt) => ({
        id: opt.id,
        type: opt.type,
        name: opt.name,
        icon: opt.icon,
        order: opt.order,
        isActive: opt.isActive,
    }));

    return <SubmissionOptionsClient initialOptions={formattedOptions} />;
}
