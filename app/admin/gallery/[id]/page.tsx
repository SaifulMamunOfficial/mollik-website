
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import GalleryForm from '@/components/admin/GalleryForm'

interface Props {
    params: {
        id: string
    }
}

export const dynamic = 'force-dynamic'

async function getGalleryImage(id: string) {
    return prisma.galleryImage.findUnique({
        where: { id },
    })
}

export default async function EditGalleryImagePage({ params }: Props) {
    const image = await getGalleryImage(params.id)

    if (!image) {
        notFound()
    }

    return (
        <GalleryForm
            initialData={{
                id: image.id,
                url: image.url,
                title: image.title,
                description: image.description,
                year: image.year,
                location: image.location,
                featured: image.featured,
                status: image.status,
            }}
        />
    )
}
