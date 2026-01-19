
import prisma from '@/lib/prisma'
import SubscriberListClient from '@/components/admin/SubscriberListClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function getSubscribers() {
    return prisma.subscriber.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function SubscribersPage() {
    const subscribers = await getSubscribers()

    return (
        <div className="space-y-6">
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading subscribers...</div>}>
                <SubscriberListClient subscribers={subscribers} />
            </Suspense>
        </div>
    )
}
