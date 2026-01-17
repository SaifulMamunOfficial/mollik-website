import { NextResponse } from 'next/server';
import { submitContact } from '@/lib/data';

export async function POST(request: Request) {
    try {
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
