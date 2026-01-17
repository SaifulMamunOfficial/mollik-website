
"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Eye, Share2, Heart, ArrowLeft, Music, Printer, Copy, Check, PlayCircle, Mic2, BookOpen } from "lucide-react";

interface Song {
    id: string;
    slug: string;
    title: string;
    content?: string;
    category: string;
    type: string;
    year: string;
    views: number;
    likes: number;
    composer?: string;
}

interface Book {
    title: string;
    slug: string;
}

interface Props {
    song: Song;
    relatedSongs: any[]; // Using any/loose typing for brevity on list items
    book?: Book | null;
}

export default function SongDetailClient({ song, relatedSongs, book }: Props) {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);

    const handleCopy = () => {
        if (song.content) {
            navigator.clipboard.writeText(song.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Hero Section with Decorative Background */}
                <div className="relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-emerald-100/40 via-transparent to-transparent dark:from-emerald-900/20 blur-3xl" />

                    <div className="container-custom max-w-5xl relative py-12">
                        {/* Back Button */}
                        <Link
                            href="/songs"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 mb-12 transition-all group text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>সকল গান</span>
                        </Link>

                        {/* Main Content Card */}
                        <article className="relative">
                            {/* Floating Decorative Elements */}
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-600/20 dark:to-emerald-500/10 rounded-full blur-2xl opacity-60" />
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-teal-200 to-teal-300 dark:from-teal-600/20 dark:to-teal-500/10 rounded-full blur-3xl opacity-50" />

                            {/* Card */}
                            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100/50 dark:border-gray-800/50 overflow-hidden">
                                {/* Header Section */}
                                <header className="relative p-8 md:p-12 lg:p-16">
                                    {/* Top Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold border border-emerald-100 dark:border-emerald-800/50">
                                                <Music className="w-4 h-4" />
                                                {song.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                            {song.year && (
                                                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
                                                    <Calendar className="w-4 h-4 text-emerald-500" />
                                                    <span className="font-medium">{song.year}</span>
                                                </span>
                                            )}
                                            {song.views > 0 && (
                                                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
                                                    <Eye className="w-4 h-4 text-emerald-500" />
                                                    <span className="font-medium">{song.views.toLocaleString('bn-BD')}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title with Decorative Icon */}
                                    <div className="text-center mb-10">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-6 transform -rotate-12">
                                            <Mic2 className="w-8 h-8 text-white transform rotate-12" />
                                        </div>
                                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                                            {song.title}
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                                            — মতিউর রহমান মল্লিক —
                                        </p>
                                        {song.composer && (
                                            <p className="text-emerald-600 dark:text-emerald-400 text-lg font-medium mt-2">
                                                সুর: {song.composer}
                                            </p>
                                        )}
                                    </div>

                                    {/* Published In (Book Link) */}
                                    {book && (
                                        <div className="flex justify-center mb-10">
                                            <Link
                                                href={`/books/${book.slug}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-gray-100 dark:border-gray-700 hover:border-emerald-100 dark:hover:border-emerald-800"
                                            >
                                                <BookOpen className="w-4 h-4" />
                                                <span>প্রকাশিত হয়েছে: <span className="font-bold">{book.title}</span> বইতে</span>
                                            </Link>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-center gap-3 flex-wrap">
                                        <button className="group flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-medium text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95">
                                            <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            প্লে করুন
                                        </button>

                                        <button
                                            onClick={handleCopy}
                                            className="group flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-medium text-sm hover:scale-105 active:scale-95"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                                            {copied ? "কপি হয়েছে!" : "কপি"}
                                        </button>

                                        <button className="group flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-medium text-sm hover:scale-105 active:scale-95">
                                            <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            প্রিন্ট
                                        </button>

                                        <button className="group flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-medium text-sm hover:scale-105 active:scale-95">
                                            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            শেয়ার
                                        </button>

                                        <button
                                            onClick={() => setLiked(!liked)}
                                            className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium text-sm hover:scale-105 active:scale-95 ${liked
                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 transition-transform ${liked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                                            <span>{liked ? (song.likes || 0) + 1 : (song.likes || 0)}</span>
                                        </button>
                                    </div>
                                </header>

                                {/* Decorative Divider */}
                                <div className="flex items-center justify-center gap-4 px-8">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                                    <span className="text-2xl text-emerald-400">❖</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                                </div>

                                {/* Song Content / Lyrics */}
                                <div className="p-8 md:p-12 lg:px-16 lg:py-12">
                                    <div className="ml-auto mr-0 md:ml-[25%] md:mr-auto max-w-lg">
                                        <div className="font-serif text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line text-left poem-content selection:bg-emerald-200 dark:selection:bg-emerald-900/50 tracking-wide">
                                            {song.content}
                                        </div>

                                        {/* Decorative End Mark */}
                                        <div className="flex flex-col items-center mt-12 gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-12 h-px bg-gradient-to-r from-transparent to-emerald-400/50" />
                                                <span className="text-3xl text-emerald-400">♪</span>
                                                <span className="w-12 h-px bg-gradient-to-l from-transparent to-emerald-400/50" />
                                            </div>
                                            {song.year && (
                                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                                                    রচনাকাল: {song.year}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Related Songs Section */}
                        <section className="mt-20">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                                    আরও শুনুন
                                </h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {relatedSongs.map((relatedSong) => (
                                    <Link
                                        key={relatedSong.id}
                                        href={`/songs/${relatedSong.slug}`}
                                        className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-xl hover:shadow-emerald-100/50 dark:hover:shadow-none hover:-translate-y-1"
                                    >
                                        <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium mb-3">
                                            {relatedSong.category || relatedSong.type || "গান"}
                                        </span>
                                        <h4 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {relatedSong.title}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                            {relatedSong.content?.split('\n')[0]}...
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
