import Link from "next/link";
import { ArrowRight, Award, Trophy, Medal, Star, Calendar } from "lucide-react";

// Award can be either a string or an object
type AwardItem = string | {
    id?: number;
    title: string;
    year?: string;
    category?: string;
    description?: string;
    featured?: boolean;
};

interface AwardsSectionProps {
    awards: AwardItem[];
}

// Normalize award to object format
function normalizeAward(award: AwardItem, index: number): {
    id: number;
    title: string;
    year: string;
    category: string;
    description: string;
    featured: boolean;
} {
    if (typeof award === 'string') {
        return {
            id: index + 1,
            title: award,
            year: "",
            category: "সাহিত্য",
            description: "",
            featured: index < 2, // First 2 are featured
        };
    }
    return {
        id: award.id || index + 1,
        title: award.title,
        year: award.year || "",
        category: award.category || "সাহিত্য",
        description: award.description || "",
        featured: award.featured ?? index < 2,
    };
}

export function AwardsSection({ awards }: AwardsSectionProps) {
    // Use sample data if no awards from DB
    const displayAwards = awards.length > 0 ? awards.map((a, i) => normalizeAward(a, i)) : [
        {
            id: 1,
            title: "জাতীয় সাহিত্য পরিষদ স্বর্ণপদক",
            year: "",
            category: "সাহিত্য",
            description: "বাংলা সাহিত্যে অসামান্য অবদানের জন্য",
            featured: true,
        },
        {
            id: 2,
            title: "প্যারিস সাহিত্য পুরস্কার (ফ্রান্স)",
            year: "২০০২",
            category: "আন্তর্জাতিক",
            description: "বাংলা সাহিত্য ও সংস্কৃতি পরিষদ- ফ্রান্স থেকে সম্মাননা",
            featured: true,
        },
        {
            id: 3,
            title: "কলমসেনা সাহিত্য পুরস্কার",
            year: "",
            category: "সাহিত্য",
            description: "",
            featured: false,
        },
        {
            id: 4,
            title: "বায়তুশ শরফ সাহিত্য পুরস্কার",
            year: "",
            category: "সাহিত্য",
            description: "",
            featured: false,
        },
    ];

    // Get icon based on index or featured status
    const getIcon = (index: number, featured: boolean) => {
        if (featured) return index === 0 ? Medal : Award;
        return index % 2 === 0 ? Trophy : Star;
    };

    const featuredAwards = displayAwards.filter(a => a.featured);
    const otherAwards = displayAwards.filter(a => !a.featured);

    return (
        <section className="section bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 dark:bg-gold-900/30 rounded-full mb-4">
                        <Trophy className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                        <span className="text-gold-700 dark:text-gold-400 font-medium text-sm">
                            সম্মান ও স্বীকৃতি
                        </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        পুরস্কার ও সম্মাননা
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        সাহিত্য ও সংস্কৃতিতে অসামান্য অবদানের জন্য কবি যেসব সম্মাননা অর্জন করেছেন
                    </p>
                </div>

                {/* Mobile: Horizontal Scroll (All Awards) */}
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory md:hidden -mx-4 px-4 mb-2">
                    {displayAwards.map((award, index) => {
                        const IconComponent = getIcon(index, award.featured);
                        return (
                            <div
                                key={award.id}
                                className={`flex-shrink-0 w-[280px] rounded-3xl p-6 border transition-all snap-start ${award.featured
                                    ? 'bg-gradient-to-br from-gold-50 via-white to-primary-50 dark:from-gold-900/20 dark:via-gray-800 dark:to-primary-900/20 border-gold-200 dark:border-gold-800/50'
                                    : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${award.featured
                                        ? 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/25'
                                        : 'bg-primary-100 dark:bg-primary-900/30'
                                        }`}>
                                        <IconComponent className={`w-6 h-6 ${award.featured ? 'text-white' : 'text-primary-600 dark:text-gold-400'}`} />
                                    </div>
                                    <div>
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${award.featured
                                            ? 'bg-gold-500 text-gray-900'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            {award.category}
                                        </span>
                                        {award.year && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {award.year}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {award.title}
                                </h3>
                                {award.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                        {award.description}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    {/* View All Card - Mobile */}
                    <Link
                        href="/biography#awards"
                        className="flex-shrink-0 w-[160px] bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-4 snap-start"
                    >
                        <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-gray-900" />
                        </div>
                        <span className="font-display font-semibold text-gray-900 dark:text-white text-center text-sm">
                            সব সম্মাননা
                        </span>
                    </Link>
                </div>

                {/* Desktop: Featured Awards */}
                <div className="hidden md:grid md:grid-cols-2 gap-6 mb-8">
                    {featuredAwards.slice(0, 2).map((award, index) => {
                        const IconComponent = getIcon(index, true);
                        return (
                            <div
                                key={award.id}
                                className="group relative bg-gradient-to-br from-gold-50 via-white to-primary-50 dark:from-gold-900/20 dark:via-gray-800 dark:to-primary-900/20 rounded-3xl p-8 border border-gold-200 dark:border-gold-800/50 hover:border-gold-400 dark:hover:border-gold-600 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10"
                            >
                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold-500/10 rounded-full" />
                                </div>

                                <div className="flex items-start gap-6">
                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/25 group-hover:scale-110 transition-transform">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-gold-500 text-gray-900 text-xs font-bold rounded-full">
                                                {award.category}
                                            </span>
                                            {award.year && (
                                                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {award.year}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-display text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                                            {award.title}
                                        </h3>
                                        {award.description && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                {award.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Desktop: Other Awards */}
                <div className="hidden md:flex flex-wrap justify-center gap-4">
                    {otherAwards.map((award, index) => {
                        const IconComponent = getIcon(index, false);
                        return (
                            <div
                                key={award.id}
                                className="group bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-gold-400 dark:hover:border-gold-500/50 transition-all duration-300 hover:shadow-lg w-full sm:w-[calc(50%-0.5rem)] lg:w-[280px]"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-gold-100 dark:group-hover:bg-gold-900/30 transition-colors">
                                        <IconComponent className="w-5 h-5 text-primary-600 dark:text-gold-400 group-hover:text-gold-600" />
                                    </div>
                                    {award.year && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            {award.year}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-display font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                                    {award.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {award.category}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* View All Link - Desktop Only */}
                <div className="hidden md:block text-center mt-10">
                    <Link
                        href="/biography#awards"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 font-medium hover:border-gold-400 dark:hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-all shadow-sm hover:shadow-md"
                    >
                        সব সম্মাননা দেখুন
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
