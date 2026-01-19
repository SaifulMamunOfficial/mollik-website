
import prisma from '@/lib/prisma'
import ContactListClient from '@/components/admin/ContactListClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function getContacts() {
    return prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function ContactsPage() {
    const contacts = await getContacts()

    return (
        <div className="space-y-6">
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading messages...</div>}>
                <ContactListClient contacts={contacts} />
            </Suspense>
        </div>
    )
}
