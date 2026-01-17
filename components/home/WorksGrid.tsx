import Link from "next/link";
import { BookOpen, Music, PenTool, ArrowRight } from "lucide-react";

const workCategories = [
    {
        title: "প্রিয় কবিতা",
        icon: BookOpen,
        items: [
            { name: "প্রভাতের আলো", description: "কবির সবচেয়ে জনপ্রিয় কবিতা" },
            { name: "মাতৃভূমির প্রতি", description: "দেশপ্রেমের অমর গীতি" },
        ],
        href: "/poems",
        color: "from-primary-500 to-primary-700",
        bgColor: "bg-primary-50 dark:bg-primary-900/20",
    },
    {
        title: "জনপ্রিয় গান",
        icon: Music,
        items: [
            { name: "সকালের গান", description: "নতুন দিনের আশা ও আনন্দের গান" },
            { name: "দেশের গান", description: "মাতৃভূমির প্রতি ভালোবাসার প্রকাশ" },
        ],
        href: "/songs",
        color: "from-gold-500 to-gold-700",
        bgColor: "bg-gold-50 dark:bg-gold-900/20",
    },
    {
        title: "উল্লেখযোগ্য গ্রন্থ",
        icon: PenTool,
        items: [
            { name: "কাব্যগ্রন্থ - প্রারম্ভিক রচনা", description: "কবির প্রথম কাব্যগ্রন্থ" },
            { name: "স্বপ্নের দেশ - কাব্যসংগ্রহ", description: "পরিপক্ব বয়সের শ্রেষ্ঠ কবিতা" },
        ],
        href: "/books",
        color: "from-primary-600 to-gold-600",
        bgColor: "bg-cream-100 dark:bg-gray-800",
    },
];

export function WorksGrid() {
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

                            {/* Title */}
                            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                {category.title}
                            </h3>

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

                            {/* Title */}
                            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                {category.title}
                            </h3>

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
