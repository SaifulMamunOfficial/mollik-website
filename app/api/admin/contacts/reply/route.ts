
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

        const { id, to, subject, message } = await req.json();

        if (!to || !subject || !message) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Configure Nodemailer Transporter
        // Using environment variables for SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Send Email
        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Mollik Website'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to,
            subject,
            text: message, // Plain text version
            html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #4f46e5; margin-bottom: 20px;">${subject}</h2>
                        <div style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #888;">
                            This email was sent from the Matiur Rahman Mollik Memorial Website.
                        </p>
                    </div>
                   </div>`,
        });

        // Update Contact Status to REPLIED
        if (id) {
            await prisma.contactSubmission.update({
                where: { id },
                data: { status: 'REPLIED' },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[CONTACT_REPLY_ERROR]', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to send email', details: error.message }), { status: 500 });
    }
}
