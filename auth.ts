import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("🔐 [AUTH] authorize() called with:", credentials?.email)

                if (!credentials?.email || !credentials?.password) {
                    console.log("❌ [AUTH] Missing credentials")
                    throw new Error("Email এবং Password প্রয়োজন")
                }

                console.log("🔍 [AUTH] Looking for user...")
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user || !user.password) {
                    console.log("❌ [AUTH] User not found or no password")
                    throw new Error("ইমেইল বা পাসওয়ার্ড সঠিক নয়")
                }

                // Check if user is soft-deleted
                if (user.isDeleted) {
                    console.log("❌ [AUTH] User account is deleted")
                    throw new Error("এই একাউন্টটি মুছে ফেলা হয়েছে")
                }

                console.log("✅ [AUTH] User found:", user.email, "Role:", user.role)

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                console.log("🔐 [AUTH] Password check result:", isPasswordValid)

                if (!isPasswordValid) {
                    console.log("❌ [AUTH] Password invalid")
                    throw new Error("ইমেইল বা পাসওয়ার্ড সঠিক নয়")
                }

                console.log("✅ [AUTH] Login successful!")
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    select: { isDeleted: true }
                });

                if (dbUser?.isDeleted) {
                    console.log("❌ [AUTH] SignIn blocked: User is deleted");
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as { role?: string }).role
            }
            // Always fetch fresh role from database
            if (token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { role: true, name: true }
                })
                if (dbUser) {
                    token.role = dbUser.role
                    token.name = dbUser.name
                }
            }
            return token
        },
        session: authConfig.callbacks.session,
    },
})
