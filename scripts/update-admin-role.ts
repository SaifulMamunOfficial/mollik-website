import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@motiurrahmanmollik.com'
    const password = 'admin2025'
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'SUPER_ADMIN' },
        create: {
            email,
            name: 'Admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN'
        }
    })
    console.log('✅ User ready:', user.email)
    console.log('   Role:', user.role)
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
