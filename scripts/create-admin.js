const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    const prisma = new PrismaClient();

    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const user = await prisma.user.upsert({
            where: { email: 'admin@mollik.com' },
            update: {},
            create: {
                email: 'admin@mollik.com',
                name: 'মতিউর রহমান মল্লিক',
                password: hashedPassword,
                role: 'ADMIN',
            }
        });

        console.log('✅ Admin user created:', user.email);
        console.log('Email: admin@mollik.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
