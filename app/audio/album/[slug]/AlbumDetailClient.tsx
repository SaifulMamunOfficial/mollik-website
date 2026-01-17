"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Play, Calendar, Clock, Share2, ArrowLeft, Disc, Music, Mic, Headphones } from "lucide-react";
// import { Album, AudioTrack, toBengaliNumber } from "@/data/audio";

interface Album {
    title: string;
    artist: string;
    cover: string;
    year: string;
    slug: string;
}

interface AudioTrack {
    id: string;
    title: string;
    slug: string;
    category: string;
    duration: string;
}

const toBengaliNumber = (num: number): string => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");
};

interface AlbumDetailClientProps {
    album: Album;
    albumTracks: AudioTrack[];
}

export default function AlbumDetailClient({ album, albumTracks }: AlbumDetailClientProps) {
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "song": return Music;
            case "speech": return Mic;
            case "recitation": return Disc;
            default: return Headphones;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case "song": return "গান";
            case "speech": return "বক্তব্য";
            case "recitation": return "আবৃত্তি";
            default: return "অডিও";
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Hero Section */}
                <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/40 rounded-full blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-900/20 rounded-full blur-3xl opacity-50" />
                    </div>

                    <div className="container-custom relative z-10">
                        <div className="mb-8">
                            <Link
                                href="/audio"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>অডিও আর্কাইভ</span>
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">
                            {/* Album Art */}
                            <div className="w-64 md:w-80 aspect-square relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex-shrink-0">
                                <Image
                                    src={album.cover}
                                    alt={album.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Album Info */}
                            <div className="flex-1 text-center md:text-left text-white">
                                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-gold-400 rounded-full text-xs font-semibold border border-white/10 mb-4">
                                    অ্যালবাম
                                </span>
                                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                    {album.title}
                                </h1>
                                <p className="text-xl text-gray-300 mb-6">
                                    শিল্পী: <span className="text-white font-medium">{album.artist}</span>
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{album.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Disc className="w-4 h-4" />
                                        <span>{toBengaliNumber(albumTracks.length)} টি ট্র্যাক</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Track List Section */}
                <section className="py-12 md:py-16">
                    <div className="container-custom max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Music className="w-6 h-6 text-primary-600" />
                                অ্যালবামের ট্র্যাকসমূহ
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                            {albumTracks.length > 0 ? (
                                albumTracks.map((track, index) => {
                                    const CategoryIcon = getCategoryIcon(track.category);
                                    return (
                                        <Link
                                            href={`/audio/${track.slug}`}
                                            key={track.id}
                                            className={`group flex items-center gap-4 p-4 md:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${index !== albumTracks.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""
                                                }`}
                                        >
                                            <span className="w-6 text-center text-sm text-gray-400 font-medium">
                                                {toBengaliNumber(index + 1)}
                                            </span>

                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600`}>
                                                <Play className="w-4 h-4 ml-0.5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors mb-1">
                                                    {track.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {track.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CategoryIcon className="w-3 h-3" />
                                                        {getCategoryLabel(track.category)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="hidden sm:block">
                                                <Share2 className="w-4 h-4 text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors" />
                                            </div>
                                        </Link>
                                    )
                                })
                            ) : (
                                <div className="text-center py-16">
                                    <Disc className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">এই অ্যালবামে কোনো ট্র্যাক পাওয়া যায়নি</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
