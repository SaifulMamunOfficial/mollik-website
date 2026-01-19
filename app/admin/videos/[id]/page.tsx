
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import VideoForm from '@/components/admin/VideoForm'

interface Props {
    params: {
        id: string
    }
}

export const dynamic = 'force-dynamic'

async function getVideo(id: string) {
    return prisma.video.findUnique({
        where: { id },
    })
}

export default async function EditVideoPage({ params }: Props) {
    const video = await getVideo(params.id)

    if (!video) {
        notFound()
    }

    return (
        <VideoForm
            initialData={{
                id: video.id,
                title: video.title,
                slug: video.slug,
                description: video.description,
                youtubeId: video.youtubeId,
                duration: video.duration,
                category: video.category,
                featured: video.featured,
                status: video.status,
            }}
        />
    )
}
