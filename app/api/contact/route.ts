import { NextResponse } from 'next/server';
import { submitContact } from '@/lib/data';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        // Limit contact form submissions to 3 requests per minute per IP
        if (isRateLimited(`contact-${ip}`, 3, 60000)) {
            return NextResponse.json(
                { error: 'অতিরিক্ত রিকোয়েস্ট পাঠিয়েছেন। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Required fields missing' },
                { status: 400 }
            );
        }

        await submitContact({
            name,
            email,
            subject: subject || 'General',
            message,
        });

        return NextResponse.json({ success: true, message: 'Message received' });

    } catch (error) {
        console.error("Error processing contact form:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
