"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun, User, ChevronDown, LogOut, LayoutDashboard, Edit, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface NavigationItem {
    name: string;
    href: string;
    children?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
    { name: "মুখপাতা", href: "/" },
    { name: "জীবনী", href: "/biography" },
    { name: "কবিতা", href: "/poems" },
    { name: "গ্রন্থ", href: "/books" },
    { name: "গান", href: "/songs" },
    { name: "গদ্য", href: "/prose" },
    { name: "ব্লগ", href: "/blog" },
];

export function Header() {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        // Check system preference and localStorage
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        const useDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        setIsDarkMode(useDark);
        document.documentElement.classList.toggle('dark', useDark);
    }, []);

    // Listen for profile updates
    const { update: updateSession } = useSession();
    useEffect(() => {
        const handleProfileUpdate = () => {
            updateSession();
        };

        window.addEventListener('profileUpdated', handleProfileUpdate);
        return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
    }, [updateSession]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg'
                : 'bg-cream-50/80 dark:bg-gray-950/80 backdrop-blur-md'
                }`}
        >
            <nav className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center text-white font-display font-bold text-lg md:text-xl shadow-lg group-hover:scale-105 transition-transform">
                            ম
                        </div>
                        <div className="block">
                            <h1 className="font-display font-semibold text-lg md:text-xl text-gray-900 dark:text-white leading-tight">
                                মতিউর রহমান মল্লিক
                            </h1>
                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                                কবি ও সাহিত্যিক
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navigation.map((item) => (
                            <div
                                key={item.name}
                                className="relative group"
                                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1 px-4 py-2 text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-gold-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    {item.name}
                                    {item.children && <ChevronDown className="w-4 h-4" />}
                                </Link>

                                {/* Dropdown */}
                                {item.children && openDropdown === item.name && (
                                    <div className="absolute top-full left-0 mt-1 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 animate-fade-in">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-gold-400"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={isDarkMode ? "লাইট মোড" : "ডার্ক মোড"}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* User Button - Session Aware */}
                        {status === "loading" ? (
                            <div className="hidden md:flex p-2 rounded-lg text-gray-400">
                                <User className="w-5 h-5 animate-pulse" />
                            </div>
                        ) : session ? (
                            <div className="hidden md:block relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="ইউজার মেনু"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center text-white text-sm font-semibold">
                                        {session.user?.name?.charAt(0) || "A"}
                                    </div>
                                </button>

                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50 animate-fade-in">
                                            <div className="px-4 py-3 border-b dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {session.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {session.user?.email}
                                                </p>
                                            </div>

                                            {/* Admin Link */}
                                            {['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'].includes(session.user?.role || '') && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-primary-600 dark:text-gold-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    অ্যাডমিন প্যানেল
                                                </Link>
                                            )}

                                            {/* User Dashboard Link */}
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <User className="w-4 h-4" />
                                                আমার ড্যাশবোর্ড
                                            </Link>
                                            {session.user?.role !== 'ADMIN' && (
                                                <Link
                                                    href="/blog/new"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    ব্লগ লিখুন
                                                </Link>
                                            )}
                                            {session.user?.role === 'ADMIN' && (
                                                <Link
                                                    href="/admin/settings"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    সেটিংস
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    signOut({ callbackUrl: '/' });
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                লগআউট
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="লগইন"
                            >
                                <User className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="মেনু টগল"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t dark:border-gray-800 animate-slide-up">
                        <div className="flex flex-col gap-1">
                            {navigation.map((item) => (
                                <div key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="block px-4 py-3 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                    {item.children && (
                                        <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-gold-400"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Mobile User Section */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {session ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center text-white font-semibold">
                                                {session.user?.name?.charAt(0) || "A"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {session.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Admin Link Mobile */}
                                        {['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'].includes(session.user?.role || '') && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-3 px-4 py-3 text-lg text-primary-600 dark:text-gold-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <LayoutDashboard className="w-5 h-5" />
                                                অ্যাডমিন প্যানেল
                                            </Link>
                                        )}

                                        {/* User Dashboard Link Mobile */}
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User className="w-5 h-5" />
                                            আমার ড্যাশবোর্ড
                                        </Link>
                                        {session.user?.role !== 'ADMIN' && (
                                            <Link
                                                href="/blog/new"
                                                className="flex items-center gap-3 px-4 py-3 text-lg text-primary-600 dark:text-gold-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <Edit className="w-5 h-5" />
                                                ব্লগ লিখুন
                                            </Link>
                                        )}
                                        {session.user?.role === 'ADMIN' && (
                                            <Link
                                                href="/admin/settings"
                                                className="flex items-center gap-3 px-4 py-3 text-lg text-primary-600 dark:text-gold-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <Settings className="w-5 h-5" />
                                                সেটিংস
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                signOut({ callbackUrl: '/' });
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-lg text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            লগআউট
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 px-4 py-3 text-lg text-primary-600 dark:text-gold-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="w-5 h-5" />
                                        লগইন / নিবন্ধন
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
