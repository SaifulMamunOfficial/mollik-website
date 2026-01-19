import prisma from '@/lib/prisma'
import TributesClient from './TributesClient'

async function getTributes() {
    return prisma.tribute.findMany({
        include: {
            author: {
                select: { name: true, email: true, image: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function TributesPage() {
    const tributes = await getTributes()

    return <TributesClient tributes={tributes as any} />
}
