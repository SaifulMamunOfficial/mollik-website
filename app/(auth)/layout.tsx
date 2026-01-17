"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-3xl" />

                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 py-6 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30 group-hover:shadow-gold-500/50 transition-all duration-300">
                            <span className="text-primary-950 font-bold text-xl">ম</span>
                        </div>
                        <div>
                            <h1 className="text-white font-display text-base sm:text-lg">মতিউর রহমান মল্লিক</h1>
                            <p className="text-gold-300/80 text-xs sm:text-sm">কবি ও সাহিত্যিক</p>
                        </div>
                    </Link>

                    <Link
                        href="/"
                        className="text-gold-300/80 hover:text-gold-300 transition-colors text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        মুখপাতায় ফিরুন
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Auth Card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            <Link
                                href="/login"
                                className={`flex-1 py-4 text-center font-medium transition-all duration-300 ${pathname === "/login"
                                    ? "text-gold-400 bg-white/5 border-b-2 border-gold-400"
                                    : "text-white/60 hover:text-white/80 hover:bg-white/5"
                                    }`}
                            >
                                প্রবেশ করুন
                            </Link>
                            <Link
                                href="/register"
                                className={`flex-1 py-4 text-center font-medium transition-all duration-300 ${pathname === "/register"
                                    ? "text-gold-400 bg-white/5 border-b-2 border-gold-400"
                                    : "text-white/60 hover:text-white/80 hover:bg-white/5"
                                    }`}
                            >
                                নিবন্ধন করুন
                            </Link>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            {children}
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="mt-8 text-center">
                        <blockquote className="text-white/60 italic text-sm">
                            "সত্য ও সুন্দরের সন্ধানে কবির পথচলা অনন্ত..."
                        </blockquote>
                        <cite className="text-gold-400/60 text-xs mt-2 block">— মতিউর রহমান মল্লিক</cite>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-4 text-center text-white/40 text-sm">
                <p>© ২০২৬ মতিউর রহমান মল্লিক স্মারক ওয়েবসাইট</p>
            </footer>
        </div>
    );
}
