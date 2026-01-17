import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const TARGET_SIZE_KB = 200; // Target file size in KB
const MAX_DIMENSION = 800; // Max width/height for avatar

async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    let sharpInstance = sharp(buffer);

    // Get image metadata
    const metadata = await sharpInstance.metadata();

    // Resize if too large (keeping aspect ratio)
    if (metadata.width && metadata.height) {
        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            sharpInstance = sharpInstance.resize(MAX_DIMENSION, MAX_DIMENSION, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }
    }

    // Convert to JPEG/WebP for better compression
    let quality = 90;
    let outputBuffer: Buffer;

    // Try different quality levels to get under target size
    do {
        if (mimeType === 'image/png' || mimeType === 'image/webp') {
            outputBuffer = await sharpInstance
                .webp({ quality })
                .toBuffer();
        } else {
            outputBuffer = await sharpInstance
                .jpeg({ quality, mozjpeg: true })
                .toBuffer();
        }

        // Reduce quality if still too large
        if (outputBuffer.length > TARGET_SIZE_KB * 1024 && quality > 20) {
            quality -= 10;
            sharpInstance = sharp(buffer); // Reset to original
            if (metadata.width && metadata.height) {
                if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
                    sharpInstance = sharpInstance.resize(MAX_DIMENSION, MAX_DIMENSION, {
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                }
            }
        } else {
            break;
        }
    } while (quality > 20);

    console.log(`Image compressed: ${buffer.length} bytes -> ${outputBuffer.length} bytes (quality: ${quality})`);

    return outputBuffer;
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "অনুমতি নেই" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

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

        // Validate file size (max 10MB before compression)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { message: "ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না" },
                { status: 400 }
            );
        }

        // Create uploads directory if not exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
        await mkdir(uploadDir, { recursive: true });

        // Read file and compress
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Compress the image
        const compressedBuffer = await compressImage(buffer, file.type);

        // Determine output extension based on compression
        const isWebp = file.type === 'image/png' || file.type === 'image/webp';
        const ext = isWebp ? 'webp' : 'jpg';

        // Generate unique filename
        const filename = `${session.user.id}-${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, filename);

        // Write compressed file
        await writeFile(filePath, compressedBuffer);

        // Return the URL
        const url = `/uploads/avatars/${filename}`;

        // Calculate compression ratio
        const originalSizeKB = Math.round(buffer.length / 1024);
        const compressedSizeKB = Math.round(compressedBuffer.length / 1024);

        return NextResponse.json({
            message: `ছবি আপলোড হয়েছে (${originalSizeKB}KB → ${compressedSizeKB}KB)`,
            url,
            originalSize: originalSizeKB,
            compressedSize: compressedSizeKB
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { message: "ছবি আপলোড করতে সমস্যা হয়েছে" },
            { status: 500 }
        );
    }
}
