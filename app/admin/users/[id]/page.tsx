
import prisma from '@/lib/prisma'
import UserForm from '@/components/admin/UserForm'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getUser(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            image: true,
            bio: true,
        }
    })
    return user
}

export default async function EditUserPage({ params }: PageProps) {
    const { id } = await params
    const user = await getUser(id)

    if (!user) {
        notFound()
    }

    return <UserForm initialData={user} />
}
