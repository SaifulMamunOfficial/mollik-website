
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import AudioForm from '@/components/admin/AudioForm'

interface Props {
    params: {
        id: string
    }
}

async function getAudio(id: string) {
    return prisma.audio.findUnique({
        where: { id },
    })
}

export default async function EditAudioPage({ params }: Props) {
    const audio = await getAudio(params.id)

    if (!audio) {
        notFound()
    }

    return (
        <AudioForm
            initialData={{
                id: audio.id,
                title: audio.title,
                slug: audio.slug,
                audioUrl: audio.audioUrl,
                coverImage: audio.coverImage || undefined,
                artist: audio.artist || undefined,
                album: audio.album || undefined,
                duration: audio.duration || undefined,
                lyrics: audio.lyrics || undefined,
                status: audio.status,
            }}
        />
    )
}
