"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Play, Calendar, Clock, Eye, Share2, ArrowLeft, Youtube, ExternalLink } from "lucide-react";
// import { Video, toBengaliNumber } from "@/data/videos";

interface Video {
    id: string;
    title: string;
    slug: string;
    description: string;
    youtubeId: string;
    thumbnail: string;
    duration: string;
    views: number;
    category: string;
    year: string;
    featured: boolean;
}

interface VideoDetailClientProps {
    video: Video;
    relatedVideos: Video[];
}

const toBengaliNumber = (num: number): string => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");
};

export default function VideoDetailClient({ video, relatedVideos }: VideoDetailClientProps) {
    const [isPlaying, setIsPlaying] = useState(false);

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
                {/* Hero / Video Section */}
                <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/40 rounded-full blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-900/20 rounded-full blur-3xl opacity-50" />
                    </div>

                    <div className="container-custom relative z-10">
                        {/* Breadcrumb / Back Navigation */}
                        <div className="mb-8">
                            <Link
                                href="/videos"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>সব ভিডিও</span>
                            </Link>
                        </div>

                        {/* Video Player Container */}
                        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/20 ring-1 ring-white/10 aspect-video w-full max-w-5xl mx-auto relative group">
                            {!isPlaying ? (
                                <div
                                    className="absolute inset-0 cursor-pointer"
                                    onClick={() => setIsPlaying(true)}
                                >
                                    <Image
                                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                        alt={video.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 text-white text-sm font-medium rounded">
                                        {video.duration}
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            )}
                        </div>
                    </div>
                </section>

                {/* Video Info Section */}
                <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                    <div className="container-custom max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Main Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400 rounded-full text-xs font-semibold">
                                        {video.category === 'song' ? 'গান' : video.category === 'documentary' ? 'ডকুমেন্টারি' : video.category === 'performance' ? 'পারফর্মেন্স' : 'সাক্ষাৎকার'}
                                    </span>
                                    {video.year && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {video.year}
                                        </span>
                                    )}
                                </div>

                                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                    {video.title}
                                </h1>

                                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                    <p className="whitespace-pre-line">{video.description}</p>
                                </div>

                                {/* Share Actions */}
                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            // Optional: Add toast notification here
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span>শেয়ার করুন</span>
                                    </button>
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <Youtube className="w-4 h-4" />
                                        <span>YouTube এ দেখুন</span>
                                        <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                                    </a>
                                </div>
                            </div>

                            {/* Sidebar Stats */}
                            <div className="lg:w-80 space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">ভিডিও পরিসংখ্যান</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <Eye className="w-4 h-4" />
                                                <span>ভিউ</span>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatViews(video.views)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>দৈর্ঘ্য</span>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {video.duration}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>প্রকাশকাল</span>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {video.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Videos */}
                <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-950">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                আরও ভিডিও
                            </h2>
                            <Link href="/videos" className="text-primary-600 dark:text-gold-400 font-medium hover:underline">
                                সবগুলো দেখুন
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedVideos.map((relatedVideo) => (
                                <Link
                                    key={relatedVideo.id}
                                    href={`/videos/${relatedVideo.slug}`}
                                    className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all"
                                >
                                    <div className="relative aspect-video">
                                        <Image
                                            src={relatedVideo.thumbnail}
                                            alt={relatedVideo.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                                            {relatedVideo.duration}
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary-600/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                                            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                            {relatedVideo.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {formatViews(relatedVideo.views)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {relatedVideo.duration}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
