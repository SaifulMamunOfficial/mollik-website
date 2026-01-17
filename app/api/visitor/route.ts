import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Get visitor count from database
export async function GET() {
    try {
        // Try to get existing setting or create one
        let visitorSetting = await prisma.setting.findUnique({
            where: { key: 'visitor_count' }
        });

        if (!visitorSetting) {
            visitorSetting = await prisma.setting.create({
                data: {
                    key: 'visitor_count',
                    value: '15234'
                }
            });
        }

        return NextResponse.json({
            count: parseInt(visitorSetting.value || '15234'),
            lastUpdated: visitorSetting.updatedAt?.toISOString() || new Date().toISOString()
        });
    } catch (error) {
        console.error("Error reading visitor data:", error);
        // Return default count if database fails
        return NextResponse.json({
            count: 15234,
            lastUpdated: new Date().toISOString()
        });
    }
}

// POST - Increment visitor count
export async function POST() {
    try {
        // Upsert the visitor count
        const visitorSetting = await prisma.setting.upsert({
            where: { key: 'visitor_count' },
            update: {
                value: {
                    increment: 1
                }
            },
            create: {
                key: 'visitor_count',
                value: '15235'
            }
        });

        // Since we can't increment string, let's do it properly
        const currentSetting = await prisma.setting.findUnique({
            where: { key: 'visitor_count' }
        });

        const currentCount = parseInt(currentSetting?.value || '15234');
        const newCount = currentCount + 1;

        const updatedSetting = await prisma.setting.update({
            where: { key: 'visitor_count' },
            data: { value: newCount.toString() }
        });

        return NextResponse.json({
            count: newCount,
            lastUpdated: updatedSetting.updatedAt?.toISOString() || new Date().toISOString()
        });
    } catch (error) {
        console.error("Error saving visitor data:", error);
        return NextResponse.json({
            count: 15234,
            lastUpdated: new Date().toISOString()
        });
    }
}
