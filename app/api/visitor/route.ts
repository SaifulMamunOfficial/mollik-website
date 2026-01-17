import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Simple in-memory counter (resets on cold start)
// For production, should use database or external service
let visitorCount = 15234;

// GET - Get visitor count
export async function GET() {
    return NextResponse.json({
        count: visitorCount,
        lastUpdated: new Date().toISOString()
    });
}

// POST - Increment visitor count
export async function POST() {
    visitorCount += 1;
    return NextResponse.json({
        count: visitorCount,
        lastUpdated: new Date().toISOString()
    });
}
