import Link from "next/link";
import { Quote, ArrowRight, Calendar } from "lucide-react";

const tributes = [
    {
        id: 1,
        author: "ড. আনিসুজ্জামান",
        title: "শিক্ষাবিদ ও সাহিত্যিক",
        content: "মতিউর রহমান মল্লিকের মৃত্যুতে বাংলা সাহিত্য একজন প্রকৃত কবিকে হারাল। তিনি শুধু কবিতা লিখতেন না, তিনি জীবনকে কবিতায় রূপ দিতেন।",
        date: "১৩ আগস্ট ২০১০",
    },
    {
        id: 2,
        author: "হাসান আজিজুল হক",
        title: "কথাসাহিত্যিক",
        content: "একজন নিভৃতচারী কবি চলে গেলেন। মতিউর রহমান মল্লিকের কবিতা ছিল প্রকৃতি ও মানুষের প্রতি অকৃত্রিম ভালোবাসার বহিঃপ্রকাশ।",
        date: "১৪ আগস্ট ২০১০",
    },
    {
        id: 3,
        author: "বাংলাদেশ লেখক সংঘ",
        title: "সাহিত্য সংগঠন",
        content: "আমাদের প্রিয় সদস্য কবি মতিউর রহমান মল্লিকের আকস্মিক মৃত্যুতে আমরা গভীরভাবে শোকাহত। তিনি ছিলেন একজন আদর্শবান কবি।",
        date: "১৫ আগস্ট ২০১০",
    },
];

export function TributeSection() {
    return (
        <section className="section bg-white dark:bg-gray-950">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            শোকবার্তা
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            কবির মৃত্যুতে বিভিন্ন গুণী ব্যক্তি ও সংগঠনের শ্রদ্ধাঞ্জলি
                        </p>
                    </div>
                    <Link
                        href="/tributes"
                        className="hidden md:inline-flex items-center gap-2 mt-4 md:mt-0 text-primary-600 dark:text-gold-400 hover:text-primary-700 dark:hover:text-gold-300 font-medium transition-colors"
                    >
                        আরো শ্রদ্ধাঞ্জলি দেখুন
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:hidden">
                    {tributes.map((tribute) => (
                        <div
                            key={tribute.id}
                            className="relative flex-shrink-0 w-[280px] bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-l-4 border-gray-400 hover:border-gold-500 transition-colors snap-start"
                        >
                            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <Quote className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </div>

                            <div className="mb-4">
                                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                                    {tribute.author}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                    {tribute.title}
                                </p>
                            </div>

                            <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic text-sm line-clamp-4">
                                "{tribute.content}"
                            </blockquote>

                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <Calendar className="w-3 h-3" />
                                {tribute.date}
                            </div>
                        </div>
                    ))}

                    {/* See More Card - Mobile */}
                    <Link
                        href="/tributes"
                        className="flex-shrink-0 w-[160px] bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform snap-start"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary-600 dark:bg-gold-500 flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display font-semibold text-primary-700 dark:text-gold-400 text-center text-sm">
                            আরো দেখুন
                        </span>
                    </Link>
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {tributes.map((tribute) => (
                        <div
                            key={tribute.id}
                            className="relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-l-4 border-gray-400 hover:border-gold-500 transition-colors"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <Quote className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>

                            {/* Author Info */}
                            <div className="mb-4">
                                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                                    {tribute.author}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                    {tribute.title}
                                </p>
                            </div>

                            {/* Content */}
                            <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                                "{tribute.content}"
                            </blockquote>

                            {/* Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <Calendar className="w-4 h-4" />
                                {tribute.date}
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
}
