import Link from "next/link";
import { BookOpen, Music, PenTool, ArrowRight } from "lucide-react";
import type { HomeStats, LatestWorks } from "@/types/home";

interface WorksGridProps {
    stats: HomeStats;
    latestWorks: LatestWorks;
}

// Helper to convert number to Bengali
function toBengaliNumber(num: number): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => {
        const d = parseInt(digit);
        return isNaN(d) ? digit : bengaliDigits[d];
    }).join('');
}

export function WorksGrid({ stats, latestWorks }: WorksGridProps) {
    // Build work categories from dynamic data
    const workCategories = [
        {
            title: "প্রিয় কবিতা",
            icon: BookOpen,
            count: stats.poemCount,
            items: latestWorks.poems.length > 0
                ? latestWorks.poems.map(p => ({ name: p.title, description: p.excerpt?.substring(0, 50) + "..." || "কবির জনপ্রিয় কবিতা", slug: p.slug }))
                : [
                    { name: "প্রভাতের আলো", description: "কবির সবচেয়ে জনপ্রিয় কবিতা", slug: "probhater-alo" },
                    { name: "মাতৃভূমির প্রতি", description: "দেশপ্রেমের অমর গীতি", slug: "matribhumir-proti" },
                ],
            href: "/poems",
            color: "from-primary-500 to-primary-700",
            bgColor: "bg-primary-50 dark:bg-primary-900/20",
        },
        {
            title: "জনপ্রিয় গান",
            icon: Music,
            count: stats.songCount,
            items: latestWorks.songs.length > 0
                ? latestWorks.songs.map(s => ({ name: s.title, description: s.excerpt?.substring(0, 50) + "..." || "কবির জনপ্রিয় গান", slug: s.slug }))
                : [
                    { name: "সকালের গান", description: "নতুন দিনের আশা ও আনন্দের গান", slug: "sokaler-gaan" },
                    { name: "দেশের গান", description: "মাতৃভূমির প্রতি ভালোবাসার প্রকাশ", slug: "desher-gaan" },
                ],
            href: "/songs",
            color: "from-gold-500 to-gold-700",
            bgColor: "bg-gold-50 dark:bg-gold-900/20",
        },
        {
            title: "উল্লেখযোগ্য গ্রন্থ",
            icon: PenTool,
            count: stats.bookCount,
            items: latestWorks.books.length > 0
                ? latestWorks.books.map(b => ({ name: b.title, description: b.subtitle || "কবির গ্রন্থ", slug: b.slug }))
                : [
                    { name: "কাব্যগ্রন্থ - প্রারম্ভিক রচনা", description: "কবির প্রথম কাব্যগ্রন্থ", slug: "prarombhik-rachona" },
                    { name: "স্বপ্নের দেশ - কাব্যসংগ্রহ", description: "পরিপক্ক বয়সের শ্রেষ্ঠ কবিতা", slug: "shopner-desh" },
                ],
            href: "/books",
            color: "from-primary-600 to-gold-600",
            bgColor: "bg-cream-100 dark:bg-gray-800",
        },
    ];

    return (
        <section className="section bg-cream-50 dark:bg-gray-900">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        নির্বাচিত কাজ
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        কবির শ্রেষ্ঠ সৃষ্টিগুলো থেকে নির্বাচিত কবিতা, গান এবং গ্রন্থ
                    </p>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory md:hidden -mx-4 px-4">
                    {workCategories.map((category) => (
                        <div
                            key={category.title}
                            className={`${category.bgColor} flex-shrink-0 w-[300px] rounded-3xl p-8 shadow-lg snap-center`}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-lg`}>
                                <category.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Title with Count */}
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                                    {category.title}
                                </h3>
                                {category.count > 0 && (
                                    <span className="px-2 py-1 bg-white/50 dark:bg-gray-700/50 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">
                                        {toBengaliNumber(category.count)}+
                                    </span>
                                )}
                            </div>

                            {/* Items */}
                            <div className="space-y-4 mb-6">
                                {category.items.map((item) => (
                                    <div
                                        key={item.name}
                                        className="p-4 bg-white dark:bg-gray-800/50 rounded-xl"
                                    >
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Link */}
                            <Link
                                href={category.href}
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-gold-400 hover:text-primary-700 dark:hover:text-gold-300 font-medium transition-colors"
                            >
                                সব দেখুন
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Desktop: Works Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-8">
                    {workCategories.map((category) => (
                        <div
                            key={category.title}
                            className={`${category.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow`}
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-lg`}>
                                <category.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Title with Count */}
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                                    {category.title}
                                </h3>
                                {category.count > 0 && (
                                    <span className="px-2 py-1 bg-white/50 dark:bg-gray-700/50 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">
                                        {toBengaliNumber(category.count)}+
                                    </span>
                                )}
                            </div>

                            {/* Items */}
                            <div className="space-y-4 mb-6">
                                {category.items.map((item) => (
                                    <div
                                        key={item.name}
                                        className="p-4 bg-white dark:bg-gray-800/50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Link */}
                            <Link
                                href={category.href}
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-gold-400 hover:text-primary-700 dark:hover:text-gold-300 font-medium transition-colors"
                            >
                                সব দেখুন
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
