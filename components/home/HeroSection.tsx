import Link from "next/link";
import { BookOpen, Music, Sparkles } from "lucide-react";
import type { SiteSettings } from "@prisma/client";

interface HeroSectionProps {
    settings: SiteSettings | null;
}

export function HeroSection({ settings }: HeroSectionProps) {
    // Default values if settings not available
    const heroTitle = settings?.heroTitle || "মতিউর রহমান মল্লিক";
    const occupation = settings?.occupation || "কবি, গীতিকার ও সাহিত্যিক";
    const bornDate = settings?.bornDate || "১ মার্চ ১৯৫০";
    const deathDate = settings?.deathDate || "১২ আগস্ট ২০১০";

    // Split name for styling (first part white, last part gold)
    const nameParts = heroTitle.split(" ");
    const firstName = nameParts.slice(0, -1).join(" "); // All except last
    const lastName = nameParts[nameParts.length - 1]; // Last word

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Gradient - More depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-800 via-primary-900 to-gray-950 dark:from-gray-900 dark:via-primary-950 dark:to-black" />

            {/* Decorative floating orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold-500/15 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-4s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[150px]" />
            </div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Content */}
            <div className="container-custom relative z-10 pt-20 pb-28">
                <div className="max-w-4xl mx-auto text-center space-y-3">

                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-full border border-gold-400/20 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                        <span className="text-gold-400 text-sm font-medium tracking-wider">
                            ভবিষ্যৎ প্রজন্মের জন্য সংরক্ষিত সাহিত্যিক ঐতিহ্য
                        </span>
                    </div>

                    {/* Main Title */}
                    <div className="animate-slide-up overflow-visible pt-2">
                        <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight" style={{ lineHeight: '1.15' }}>
                            {firstName}
                        </h1>
                        <h1
                            className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight"
                            style={{
                                lineHeight: '1.15',
                                background: 'linear-gradient(to right, #fcd34d, #f59e0b, #d97706)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                paddingTop: '0.15em'
                            }}
                        >
                            {lastName}
                        </h1>
                    </div>

                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-4 animate-fade-in stagger-2 !mt-4">
                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold-500/50" />
                        <span className="text-gold-400/60 text-lg">✦</span>
                        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold-500/50" />
                    </div>

                    {/* Role description - Elegant styling */}
                    <p className="text-xl md:text-2xl text-gold-200/90 font-bengali animate-fade-in stagger-2 tracking-wide">
                        {occupation}
                    </p>

                    {/* Dates - More refined */}
                    <p className="text-base text-gray-400 animate-fade-in stagger-3 tracking-widest font-light">
                        {bornDate} — {deathDate}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4 animate-fade-in stagger-4">
                        <Link
                            href="/poems"
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-gray-900 font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-xl shadow-gold-500/30 hover:shadow-gold-400/40"
                        >
                            <BookOpen className="w-5 h-5 transition-transform group-hover:-rotate-6" />
                            কবিতা অন্বেষণ করুন
                        </Link>
                        <Link
                            href="/songs"
                            className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 hover:border-gold-400/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        >
                            <Music className="w-5 h-5 transition-transform group-hover:scale-110" />
                            গান শুনুন
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Fixed at very bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <span className="text-[10px] text-white/30 tracking-widest uppercase">স্ক্রল করুন</span>
                <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
                    <div className="w-1 h-2 bg-gold-400/60 rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
}
