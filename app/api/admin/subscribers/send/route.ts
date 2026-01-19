
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role)) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { subject, message, recipients } = await req.json();

        if (!subject || !message) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        let emailList: string[] = [];

        if (recipients && Array.isArray(recipients) && recipients.length > 0) {
            // Send to specific list
            emailList = recipients;
        } else {
            // Send to ALL active subscribers
            const subscribers = await prisma.subscriber.findMany({
                where: { isActive: true },
                select: { email: true }
            });

            if (subscribers.length === 0) {
                return new NextResponse(JSON.stringify({ error: 'No active subscribers found' }), { status: 404 });
            }
            emailList = subscribers.map(sub => sub.email);
        }

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Send Emails (Using BCC for privacy if sending single mail, or loop for individual)
        // For simplicity and standard bulk practice in small scale, loop or BCC.
        // BCC is safer for privacy so everyone doesn't see everyone's email.

        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Mollik Website'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            bcc: emailList, // Send to all as BCC
            subject,
            html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #4f46e5; margin-bottom: 20px;">${subject}</h2>
                        <div style="font-size: 14px;">${message.replace(/\n/g, '<br>')}</div>
                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #888;">
                            You are receiving this email because you subscribed to updates from Matiur Rahman Mollik Memorial Website.
                            <br>
                            To unsubscribe, please contact admin.
                        </p>
                    </div>
                   </div>`,
        });

        return NextResponse.json({ success: true, count: emailList.length });
    } catch (error: any) {
        console.error('[NEWSLETTER_SEND_ERROR]', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to send email', details: error.message }), { status: 500 });
    }
}
