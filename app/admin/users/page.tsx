import prisma from '@/lib/prisma'
import UserListClient from '@/components/admin/UserListClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function getUsers() {
    return prisma.user.findMany({
        where: {
            isDeleted: false // Only fetch non-deleted users
        },
        select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            image: true,
            createdAt: true,
            _count: {
                select: {
                    blogPosts: true,
                    writings: true, // Use writings instead of tributes/comments for general count if appropriate, or keep as is.
                    // Schema has `writings`, `blogPosts`. Let's count these.
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function UsersPage() {
    const users = await getUsers()

    // Transform count to match interface if needed, or update interface
    // UserListClient expects _count: { writings: number, blogPosts: number }
    // Prisma returns matches.

    return (
        <div className="space-y-6">
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading users...</div>}>
                <UserListClient users={users as any} />
            </Suspense>
        </div>
    )
}
