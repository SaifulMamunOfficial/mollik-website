import VideoListClient from '@/components/admin/VideoListClient'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getVideos() {
    return prisma.video.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function VideosPage() {
    const videos = await getVideos()

    return (
        <div className="space-y-6">
            <VideoListClient videos={videos} />
        </div>
    )
}
