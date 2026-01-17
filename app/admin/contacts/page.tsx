import prisma from '@/lib/prisma'
import ContactsTable from '@/components/admin/ContactsTable'

export const dynamic = 'force-dynamic'

async function getSubmissions() {
    return prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export default async function ContactsPage() {
    const submissions = await getSubmissions()

    return <ContactsTable submissions={submissions as any} />
}
