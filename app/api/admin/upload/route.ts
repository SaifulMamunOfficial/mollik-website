import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { isRateLimited } from "@/lib/rate-limit";

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

        // Limit image uploads to 10 requests per minute per admin
        if (isRateLimited(`upload-${session.user.id}`, 10, 60000)) {
            return NextResponse.json(
                { message: "অতিরিক্ত ফাইল আপলোড করছেন। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।" },
                { status: 429 }
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

        // 1. S3 / SaimumFile Upload if S3 config is provided
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ENDPOINT_URL) {
            const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
            
            const ext = file.name.split('.').pop() || 'png';
            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const key = `uploads/${folder}/${filename}`;

            const s3Client = new S3Client({
                endpoint: process.env.AWS_ENDPOINT_URL,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
                },
                region: "us-east-1",
                forcePathStyle: true,
            });

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET || 'mollik-archive',
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                })
            );

            // Construct public URL
            const publicUrl = `${process.env.AWS_ENDPOINT_URL}/${process.env.AWS_BUCKET || 'mollik-archive'}/${key}`;

            return NextResponse.json({
                message: "ছবি আপনার S3 সার্ভারে আপলোড হয়েছে",
                url: publicUrl,
                publicId: key
            });
        }

        // Local Storage Fallback if Cloudinary config is missing
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            const { writeFile, mkdir } = await import("fs/promises");
            const path = await import("path");
            
            const ext = file.name.split('.').pop() || 'png';
            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            
            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true });
            
            // Save file
            await writeFile(path.join(uploadDir, filename), buffer);
            
            return NextResponse.json({
                message: "ছবি লোকাল সার্ভারে আপলোড হয়েছে",
                url: `/uploads/${filename}`,
                publicId: filename
            });
        }

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
