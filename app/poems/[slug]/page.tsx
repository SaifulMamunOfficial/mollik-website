"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/components/comments/CommentSection";
import { Calendar, Eye, Share2, Heart, ArrowLeft, BookOpen, Printer, Copy, Check, Feather, Loader2 } from "lucide-react";

interface Poem {
    id: string;
    slug: string;
    title: string;
    content: string;
    category?: string;
    year?: string;
    views?: number;
    likes?: number;
}

interface RelatedPoem {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    category: string;
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default function PoemDetailPage({ params }: PageProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [poem, setPoem] = useState<Poem | null>(null);
    const [relatedPoems, setRelatedPoems] = useState<RelatedPoem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch poem data
    useEffect(() => {
        const fetchPoem = async () => {
            try {
                const response = await fetch(`/api/writings/${params.slug}`);
                const data = await response.json();

                if (response.ok) {
                    setPoem(data.writing);
                    setRelatedPoems(data.relatedWritings || []);
                } else {
                    setError(data.message || "কবিতা পাওয়া যায়নি");
                }
            } catch (err) {
                setError("কবিতা লোড করতে সমস্যা হয়েছে");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPoem();
    }, [params.slug]);

    const handleCopy = () => {
        if (poem?.content) {
            navigator.clipboard.writeText(poem.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary-600 dark:text-gold-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">কবিতা লোড হচ্ছে...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Error state or not found
    if (error || !poem) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center max-w-md px-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            কবিতা পাওয়া যায়নি
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {error || "আপনি যে কবিতাটি খুঁজছেন তা এখানে নেই।"}
                        </p>
                        <Link
                            href="/poems"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            সকল কবিতা দেখুন
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Hero Section with Decorative Background */}
                <div className="relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary-100/40 via-transparent to-transparent dark:from-primary-900/20 blur-3xl" />

                    <div className="container-custom max-w-5xl relative py-12">
                        {/* Back Button */}
                        <Link
                            href="/poems"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-gold-400 mb-12 transition-all group text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>সকল কবিতা</span>
                        </Link>

                        {/* Main Content Card */}
                        <article className="relative">
                            {/* Floating Decorative Elements */}
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-gold-200 to-gold-300 dark:from-gold-600/20 dark:to-gold-500/10 rounded-full blur-2xl opacity-60" />
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-600/20 dark:to-primary-500/10 rounded-full blur-3xl opacity-50" />

                            {/* Card */}
                            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100/50 dark:border-gray-800/50 overflow-hidden">
                                {/* Header Section */}
                                <header className="relative p-8 md:p-12 lg:p-16">
                                    {/* Top Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/30 text-primary-700 dark:text-gold-400 rounded-full text-sm font-semibold border border-primary-100 dark:border-primary-800/50">
                                                <BookOpen className="w-4 h-4" />
                                                {poem.category || "কবিতা"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                            {poem.year && (
                                                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
                                                    <Calendar className="w-4 h-4 text-primary-500" />
                                                    <span className="font-medium">{poem.year}</span>
                                                </span>
                                            )}
                                            {poem.views && (
                                                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
                                                    <Eye className="w-4 h-4 text-primary-500" />
                                                    <span className="font-medium">{poem.views.toLocaleString('bn-BD')}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title with Decorative Quill */}
                                    <div className="text-center mb-10">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-500 dark:from-gold-500 dark:to-gold-600 rounded-2xl shadow-lg shadow-gold-500/25 mb-6 transform -rotate-12">
                                            <Feather className="w-8 h-8 text-white transform rotate-12" />
                                        </div>
                                        <h1 className="font-bengali text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4 selection:bg-gold-200 dark:selection:bg-gold-900/50" style={{ fontFamily: '"Li Purno Pran", "Hind Siliguri", "Anek Bangla", serif' }}>
                                            {poem.title}
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                                            — মতিউর রহমান মল্লিক —
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-center gap-3 flex-wrap">
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

                                        <button className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all font-medium text-sm shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 hover:scale-105 active:scale-95">
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
                                            <span>{liked ? (poem.likes || 0) + 1 : (poem.likes || 0)}</span>
                                        </button>
                                    </div>
                                </header>

                                {/* Decorative Divider */}
                                <div className="flex items-center justify-center gap-4 px-8">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                                    <span className="text-2xl text-gold-400">✦</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                                </div>

                                {/* Poem Content */}
                                <div className="p-8 md:p-12 lg:px-16 lg:py-12">
                                    <div className="ml-auto mr-0 md:ml-[25%] md:mr-auto max-w-lg">
                                        <div className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line text-left poem-content selection:bg-gold-200 dark:selection:bg-gold-900/50 tracking-wide font-bengali" style={{ fontFamily: '"Li Purno Pran", "Hind Siliguri", "Anek Bangla", serif' }}>
                                            {poem.content}
                                        </div>

                                        {/* Decorative End Mark */}
                                        <div className="flex flex-col items-center mt-12 gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-400/50" />
                                                <span className="text-3xl text-gold-400">❦</span>
                                                <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold-400/50" />
                                            </div>
                                            {poem.year && (
                                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                                                    রচনাকাল: {poem.year}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Related Poems Section */}
                        {relatedPoems.length > 0 && (
                            <section className="mt-20">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-gold-500 rounded-full" />
                                    <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                                        আরও পড়ুন
                                    </h3>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {relatedPoems.map((relatedPoem) => (
                                        <Link
                                            key={relatedPoem.id}
                                            href={`/poems/${relatedPoem.slug}`}
                                            className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all hover:shadow-xl hover:shadow-primary-100/50 dark:hover:shadow-none hover:-translate-y-1"
                                        >
                                            <span className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400 rounded-full text-xs font-medium mb-3">
                                                {relatedPoem.category || "কবিতা"}
                                            </span>
                                            <h4 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                {relatedPoem.title}
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                                {relatedPoem.excerpt}...
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Comment Section */}
                        <section className="mt-16">
                            <CommentSection writingId={poem.id} title="পাঠকদের মন্তব্য" />
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
