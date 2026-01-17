import prisma from '@/lib/prisma'
import GalleryClient from '@/components/admin/GalleryClient'

async function getGalleryImages() {
    return prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function GalleryPage() {
    const images = await getGalleryImages()

    return <GalleryClient images={images} />
}
