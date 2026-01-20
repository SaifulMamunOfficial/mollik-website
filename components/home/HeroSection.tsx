import { Sparkles } from "lucide-react";
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
    const heroDescription = settings?.heroDescription || "বিশ্বাসের বিশাল মিনারে আমি গেয়ে যাই জীবনের গান...";

    // Split name for styling (first part white, last part gold)
    const nameParts = heroTitle.split(" ");
    const firstName = nameParts.slice(0, -1).join(" "); // All except last
    const lastName = nameParts[nameParts.length - 1]; // Last word

    return (
        <section className="relative h-[calc(100vh-64px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 dark:from-primary-900 dark:via-gray-900 dark:to-black transition-colors duration-500">
            {/* Background Texture & Gradient */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />

            {/* Decorative floating orbs - Adjusted for visual balance */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-gold-500/10 dark:bg-gold-500/10 rounded-full blur-[120px] animate-float duration-[15s]" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[150px] animate-float duration-[20s]" style={{ animationDelay: '-5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-400/5 dark:bg-gold-400/5 rounded-full blur-[100px]" />
            </div>

            {/* Radial Pattern */}
            <div className="absolute inset-0 opacity-[0.3] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Content */}
            <div className="container-custom relative z-10 -mt-10">
                <div className="max-w-4xl mx-auto text-center space-y-6">

                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-full border border-gold-400/20 animate-fade-in shadow-lg shadow-black/5 dark:shadow-black/20">
                        <Sparkles className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                        <span className="text-gold-700 dark:text-gold-200/90 text-sm font-medium tracking-wider">
                            সাহিত্যিক ঐতিহ্য
                        </span>
                    </div>

                    {/* Main Title */}
                    <div className="animate-slide-up space-y-1">
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                            {firstName}
                        </h1>
                        <h1
                            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
                            style={{
                                background: 'linear-gradient(to right, #d97706, #f59e0b)', // Darker gold for light mode visibility
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {lastName}
                        </h1>
                    </div>

                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-4 animate-fade-in stagger-2 opacity-60">
                        <div className="w-12 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-gold-500" />
                        <span className="text-gold-600 dark:text-gold-400 text-lg">✦</span>
                        <div className="w-12 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-gold-500" />
                    </div>

                    {/* Details Container - Glassmorphism */}
                    <div className="max-w-2xl mx-auto backdrop-blur-sm bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/5 animate-fade-in stagger-3 hover:bg-white/60 dark:hover:bg-white/10 transition-colors duration-500 shadow-xl shadow-gray-200/50 dark:shadow-none">
                        <p className="text-2xl md:text-3xl text-gray-800 dark:text-gold-100 font-bengali tracking-wide mb-3">
                            {occupation}
                        </p>

                        {heroDescription && (
                            <p className="text-lg text-gray-700 dark:text-gray-300 font-light italic font-serif leading-relaxed opacity-90 mb-4">
                                &quot;{heroDescription}&quot;
                            </p>
                        )}

                        <p className="text-sm text-gray-600 dark:text-gray-400 tracking-[0.2em] font-light uppercase border-t border-gray-300 dark:border-white/10 pt-4 inline-block px-10">
                            {bornDate} — {deathDate}
                        </p>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[10px] text-gray-500 dark:text-white/40 tracking-[0.3em] uppercase">নিচে দেখুন</span>
                <div className="w-px h-12 bg-gradient-to-b from-gold-500/0 via-gold-500 to-gold-500/0" />
            </div>
        </section>
    );
}
