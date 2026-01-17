"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSubscriberStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.subscriber.update({
            where: { id },
            data: { isActive: !currentStatus },
        });
        revalidatePath("/admin/subscribers");
    } catch (error) {
        console.error("Error toggling subscriber status:", error);
    }
}

export async function deleteSubscriber(id: string) {
    try {
        await prisma.subscriber.delete({
            where: { id },
        });
        revalidatePath("/admin/subscribers");
    } catch (error) {
        console.error("Error deleting subscriber:", error);
    }
}
