import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const emails = ['1@mollik.com', 'admin@motiurrahmanmollik.com'];

    for (const email of emails) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, role: true }
        });

        if (user) {
            console.log(`✅ ${user.email} -> Role: ${user.role}`);
        } else {
            console.log(`❌ ${email} -> User not found`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
