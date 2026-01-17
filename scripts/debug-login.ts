import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function debugLogin() {
    const email = 'admin@motiurrahmanmollik.com'
    const password = 'admin2025'

    console.log('🔍 ডিবাগ করা হচ্ছে:', email)

    // ইউজার খুঁজছি
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true
        }
    })

    if (!user) {
        console.log('❌ ইউজার পাওয়া যায়নি!')
        return
    }

    console.log('✅ ইউজার পাওয়া গেছে:')
    console.log('   ID:', user.id)
    console.log('   Email:', user.email)
    console.log('   Name:', user.name)
    console.log('   Role:', user.role)
    console.log('   Password Hash:', user.password?.substring(0, 20) + '...')

    if (!user.password) {
        console.log('❌ পাসওয়ার্ড হ্যাশ নেই (OAuth দিয়ে তৈরি হয়েছে হয়তো)')
        return
    }

    // পাসওয়ার্ড মিলাচ্ছি
    console.log('\n🔐 পাসওয়ার্ড verify করা হচ্ছে...')
    const isValid = await bcrypt.compare(password, user.password)

    if (isValid) {
        console.log('✅ পাসওয়ার্ড সঠিক! লগইন কাজ করার কথা।')
    } else {
        console.log('❌ পাসওয়ার্ড মিলছে না!')

        // নতুন হ্যাশ তৈরি করে আপডেট করি
        console.log('\n🔄 নতুন পাসওয়ার্ড হ্যাশ তৈরি করা হচ্ছে...')
        const newHash = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: { email },
            data: { password: newHash }
        })

        console.log('✅ পাসওয়ার্ড আপডেট করা হয়েছে। এখন লগইন করে দেখুন।')
    }

    await prisma.$disconnect()
}

debugLogin().catch(console.error)
