import Link from "next/link";
import { ArrowRight, Music, Play, User } from "lucide-react";

// Sample featured songs data
const featuredSongs = [
    {
        id: 1,
        title: "সকালের গান",
        lyrics: "সকাল হলো, উঠো গো সবাই\nনতুন দিনের আলো এসেছে\nপাখিরা গান গাইছে ডালে\nপ্রকৃতি জেগেছে নতুন বেশে।",
        tuneBy: "রাহুল দেব বর্মন",
        sungBy: "লতা মঙ্গেশকর",
        year: "১৯৮০",
    },
    {
        id: 2,
        title: "দেশের গান",
        lyrics: "আমার দেশ, আমার মাটি\nতোমার কাছে আমি চিরকৃতজ্ঞ\nতোমার ভালোবাসায় বড় হয়েছি\nতোমার স্নেহে পেয়েছি শক্তি।",
        tuneBy: "সলিল চৌধুরী",
        sungBy: "হেমন্ত মুখোপাধ্যায়",
        year: "১৯৮৫",
    },
    {
        id: 3,
        title: "প্রেমের গান",
        lyrics: "তোমাকে ভালোবাসি বলে\nজীবন হয়েছে সুন্দর\nতোমার হাসিতে আলো ফোটে\nমন হয় আনন্দে ভরপুর।",
        tuneBy: "মানা দে",
        sungBy: "কিশোর কুমার",
        year: "১৯৯০",
    },
];

export function FeaturedSongs() {
    return (
        <section className="section bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                            বিখ্যাত গানসমূহ
                        </h2>
                        <p className="text-gray-400">
                            কবির জনপ্রিয় গান ও সুর
                        </p>
                    </div>
                    <Link
                        href="/songs"
                        className="hidden md:inline-flex items-center gap-2 mt-4 md:mt-0 text-gold-400 hover:text-gold-300 font-medium transition-colors"
                    >
                        সব গান দেখুন
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:hidden">
                    {featuredSongs.map((song) => (
                        <Link
                            key={song.id}
                            href={`/songs/${song.id}`}
                            className="group relative flex-shrink-0 w-[280px] bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-gold-500/50 hover:bg-white/10 transition-all duration-300 snap-start"
                        >
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold-500 text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-gold-500/25">
                                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                                    <Music className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-display text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                                        {song.title}
                                    </h3>
                                    <p className="text-xs text-gray-400">রচনা: {song.year}</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mb-4 whitespace-pre-line line-clamp-3 leading-relaxed">
                                {song.lyrics}
                            </p>

                            <div className="flex flex-col gap-1 pt-3 border-t border-white/10 text-xs">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="text-gold-400">সুর:</span> {song.tuneBy}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <User className="w-3 h-3 text-gold-400" />
                                    {song.sungBy}
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* See More Card - Mobile */}
                    <Link
                        href="/songs"
                        className="flex-shrink-0 w-[180px] bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gold-500/30 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform snap-start"
                    >
                        <div className="w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center">
                            <ArrowRight className="w-7 h-7 text-gray-900" />
                        </div>
                        <span className="font-display font-semibold text-gold-400 text-center text-sm">
                            আরো দেখুন
                        </span>
                    </Link>
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {featuredSongs.map((song) => (
                        <Link
                            key={song.id}
                            href={`/songs/${song.id}`}
                            className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-gold-500/50 hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gold-500 text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-gold-500/25">
                                <Play className="w-5 h-5 ml-1" fill="currentColor" />
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                                    <Music className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
                                        {song.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">রচনা: {song.year}</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mb-4 whitespace-pre-line line-clamp-3 leading-relaxed">
                                {song.lyrics}
                            </p>

                            <div className="flex flex-col gap-2 pt-4 border-t border-white/10 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="text-gold-400">সুর:</span> {song.tuneBy}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <User className="w-4 h-4 text-gold-400" />
                                    {song.sungBy}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Audio Player Preview */}
                <div className="mt-12 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                    <div className="flex items-center gap-6">
                        <button className="w-16 h-16 rounded-full bg-gold-500 text-gray-900 flex items-center justify-center hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/25">
                            <Play className="w-7 h-7 ml-1" fill="currentColor" />
                        </button>
                        <div className="flex-1">
                            <h4 className="font-display text-lg font-bold mb-1">সকালের গান</h4>
                            <p className="text-sm text-gray-400">কিশোর কুমার • প্রভাতী সুর অ্যালবাম</p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="w-1/3 h-full bg-gold-500" />
                                </div>
                                <span className="text-sm text-gray-400">2:34 / 5:42</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
