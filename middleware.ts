import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER']
    const isAdminRole = ADMIN_ROLES.includes(req.auth?.user?.role || '')
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isAuthRoute = req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/register')

    // Redirect logged-in users away from auth pages
    if (isAuthRoute && isLoggedIn) {
        // If admin role, redirect to admin dashboard
        if (isAdminRole) {
            return NextResponse.redirect(new URL('/admin', req.url))
        }
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Protect admin routes
    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        if (!isAdminRole) {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/admin/:path*', '/login', '/register']
}
