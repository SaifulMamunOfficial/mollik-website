"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Play, Calendar, Clock, Eye, Grid3X3, LayoutList, ExternalLink, Youtube } from "lucide-react";

// Helper to convert English numbers to Bengali
const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

interface Video {
    id: string;
    title: string;
    slug: string;
    description?: string;
    youtubeId: string;
    thumbnail: string;
    duration: string;
    views: number;
    category: string;
    featured?: boolean;
    publishedAt: string;
}

const categories = [
    { value: "all", label: "সবগুলো" },
    { value: "gojol", label: "গজল" },
    { value: "program", label: "অনুষ্ঠান" },
    { value: "interview", label: "সাক্ষাৎকার" },
    { value: "documentary", label: "প্রামাণ্যচিত্র" }
];

export default function VideosClient({ videos }: { videos: Video[] }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredVideos = selectedCategory === "all"
        ? videos
        : videos.filter(video => video.category === selectedCategory);

    const formatViews = (views: number): string => {
        if (views >= 100000) {
            return toBengaliNumber(Math.floor(views / 1000)) + "হাজার+";
        } else if (views >= 1000) {
            return toBengaliNumber(Math.floor(views / 1000)) + "হাজার";
        }
        return toBengaliNumber(views);
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Hero Section */}
                <section className="relative py-20 md:py-28 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/20 rounded-full blur-3xl" />
                    </div>

                    <div className="container-custom relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm mb-6">
                                <Play className="w-4 h-4" />
                                <span>ভিডিও আর্কাইভ</span>
                            </div>
                            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
                                ভিডিও সংগ্রহ
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                কবি মতিউর রহমান মল্লিকের গান, সাক্ষাৎকার এবং বিভিন্ন অনুষ্ঠানের দুর্লভ ভিডিও সংকলন
                            </p>

                            {/* Stats */}
                            <div className="flex justify-center gap-8 mt-10">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">{toBengaliNumber(videos.length)}+</div>
                                    <div className="text-gray-400 text-sm">ভিডিও</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">{toBengaliNumber(categories.length - 1)}</div>
                                    <div className="text-gray-400 text-sm">ক্যাটাগরি</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">৫ লক্ষ+</div>
                                    <div className="text-gray-400 text-sm">মোট ভিউ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter & Videos Section */}
                <section className="py-12 md:py-16">
                    <div className="container-custom">
                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            {/* Categories */}
                            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setSelectedCategory(cat.value)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.value
                                            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === "grid"
                                        ? "bg-white dark:bg-gray-700 shadow text-primary-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    title="গ্রিড ভিউ"
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === "list"
                                        ? "bg-white dark:bg-gray-700 shadow text-primary-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    title="লিস্ট ভিউ"
                                >
                                    <LayoutList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Videos Grid */}
                        {viewMode === "grid" ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredVideos.map((video) => (
                                    <Link
                                        key={video.id}
                                        href={`/videos/${video.slug}`}
                                        className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-100/30 dark:hover:shadow-none transition-all"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <Image
                                                src={video.thumbnail}
                                                alt={video.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
                                                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                                                </div>
                                            </div>

                                            {/* Duration Badge */}
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                                                {video.duration}
                                            </div>

                                            {/* Featured Badge */}
                                            {video.featured && (
                                                <div className="absolute top-2 left-2">
                                                    <span className="px-2 py-1 bg-gold-500 text-white text-xs font-bold rounded">
                                                        জনপ্রিয়
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                {video.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                                {video.description}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {formatViews(video.views)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(video.publishedAt).getFullYear().toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)])}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredVideos.map((video) => (
                                    <Link
                                        key={video.id}
                                        href={`/videos/${video.slug}`}
                                        className="group flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-100/30 dark:hover:shadow-none transition-all p-4"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-full md:w-64 aspect-video flex-shrink-0 rounded-xl overflow-hidden">
                                            <Image
                                                src={video.thumbnail}
                                                alt={video.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
                                                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                                                {video.duration}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                        {video.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {formatViews(video.views)} ভিউ
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(video.publishedAt).getFullYear().toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)])}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {video.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                                {video.featured && (
                                                    <span className="px-2 py-1 bg-gold-500 text-white text-xs font-bold rounded flex-shrink-0">
                                                        জনপ্রিয়
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredVideos.length === 0 && (
                            <div className="text-center py-20">
                                <Play className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                                    এই ক্যাটাগরিতে কোনো ভিডিও নেই
                                </h3>
                            </div>
                        )}

                        {/* YouTube Channel CTA */}
                        <div className="mt-16 text-center">
                            <div className="inline-block bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 md:p-12 border border-primary-100 dark:border-gray-700 max-w-2xl">
                                <Youtube className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    আরও ভিডিও দেখুন
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    সাইমুম রেকর্ডস YouTube চ্যানেলে কবি মল্লিকের সকল গান ও ভিডিও পাবেন।
                                </p>
                                <a
                                    href="https://www.youtube.com/channel/UCjINfKW8Z-y8AV4m2AzcueA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all"
                                >
                                    <Youtube className="w-5 h-5" />
                                    <span>YouTube চ্যানেল</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
