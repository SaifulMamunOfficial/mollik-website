import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminProfileDropdown from '@/components/admin/AdminProfileDropdown'

export const metadata = {
    title: 'অ্যাডমিন প্যানেল | মতিউর রহমান মল্লিক',
    description: 'কন্টেন্ট ম্যানেজমেন্ট ড্যাশবোর্ড',
}

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER']

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth()

    // Check if user is logged in
    if (!session?.user) {
        redirect('/login')
    }

    // Check if user has admin access
    if (!ALLOWED_ROLES.includes(session.user.role || '')) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSidebar />

            {/* Main content area */}
            <main className="lg:ml-64 min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-6 py-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            স্বাগতম, {session.user.name || 'অ্যাডমিন'}
                        </h2>
                        <AdminProfileDropdown />
                    </div>
                </header>

                {/* Page content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

