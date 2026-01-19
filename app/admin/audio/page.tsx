import AudioListClient from '@/components/admin/AudioListClient'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getAudios() {
    return prisma.audio.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function AudioPage() {
    const audios = await getAudios()

    return (
        <div className="space-y-6">
            <AudioListClient audios={audios} />
        </div>
    )
}
