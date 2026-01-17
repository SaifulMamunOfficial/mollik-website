import Link from "next/link";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

// Sample blog data
const recentPosts = [
    {
        id: 1,
        title: "জন্মবার্ষিকী উদযাপন ও সাংস্কৃতিক সন্ধ্যা",
        excerpt: "আজ মহান কবি মতিউর রহমান মল্লিকের ৭৫তম জন্মবার্ষিকী উপলক্ষে বিশেষ সাংস্কৃতিক সন্ধ্যার আয়োজন করা হয়েছে...",
        date: "১৫ মার্চ ২০২৩",
        category: "সংবাদ",
        author: "সাংস্কৃতিক ডেস্ক",
        readTime: "৫ মিনিট",
    },
    {
        id: 2,
        title: "নতুন কাব্যগ্রন্থ 'স্মৃতির পাতা' প্রকাশিত",
        excerpt: "কবির অপ্রকাশিত কবিতাগুলো নিয়ে নতুন সংকলন 'স্মৃতির পাতা' এবারের বইমেলায় প্রকাশিত হয়েছে।",
        date: "২০ ফেব্রুয়ারি ২০২৩",
        category: "প্রকাশনা",
        author: "সম্পাদক",
        readTime: "৩ মিনিট",
    },
    {
        id: 3,
        title: "কবির প্রিয় স্থানগুলো: একটি ভ্রমণ কাহিনী",
        excerpt: "কবি যেসব স্থানে ভ্রমণ করেছিলেন এবং যেসব স্থান থেকে তিনি তার কবিতার অনুপ্রেরণা পেয়েছিলেন...",
        date: "১০ জানুয়ারি ২০২৩",
        category: "ভ্রমণ",
        author: "ভ্রমণ ডেস্ক",
        readTime: "৮ মিনিট",
    },
];

export function RecentBlog() {
    return (
        <section className="section bg-gradient-to-b from-white to-cream-50 dark:from-gray-950 dark:to-gray-900">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1 w-10 bg-gold-500 rounded-full"></span>
                            <span className="text-gold-600 dark:text-gold-400 font-medium text-sm tracking-wider uppercase">আপডেট</span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            সাম্প্রতিক খবর ও লেখা
                        </h2>
                    </div>

                    <Link
                        href="/blog"
                        className="group hidden md:inline-flex items-center gap-2 text-primary-600 dark:text-gray-300 hover:text-primary-800 dark:hover:text-gold-400 font-medium transition-colors"
                    >
                        সব খবর দেখুন
                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-gold-900/20 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:hidden">
                    {recentPosts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="group flex flex-col flex-shrink-0 w-[280px] h-auto bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gold-400/50 dark:hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 snap-start"
                        >
                            {/* Image Placeholder area */}
                            <div className="relative h-44 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-primary-600 to-primary-800' :
                                    index === 1 ? 'from-gold-600 to-gold-800' :
                                        'from-gray-600 to-gray-800'
                                    } opacity-90 group-hover:scale-105 transition-transform duration-500`} />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-medium">
                                        <Tag className="w-3 h-3" />
                                        {post.category}
                                    </span>
                                </div>

                                {/* Date overlay on image (Modern style) */}
                                <div className="absolute bottom-4 left-4 text-white/90 text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow p-5">
                                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-gold-400 leading-tight transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <User className="w-4 h-4 text-gold-500" />
                                        {post.author}
                                    </div>
                                    <span className="text-xs font-medium text-primary-600 dark:text-gold-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                        পড়ুন <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* See More Card - Mobile */}
                    <Link
                        href="/blog"
                        className="flex-shrink-0 w-[180px] bg-gradient-to-br from-primary-50 to-gold-50 dark:from-primary-900/30 dark:to-gold-900/30 rounded-2xl p-6 border border-primary-200 dark:border-primary-700 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform snap-start"
                    >
                        <div className="w-14 h-14 rounded-full bg-primary-600 dark:bg-gold-500 flex items-center justify-center">
                            <ArrowRight className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-display font-semibold text-primary-700 dark:text-gold-400 text-center text-sm">
                            আরো দেখুন
                        </span>
                    </Link>
                </div>

                {/* Desktop: Blog Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentPosts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="group flex flex-col h-full bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gold-400/50 dark:hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300"
                        >
                            {/* Image Placeholder area */}
                            <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-primary-600 to-primary-800' :
                                    index === 1 ? 'from-gold-600 to-gold-800' :
                                        'from-gray-600 to-gray-800'
                                    } opacity-90 group-hover:scale-105 transition-transform duration-500`} />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-medium">
                                        <Tag className="w-3 h-3" />
                                        {post.category}
                                    </span>
                                </div>

                                {/* Date overlay on image (Modern style) */}
                                <div className="absolute bottom-4 left-4 text-white/90 text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow p-6 md:p-8">
                                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-gold-400 leading-tight transition-colors">
                                    {post.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <User className="w-4 h-4 text-gold-500" />
                                        {post.author}
                                    </div>
                                    <span className="text-xs font-medium text-primary-600 dark:text-gold-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                        পড়ুন <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
