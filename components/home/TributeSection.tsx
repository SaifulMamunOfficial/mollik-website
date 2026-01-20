import Link from "next/link";
import { Quote, ArrowRight, Calendar } from "lucide-react";
import type { FeaturedTribute } from "@/types/home";

interface TributeSectionProps {
    tributes: FeaturedTribute[];
}

// Sample data for fallback
const sampleTributes: FeaturedTribute[] = [
    {
        id: "1",
        content: "মতিউর রহমান মল্লিকের মৃত্যুতে বাংলা সাহিত্য একজন প্রকৃত কবিকে হারাল। তিনি শুধু কবিতা লিখতেন না, তিনি জীবনকে কবিতায় রূপ দিতেন।",
        name: "ড. আনিসুজ্জামান",
        designation: "শিক্ষাবিদ ও সাহিত্যিক",
        district: null,
        displayOption: "DESIGNATION",
        createdAt: new Date("2010-08-13"),
        author: { name: null },
    },
    {
        id: "2",
        content: "একজন নিভৃতচারী কবি চলে গেলেন। মতিউর রহমান মল্লিকের কবিতা ছিল প্রকৃতি ও মানুষের প্রতি অকৃত্রিম ভালোবাসার বহিঃপ্রকাশ।",
        name: "হাসান আজিজুল হক",
        designation: "কথাসাহিত্যিক",
        district: null,
        displayOption: "DESIGNATION",
        createdAt: new Date("2010-08-14"),
        author: { name: null },
    },
    {
        id: "3",
        content: "আমাদের প্রিয় সদস্য কবি মতিউর রহমান মল্লিকের আকস্মিক মৃত্যুতে আমরা গভীরভাবে শোকাহত। তিনি ছিলেন একজন আদর্শবান কবি।",
        name: "বাংলাদেশ লেখক সংঘ",
        designation: "সাহিত্য সংগঠন",
        district: null,
        displayOption: "DESIGNATION",
        createdAt: new Date("2010-08-15"),
        author: { name: null },
    },
];

// Format date to Bengali
function formatDateBengali(date: Date): string {
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

    const d = date.getDate().toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');
    const m = months[date.getMonth()];
    const y = date.getFullYear().toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');

    return `${d} ${m} ${y}`;
}

export function TributeSection({ tributes }: TributeSectionProps) {
    const displayTributes = tributes.length > 0 ? tributes : sampleTributes;

    // Get author display name and title
    const getAuthorInfo = (tribute: FeaturedTribute) => {
        const name = tribute.name || tribute.author?.name || "অজানা";
        const title = tribute.displayOption === "DESIGNATION"
            ? tribute.designation
            : tribute.district;
        return { name, title: title || "" };
    };

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
                            কবির মৃত্যুতে বিভিন্ন গুণী ব্যক্তি ও সংগঠনের শোকবার্তা
                        </p>
                    </div>
                    <Link
                        href="/tributes"
                        className="hidden md:inline-flex items-center gap-2 mt-4 md:mt-0 text-primary-600 dark:text-gold-400 hover:text-primary-700 dark:hover:text-gold-300 font-medium transition-colors"
                    >
                        আরো শোকবার্তা দেখুন
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:hidden">
                    {displayTributes.map((tribute) => {
                        const { name, title } = getAuthorInfo(tribute);
                        return (
                            <div
                                key={tribute.id}
                                className="relative flex-shrink-0 w-[280px] bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-l-4 border-gray-400 hover:border-gold-500 transition-colors snap-start flex flex-col h-full min-h-[280px]"
                            >
                                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                    <Quote className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                                        {name}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                        {title}
                                    </p>
                                </div>

                                <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-sm line-clamp-4 flex-grow">
                                    &quot;{tribute.content}&quot;
                                </blockquote>

                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                                    <Calendar className="w-3 h-3" />
                                    {formatDateBengali(new Date(tribute.createdAt))}
                                </div>
                            </div>
                        );
                    })}

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
                    {displayTributes.map((tribute) => {
                        const { name, title } = getAuthorInfo(tribute);
                        return (
                            <div
                                key={tribute.id}
                                className="relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-l-4 border-gray-400 hover:border-gold-500 transition-colors flex flex-col h-full"
                            >
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </div>

                                {/* Author Info */}
                                <div className="mb-4">
                                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                                        {name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                        {title}
                                    </p>
                                </div>

                                {/* Content */}
                                <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed italic flex-grow">
                                    &quot;{tribute.content}&quot;
                                </blockquote>

                                {/* Date */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateBengali(new Date(tribute.createdAt))}
                                </div>
                            </div>
                        );
                    })}
                </div>


            </div>
        </section>
    );
}
