import Link from "next/link";
import { ArrowRight, Eye, BookOpen } from "lucide-react";

// Sample featured poems data (in production this would come from the database)
const featuredPoems = [
    {
        id: 1,
        title: "প্রভাতের আলো",
        excerpt: "সকালের সূর্য উঠেছে আকাশে\nপ্রকৃতি জেগে উঠেছে নতুন আশে\nপাখিরা গান গায় ডালে ডালে\nস্বপ্নেরা ভেসে যায় সকালের আলে।",
        year: "১৯৭৫",
        views: 1250,
    },
    {
        id: 2,
        title: "মাতৃভূমির প্রতি",
        excerpt: "হে আমার স্বদেশ, হে আমার মাতৃভূমি\nতোমার কাছে আমি চিরকাল ঋণী\nতোমার মাটিতে খেলেছি শৈশবে\nতোমার আকাশে দেখেছি স্বপ্নের রবি।",
        year: "১৯৮০",
        views: 980,
    },
    {
        id: 3,
        title: "বর্ষার গান",
        excerpt: "মেঘ জমেছে আকাশে\nবৃষ্টি নামবে সারা দেশে\nধান ক্ষেত হাসবে আনন্দে\nকৃষকের মুখে ফুটবে উল্লাস।",
        year: "১৯৯০",
        views: 756,
    },
    {
        id: 4,
        title: "শান্তির খোঁজে",
        excerpt: "হৃদয়ের গভীরে খুঁজে ফিরি\nএকটুখানি শান্তির ছোঁয়া\nএই কোলাহলপূর্ণ জীবনে\nমনের প্রশান্তি কোথায় পাওয়া।",
        year: "২০০৫",
        views: 623,
    },
];

export function FeaturedPoems() {
    return (
        <section className="section bg-white dark:bg-gray-950">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            বিশেষ কবিতাসমূহ
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            কবির শ্রেষ্ঠ ও জনপ্রিয় কবিতাগুলি
                        </p>
                    </div>
                    <Link
                        href="/poems"
                        className="hidden md:inline-flex items-center gap-2 mt-4 md:mt-0 text-primary-600 dark:text-gold-400 hover:text-primary-700 dark:hover:text-gold-300 font-medium transition-colors"
                    >
                        সব কবিতা দেখুন
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-4 scrollbar-hide snap-x snap-mandatory md:hidden">

                    {featuredPoems.map((poem, index) => (
                        <Link
                            key={poem.id}
                            href={`/poems/${poem.id}`}
                            className={`group relative flex-shrink-0 w-[280px] bg-gradient-to-br from-cream-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover-lift transition-all duration-300 snap-start ${index === 0 ? 'ring-2 ring-gold-400 dark:ring-gold-500' : ''
                                }`}
                        >
                            {index === 0 && (
                                <div className="absolute -top-3 left-6 px-3 py-1 bg-gold-500 text-gray-900 text-xs font-semibold rounded-full">
                                    সর্বাধিক পঠিত
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                    {poem.title}
                                </h3>
                                <BookOpen className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 whitespace-pre-line line-clamp-4 leading-relaxed">
                                {poem.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span>প্রকাশিত: {poem.year}</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {poem.views.toLocaleString('bn-BD')}
                                </span>
                            </div>
                        </Link>
                    ))}

                    {/* See More Card - Mobile */}
                    <Link
                        href="/poems"
                        className="flex-shrink-0 w-[180px] bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl p-6 border border-primary-200 dark:border-primary-700 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform snap-start"
                    >
                        <div className="w-14 h-14 rounded-full bg-primary-600 dark:bg-gold-500 flex items-center justify-center">
                            <ArrowRight className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-display font-semibold text-primary-700 dark:text-gold-400 text-center text-sm">
                            আরো দেখুন
                        </span>
                    </Link>
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                    {featuredPoems.map((poem, index) => (
                        <Link
                            key={poem.id}
                            href={`/poems/${poem.id}`}
                            className={`group relative bg-gradient-to-br from-cream-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover-lift transition-all duration-300 ${index === 0 ? 'ring-2 ring-gold-400 dark:ring-gold-500' : ''
                                }`}
                        >
                            {index === 0 && (
                                <div className="absolute -top-3 left-6 px-3 py-1 bg-gold-500 text-gray-900 text-xs font-semibold rounded-full">
                                    সর্বাধিক পঠিত
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                    {poem.title}
                                </h3>
                                <BookOpen className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 whitespace-pre-line line-clamp-4 leading-relaxed">
                                {poem.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span>প্রকাশিত: {poem.year}</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {poem.views.toLocaleString('bn-BD')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
