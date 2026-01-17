"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Play, Music, Mic, Disc, Clock, Headphones, ExternalLink, LayoutGrid, List, Search } from "lucide-react";

// Helper to convert English numbers to Bengali
const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

interface AudioTrack {
    id: string;
    title: string;
    slug: string;
    artist: string;
    album?: string;
    duration: string;
    audioUrl: string;
    coverImage: string;
    views: number;
    category: string;
    featured?: boolean;
}

interface Album {
    id: string;
    title: string;
    slug: string;
    artist: string;
    cover: string;
    year: string;
    trackCount: number;
}

const categories = [
    { value: "all", label: "সবগুলো" },
    { value: "song", label: "গান" },
    { value: "speech", label: "বক্তব্য" },
    { value: "recitation", label: "আবৃত্তি" }
];

export default function AudioClient({ audioTracks }: { audioTracks: AudioTrack[] }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    // Derive albums from tracks (since we don't have a separate Album model yet)
    // Group by album name
    const albumMap = new Map<string, Album>();
    audioTracks.forEach(track => {
        if (track.album) {
            if (!albumMap.has(track.album)) {
                albumMap.set(track.album, {
                    id: track.album, // Use name as ID for now
                    title: track.album,
                    slug: track.album.toLowerCase().replace(/\s+/g, '-'), // Simple slugify
                    artist: track.artist,
                    cover: track.coverImage,
                    year: "Various", // DB doesn't have album year strictly
                    trackCount: 0
                });
            }
            const album = albumMap.get(track.album)!;
            album.trackCount++;
        }
    });
    const albums = Array.from(albumMap.values());

    const filteredTracks = audioTracks.filter(track => {
        const matchesCategory = selectedCategory === "all" || track.category === selectedCategory;
        const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (track.album && track.album.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "song": return Music;
            case "speech": return Mic;
            case "recitation": return Disc;
            default: return Headphones;
        }
    };

    const getCategoryLabel = (category: string) => {
        const cat = categories.find(c => c.value === category);
        return cat ? cat.label : "অডিও";
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
                                <Headphones className="w-4 h-4" />
                                <span>অডিও আর্কাইভ</span>
                            </div>
                            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
                                অডিও সংগ্রহ
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                কবি মতিউর রহমান মল্লিকের গান, বক্তব্য ও আবৃত্তির অডিও সংকলন
                            </p>

                            {/* Stats */}
                            <div className="flex justify-center gap-8 mt-10">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">{toBengaliNumber(albums.length)}</div>
                                    <div className="text-gray-400 text-sm">অ্যালবাম</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">{toBengaliNumber(audioTracks.length)}</div>
                                    <div className="text-gray-400 text-sm">ট্র্যাক</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">{toBengaliNumber(categories.length - 1)}+</div>
                                    <div className="text-gray-400 text-sm">ক্যাটাগরি</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Albums Section (Only show if there are albums) */}
                {albums.length > 0 && (
                    <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
                        <div className="container-custom">
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <Disc className="w-7 h-7 text-primary-600" />
                                অ্যালবাম সমূহ
                            </h2>

                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:pb-0 scrollbar-hide">
                                {albums.map((album) => (
                                    <Link
                                        href={`/audio?search=${album.title}`} // Temporary link to filter by album since no album page yet
                                        key={album.id}
                                        className="group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-100/30 dark:hover:shadow-none transition-all block min-w-[260px] sm:min-w-0 snap-center"
                                    >
                                        <div className="relative aspect-square overflow-hidden">
                                            <Image
                                                src={album.cover}
                                                alt={album.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center shadow-lg">
                                                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                {album.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                {album.artist}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span>{album.year}</span>
                                                <span>{toBengaliNumber(album.trackCount)} ট্র্যাক</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Audio Tracks Section */}
                <section className="py-12 md:py-16">
                    <div className="container-custom">
                        <div className="space-y-6 mb-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <Music className="w-7 h-7 text-primary-600" />
                                    অডিও ট্র্যাক
                                </h2>

                                {/* Search Bar */}
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="ট্র্যাক বা অ্যালবাম খুঁজুন..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                {/* Category Filter */}
                                <div className="flex overflow-x-auto gap-2 scrollbar-hide pb-1 flex-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => setSelectedCategory(cat.value)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.value
                                                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {/* View Toggle */}
                                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-md transition-all ${viewMode === "grid"
                                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400 shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                        aria-label="Grid view"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-md transition-all ${viewMode === "list"
                                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400 shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                        aria-label="List view"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Track List/Grid */}
                        {viewMode === "grid" ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredTracks.map((track) => {
                                    const CategoryIcon = getCategoryIcon(track.category);
                                    return (
                                        <Link
                                            href={`/audio/${track.slug}`}
                                            key={track.id}
                                            className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-100/20 dark:hover:shadow-none transition-all hover:-translate-y-1"
                                        >
                                            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                <Image
                                                    src={track.coverImage}
                                                    alt={track.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-medium rounded-full flex items-center gap-1.5 border border-white/10">
                                                        <Clock className="w-3 h-3" />
                                                        {track.duration}
                                                    </span>
                                                </div>
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium rounded-full">
                                                        <CategoryIcon className="w-3 h-3" />
                                                        {getCategoryLabel(track.category)}
                                                    </span>
                                                    {track.featured && (
                                                        <span className="text-[10px] font-medium text-gold-500">
                                                            জনপ্রিয়
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors" title={track.title}>
                                                    {track.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    {track.album || track.artist}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                {filteredTracks.map((track, index) => {
                                    const CategoryIcon = getCategoryIcon(track.category);
                                    return (
                                        <Link
                                            href={`/audio/${track.slug}`}
                                            key={track.id}
                                            className={`group flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${index !== filteredTracks.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600">
                                                <Play className="w-4 h-4 ml-0.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium truncate text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                        {track.title}
                                                    </h3>
                                                    {track.featured && (
                                                        <span className="px-2 py-0.5 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 text-xs font-medium rounded">
                                                            জনপ্রিয়
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {track.album || track.artist}
                                                </p>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-400">
                                                <CategoryIcon className="w-4 h-4" />
                                                <span>{getCategoryLabel(track.category)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>{track.duration}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredTracks.length === 0 && (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl">
                                <Headphones className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                                    এই ক্যাটাগরিতে কোনো অডিও নেই
                                </h3>
                            </div>
                        )}
                    </div>
                </section>

                {/* Streaming CTA */}
                <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
                    <div className="container-custom">
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="inline-block bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 md:p-12 border border-primary-100 dark:border-gray-700">
                                <Music className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    স্ট্রিমিং প্ল্যাটফর্মে শুনুন
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Spotify, Apple Music, YouTube Music সহ সকল জনপ্রিয় প্ল্যাটফর্মে কবি মল্লিকের গান পাওয়া যায়।
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <a
                                        href="https://open.spotify.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] hover:bg-[#1aa34a] text-white rounded-full font-medium transition-all text-sm"
                                    >
                                        <span>Spotify</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="https://music.apple.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FC3C44] hover:bg-[#e5363d] text-white rounded-full font-medium transition-all text-sm"
                                    >
                                        <span>Apple Music</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="https://music.youtube.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] hover:bg-[#e60000] text-white rounded-full font-medium transition-all text-sm"
                                    >
                                        <span>YouTube Music</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
