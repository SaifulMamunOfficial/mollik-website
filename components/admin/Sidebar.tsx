'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Music,
    BookOpen,
    Newspaper,
    Image,
    Video,
    Mic,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    PenSquare,
    Heart,
    Mail,
    User,
    List,
    CheckCircle
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
    { name: 'কবিতা', href: '/admin/poems', icon: FileText },
    { name: 'গান', href: '/admin/songs', icon: Music },
    { name: 'গদ্য/প্রবন্ধ', href: '/admin/prose', icon: PenSquare },
    { name: 'বই', href: '/admin/books', icon: BookOpen },
    { name: 'ব্লগ', href: '/admin/blog', icon: Newspaper },
    { name: 'গ্যালারি', href: '/admin/gallery', icon: Image },
    { name: 'অডিও', href: '/admin/audio', icon: Mic },
    { name: 'ভিডিও', href: '/admin/videos', icon: Video },
    { name: 'ব্যবহারকারী', href: '/admin/users', icon: Users },
    { name: 'জীবনী', href: '/admin/biography', icon: User },
    { name: 'শোকবার্তা', href: '/admin/tributes', icon: Heart },
    { name: 'যোগাযোগ', href: '/admin/contacts', icon: Mail },
    { name: 'সাবস্ক্রাইবার', href: '/admin/subscribers', icon: CheckCircle },
    { name: 'সাবমিশন অপশন', href: '/admin/submission-options', icon: List },
    { name: 'সেটিংস', href: '/admin/settings', icon: Settings },
]


export default function AdminSidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-800 flex-shrink-0">
                    <Link href="/admin" className="block">
                        <h1 className="text-xl font-bold text-emerald-400">মল্লিক অ্যাডমিন</h1>
                        <p className="text-xs text-gray-400 mt-1">কন্টেন্ট ম্যানেজমেন্ট</p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto flex-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }
                `}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 flex-shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                        <span>সাইটে ফিরুন</span>
                    </Link>
                </div>
            </aside>
        </>
    )
}
