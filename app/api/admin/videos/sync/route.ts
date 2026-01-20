import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from "@/auth"
import { getChannelLatestVideos } from '@/lib/youtube'

const MOLLIK_CHANNEL_ID = 'UCjINfKW8Z-y8AV4m2AzcueA';

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch videos from YouTube
        const latestVideos = await getChannelLatestVideos(MOLLIK_CHANNEL_ID);

        if (latestVideos.length === 0) {
            return NextResponse.json({ message: 'কোনো ভিডিও পাওয়া যায়নি বা API সমস্যা' }, { status: 404 });
        }

        let addedCount = 0;
        let errors = 0;

        for (const video of latestVideos) {
            // Check if already exists by youtubeId
            const exists = await prisma.video.findFirst({
                where: { youtubeId: video.youtubeId }
            });

            if (!exists) {
                try {
                    // Generate Slug
                    let baseSlug = video.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'video';
                    let finalSlug = baseSlug;
                    let counter = 1;

                    while (await prisma.video.findUnique({ where: { slug: finalSlug } })) {
                        finalSlug = `${baseSlug}-${counter}`;
                        counter++;
                    }

                    await prisma.video.create({
                        data: {
                            title: video.title,
                            slug: finalSlug,
                            description: video.description,
                            youtubeId: video.youtubeId,
                            thumbnail: video.thumbnail,
                            status: 'PUBLISHED',
                            createdAt: new Date(video.publishedAt) // Maintain original upload date
                        }
                    });
                    addedCount++;
                } catch (e) {
                    console.error(`Failed to add video ${video.youtubeId}:`, e);
                    errors++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            added: addedCount,
            totalFetched: latestVideos.length,
            message: `${addedCount} টি নতুন ভিডিও যুক্ত হয়েছে।`
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: 'ভিডিও সিঙ্ক করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
