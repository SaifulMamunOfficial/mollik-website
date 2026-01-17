import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুমতি নেই" },
                { status: 401 }
            );
        }

        // Check for admin role
        if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json(
                { message: "শুধুমাত্র অ্যাডমিনরা আপলোড করতে পারেন" },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folder = formData.get("folder") as string || "general";

        if (!file) {
            return NextResponse.json(
                { message: "কোনো ফাইল পাওয়া যায়নি" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: "শুধুমাত্র JPG, PNG, GIF, বা WebP ফাইল আপলোড করতে পারবেন" },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { message: "ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না" },
                { status: 400 }
            );
        }

        // Read file buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await uploadToCloudinary(buffer, `mollik/${folder}`);

        return NextResponse.json({
            message: "ছবি আপলোড হয়েছে",
            url: result.url,
            publicId: result.publicId
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { message: "ছবি আপলোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
