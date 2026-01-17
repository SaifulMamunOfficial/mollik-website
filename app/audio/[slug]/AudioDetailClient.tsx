"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Play, Calendar, Clock, Share2, ArrowLeft, Music, Disc, Mic, Headphones } from "lucide-react";
// import { AudioTrack } from "@/data/audio";

interface AudioTrack {
    id: string;
    title: string;
    slug: string;
    artist?: string;
    album?: string;
    duration: string;
    audioUrl: string;
    coverImage?: string;
    lyrics?: string;
    category: string;
    embedUrl?: string; // Optional for dynamic data
}

interface AudioDetailClientProps {
    track: AudioTrack;
    relatedTracks: AudioTrack[];
}

export default function AudioDetailClient({ track, relatedTracks }: AudioDetailClientProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "song": return Music;
            case "speech": return Mic;
            case "recitation": return Disc;
            default: return Headphones;
        }
    };

    const CategoryIcon = getCategoryIcon(track.category);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Hero / Player Section */}
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
                                href="/audio"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>সব অডিও</span>
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto">
                            {/* Album Art / Player Placeholder */}
                            <div className="w-full md:w-[400px] aspect-square relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group bg-gray-900">
                                {!isPlaying ? (
                                    <div
                                        className="absolute inset-0 cursor-pointer"
                                        onClick={() => setIsPlaying(true)}
                                    >
                                        <Image
                                            src={`https://picsum.photos/seed/${track.slug}/600/600`} // Placeholder art based on slug
                                            alt={track.title}
                                            fill
                                            className="object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-300"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        className="absolute inset-0 w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        src={`${track.embedUrl}?autoplay=1`}
                                        title={track.title}
                                    />
                                )}
                            </div>

                            {/* Track Info (Hero) */}
                            <div className="flex-1 text-center md:text-left text-white">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-gold-400 rounded-full text-xs font-semibold flex items-center gap-2 border border-white/10">
                                        <CategoryIcon className="w-3 h-3" />
                                        {track.category === 'song' ? 'গান' : track.category === 'speech' ? 'বক্তব্য' : 'আবৃত্তি'}
                                    </span>
                                </div>

                                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    {track.title}
                                </h1>

                                <p className="text-xl text-gray-300 mb-6">
                                    অ্যালবাম: <span className="text-white font-medium">{track.album}</span>
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{track.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>২০০৫</span> {/* Static year for now */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lyrics / Info Section */}
                <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                    <div className="container-custom max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-12">
                            {/* Main Content */}
                            <div className="flex-1">
                                {track.lyrics && (
                                    <div className="mb-10">
                                        <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                            গানের কথা
                                        </h3>
                                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line font-bengali">
                                            {track.lyrics}
                                        </div>
                                    </div>
                                )}

                                {/* Share Actions */}
                                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        <span>শেয়ার করুন</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Tracks */}
                <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-950">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                আরও শুনুন
                            </h2>
                            <Link href="/audio" className="text-primary-600 dark:text-gold-400 font-medium hover:underline">
                                সবগুলো দেখুন
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedTracks.map((relatedTrack) => (
                                <Link
                                    key={relatedTrack.id}
                                    href={`/audio/${relatedTrack.slug}`}
                                    className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all p-4 flex items-center gap-4"
                                >
                                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                        <Image
                                            src={`https://picsum.photos/seed/${relatedTrack.slug}/200/200`}
                                            alt={relatedTrack.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform">
                                                <Play className="w-3 h-3 text-primary-600 ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                            {relatedTrack.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
                                            {relatedTrack.album}
                                        </p>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {relatedTrack.duration}
                                        </span>
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
