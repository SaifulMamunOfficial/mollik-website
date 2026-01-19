import GalleryListClient from '@/components/admin/GalleryListClient'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getGalleryImages() {
    return prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function GalleryPage() {
    const images = await getGalleryImages()

    return (
        <GalleryListClient images={images} />
    )
}
