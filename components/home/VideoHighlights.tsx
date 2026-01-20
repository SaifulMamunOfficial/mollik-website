"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Clock, Eye, Youtube } from "lucide-react";
import type { FeaturedVideo } from "@/types/home";

interface VideoHighlightsProps {
    videos: FeaturedVideo[];
}

// Sample data for fallback
const sampleVideos: FeaturedVideo[] = [
    {
        id: "1",
        slug: "interview-btv",
        title: "কবি মতিউর রহমান মল্লিকের সাক্ষাৎকার",
        description: "বাংলাদেশ টেলিভিশনে প্রচারিত বিশেষ সাক্ষাৎকার",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: null,
        duration: "২৫:৩০",
        views: 12500,
        category: "সাক্ষাৎকার",
    },
    {
        id: "2",
        slug: "poetry-recital",
        title: "কবিতা পাঠের আসর - প্রভাতের আলো",
        description: "জাতীয় কবিতা উৎসবে কবির নিজ কণ্ঠে কবিতা পাঠ",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: null,
        duration: "১২:৪৫",
        views: 8200,
        category: "কবিতা পাঠ",
    },
    {
        id: "3",
        slug: "memorial-2023",
        title: "স্মরণ অনুষ্ঠান ২০২৩",
        description: "কবির ১৩তম মৃত্যুবার্ষিকী উপলক্ষে আয়োজিত স্মরণসভা",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: null,
        duration: "৪৫:২০",
        views: 5700,
        category: "স্মরণ অনুষ্ঠান",
    },
];

// Helper to convert number to Bengali
function toBengaliViews(num: number): string {
    if (num >= 1000) {
        const k = (num / 1000).toFixed(1);
        return `${k}K`;
    }
    return num.toString();
}

export function VideoHighlights({ videos }: VideoHighlightsProps) {
    const displayVideos = videos.length > 0 ? videos : sampleVideos;

    // Get YouTube thumbnail URL
    const getThumbnail = (video: FeaturedVideo) => {
        if (video.thumbnail) return video.thumbnail;
        return `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
    };

    return (
        <section className="section bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Youtube className="w-5 h-5 text-red-500" />
                            <span className="text-red-400 font-medium text-sm tracking-wider uppercase">
                                ভিডিও আর্কাইভ
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold">
                            ভিডিও হাইলাইট
                        </h2>
                    </div>
                    <Link
                        href="/videos"
                        className="hidden md:inline-flex items-center gap-2 mt-4 md:mt-0 text-gold-400 hover:text-gold-300 font-medium transition-colors"
                    >
                        সব ভিডিও দেখুন
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:hidden">
                    {displayVideos.map((video) => (
                        <Link
                            key={video.id}
                            href={`/videos/${video.slug}`}
                            className="group flex-shrink-0 w-[280px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden snap-start hover:bg-white/10 transition-colors"
                        >
                            {/* Thumbnail Container */}
                            <div className="relative aspect-video bg-gradient-to-br from-primary-800 via-gray-800 to-gray-900 overflow-hidden">
                                <Image
                                    src={getThumbnail(video)}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold-500 group-hover:scale-110 transition-all duration-300 shadow-xl">
                                        <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                                    </div>
                                </div>

                                {/* Duration Badge */}
                                {video.duration && (
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-medium flex items-center gap-1 text-white z-10">
                                        <Clock className="w-2.5 h-2.5" />
                                        {video.duration}
                                    </div>
                                )}

                                {/* Type Badge */}
                                {video.category && (
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-gold-500/90 backdrop-blur-sm rounded text-[10px] font-bold text-gray-900 z-10">
                                        {video.category}
                                    </div>
                                )}
                            </div>

                            {/* Content Below Thumbnail */}
                            <div className="p-4">
                                <h3 className="font-display font-bold text-white text-base mb-2 group-hover:text-gold-400 transition-colors line-clamp-2 min-h-[3rem]">
                                    {video.title}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {toBengaliViews(video.views)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* See More Card - Mobile */}
                    <Link
                        href="/videos"
                        className="flex-shrink-0 w-[180px] bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gold-500/30 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform snap-start"
                    >
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                            <ArrowRight className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-display font-semibold text-gold-400 text-center text-sm">
                            আরো দেখুন
                        </span>
                    </Link>
                </div>

                {/* Desktop: Video Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {displayVideos.map((video, index) => (
                        <Link
                            key={video.id}
                            href={`/videos/${video.slug}`}
                            className={`group relative rounded-2xl overflow-hidden ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                        >
                            {/* Thumbnail */}
                            <div className={`${index === 0 ? 'aspect-video md:aspect-[16/10]' : 'aspect-video'} relative bg-gradient-to-br from-primary-800 via-gray-800 to-gray-900`}>
                                <Image
                                    src={getThumbnail(video)}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold-500 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                        <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                            {/* Duration Badge */}
                            {video.duration && (
                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {video.duration}
                                </div>
                            )}

                            {/* Type Badge */}
                            {video.category && (
                                <div className="absolute top-3 left-3 px-2 py-1 bg-gold-500/90 backdrop-blur-sm rounded text-xs font-medium text-gray-900">
                                    {video.category}
                                </div>
                            )}

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <h3 className={`font-display font-bold text-white mb-2 group-hover:text-gold-400 transition-colors ${index === 0 ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                                    {video.title}
                                </h3>
                                {index === 0 && video.description && (
                                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                        {video.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {toBengaliViews(video.views)} ভিউ
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* YouTube Channel CTA */}
                <div className="mt-10 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                            <Youtube className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-lg">ইউটিউব চ্যানেল সাবস্ক্রাইব করুন</h4>
                            <p className="text-gray-400 text-sm">নতুন ভিডিও আপলোড হলে নোটিফিকেশন পাবেন</p>
                        </div>
                    </div>
                    <a
                        href="https://youtube.com/@motiurrahmanmollik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors flex items-center gap-2"
                    >
                        সাবস্ক্রাইব করুন
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
