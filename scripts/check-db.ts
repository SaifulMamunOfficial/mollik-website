
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.blogPost.count();
        console.log(`Total BlogPosts: ${count}`);

        const posts = await prisma.blogPost.findMany({
            take: 5,
            select: { title: true, status: true, category: { select: { name: true } } }
        });
        console.log('Sample Posts:', JSON.stringify(posts, null, 2));

        const tributes = await prisma.tribute.count();
        console.log(`Total Tributes: ${tributes}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
