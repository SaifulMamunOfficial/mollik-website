import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendNewPostEmail(title: string, slug: string, excerpt: string = "") {
    try {
        // Fetch active subscribers
        const subscribers = await prisma.subscriber.findMany({
            where: { isActive: true },
            select: { email: true },
        });

        if (subscribers.length === 0) {
            console.log("No active subscribers to send email to.");
            return;
        }

        const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const postUrl = `${siteUrl}/blog/${slug}`;

        // Send emails in loop (or use BCC if list is small, but loop is safer for delivery in simple setup)
        // For larger lists, a queue system is recommended.
        const emailPromises = subscribers.map((sub) => {
            return transporter.sendMail({
                from: process.env.SMTP_FROM || `"Mollik Admin" <${process.env.SMTP_USER}>`,
                to: sub.email,
                subject: `নতুন পোস্ট: ${title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2 style="color: #059669;">নতুন ব্লগ প্রকাশিত হয়েছে</h2>
                        <h1>${title}</h1>
                        <p>${excerpt}</p>
                        <br/>
                        <a href="${postUrl}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">পড়ুন</a>
                        <br/><br/>
                        <hr/>
                        <p style="font-size: 12px; color: #666;">আপনি মতিউর রহমান মল্লিক ওয়েবসাইটের সাবস্ক্রাইবার হিসেবে এই ইমেইলটি পেয়েছেন।</p>
                    </div>
                `,
            });
        });

        await Promise.all(emailPromises);
        console.log(`Sent email to ${subscribers.length} subscribers.`);

    } catch (error) {
        console.error("Error sending email:", error);
    }
}
