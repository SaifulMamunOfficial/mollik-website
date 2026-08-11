import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'visitor.json');

// Memory cache for dev/prod fallback
let memoryCount = 15308;
let lastWriteTime = 0;

// Initialize Dev File Cache
if (process.env.NODE_ENV === 'development') {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            const parsed = JSON.parse(data);
            if (parsed && typeof parsed.count === 'number') {
                memoryCount = parsed.count;
            }
        } else {
            fs.writeFileSync(DATA_FILE, JSON.stringify({ count: memoryCount }), 'utf8');
        }
    } catch (err) {
        console.error("Failed to initialize visitor file cache:", err);
    }
}

// Throttled Async Write for Dev
function throttleWriteDev(count: number) {
    const now = Date.now();
    if (now - lastWriteTime > 2000) { // 2 seconds throttle
        lastWriteTime = now;
        // Asynchronous write to prevent EBUSY locks
        fs.writeFile(DATA_FILE, JSON.stringify({ count }), 'utf8', (err) => {
            if (err) console.error("Error writing visitor file cache:", err);
        });
    }
}

export async function GET() {
    try {
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json({ count: memoryCount });
        }

        // Production - Get from Supabase
        const pageView = await prisma.pageView.findUnique({
            where: { id: 'main' }
        });
        
        if (!pageView) {
            // Return baseline if not seeded yet
            return NextResponse.json({ count: 15308 });
        }

        return NextResponse.json({ count: pageView.count });
    } catch (err) {
        console.error("Visitor API GET Error:", err);
        // Production DB Error: Return error response instead of mock claim
        return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        if (process.env.NODE_ENV === 'development') {
            memoryCount += 1;
            throttleWriteDev(memoryCount);
            return NextResponse.json({ count: memoryCount });
        }

        // Production - Atomic Increment on Supabase PostgreSQL
        // 1. Ensure baseline exists
        const exists = await prisma.pageView.findUnique({
            where: { id: 'main' }
        });

        if (!exists) {
            await prisma.pageView.create({
                data: { id: 'main', count: 15308 }
            });
        }

        // 2. Atomic Increment update
        const updated = await prisma.pageView.update({
            where: { id: 'main' },
            data: {
                count: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ count: updated.count });
    } catch (err) {
        console.error("Visitor API POST Error:", err);
        return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
        );
    }
}
