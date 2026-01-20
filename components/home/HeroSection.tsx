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
        <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-[#281510] dark:bg-[#1a0f0a] transition-colors duration-700">
            {/* Background Gradient - Light Mode (Velvety Warmth) */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_110%_100%_at_50%_0%,_#A66E4E_0%,_#8B5A2B_25%,_#5D4037_50%,_#3E2723_75%,_#281510_100%)] opacity-100 dark:opacity-0 transition-opacity duration-1000 ease-in-out"
            />

            {/* Background Gradient - Dark Mode (Deep Mysterious Night) */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_110%_100%_at_50%_0%,_#6D4C41_0%,_#5D4037_25%,_#3E2723_50%,_#261612_75%,_#1a0f0a_100%)] opacity-0 dark:opacity-100 transition-opacity duration-1000 ease-in-out"
            />

            {/* Noise Texture Overlay - Subtle & Premium */}
            <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />

            {/* Ambient Lighting - Warm Glows */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-64 h-64 md:w-96 md:h-96 bg-[#FFB74D]/10 rounded-full blur-[80px] md:blur-[120px] animate-float duration-[15s]" />
                <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#FF7043]/10 rounded-full blur-[100px] md:blur-[150px] animate-float duration-[20s]" style={{ animationDelay: '-5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#FFD54F]/5 rounded-full blur-[60px] md:blur-[100px]" />
            </div>

            {/* Radial Vignette for focus */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

            {/* Content */}
            <div className="container-custom relative z-10 py-12 md:py-0">
                <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-6">

                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 bg-white/5 backdrop-blur-md rounded-full border border-[#FFD54F]/20 animate-fade-in shadow-lg shadow-black/20">
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FFD54F]" />
                        <span className="text-[#FFECB3] text-xs md:text-sm font-medium tracking-wider">
                            সাহিত্যিক ঐতিহ্য
                        </span>
                    </div>

                    {/* Main Title - with adjusted leading for Bengali text */}
                    <div className="animate-slide-up pb-1">
                        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-relaxed drop-shadow-lg">
                            {firstName}
                        </h1>
                        <h1
                            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-relaxed py-3 -mt-1 md:-mt-2"
                            style={{
                                background: 'linear-gradient(to right, #FFD54F, #FFA000, #FF6F00)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                            }}
                        >
                            {lastName}
                        </h1>
                    </div>

                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-3 md:gap-4 animate-fade-in stagger-2 opacity-80">
                        <div className="w-8 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#FFD54F]" />
                        <span className="text-[#FFD54F] text-base md:text-lg">✦</span>
                        <div className="w-8 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#FFD54F]" />
                    </div>

                    {/* Details Container */}
                    <div className="max-w-2xl mx-auto backdrop-blur-sm bg-black/10 rounded-2xl p-5 md:p-6 border border-[#FFD54F]/10 animate-fade-in stagger-3 hover:bg-black/20 transition-colors duration-500 shadow-xl mx-4 md:mx-auto">
                        <p className="text-xl md:text-3xl text-[#FFE082] font-bengali tracking-wide mb-2 md:mb-3">
                            {occupation}
                        </p>

                        {heroDescription && (
                            <p className="text-base md:text-lg text-[#E0E0E0] font-light italic font-serif leading-relaxed opacity-90 mb-3 md:mb-4">
                                &quot;{heroDescription}&quot;
                            </p>
                        )}

                        <p className="text-xs md:text-sm text-[#BDBDBD] tracking-[0.2em] font-light uppercase border-t border-[#FFD54F]/20 pt-3 md:pt-4 inline-block px-8 md:px-10">
                            {bornDate} — {deathDate}
                        </p>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 z-20 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[9px] md:text-[10px] text-[#FFE082]/60 tracking-[0.3em] uppercase">নিচে দেখুন</span>
                <div className="w-px h-8 md:h-12 bg-gradient-to-b from-transparent via-[#FFD54F] to-transparent" />
            </div>
        </section>
    );
}
