
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Eye, Share2, Heart, ArrowLeft, BookOpen, Printer, Copy, Check, Clock } from "lucide-react";
import { CommentSection } from "@/components/comments/CommentSection";

interface Essay {
    id: string;
    slug: string;
    title: string;
    content: string;
    type: string;
    category?: string;
    year: string;
    views: number;
    likes: number;
    readTime: string;
}

interface Book {
    title: string;
    slug: string;
}

interface Props {
    essay: Essay;
    relatedEssays: any[];
    book?: Book | null;
}

export default function ProseDetailClient({ essay, relatedEssays, book }: Props) {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [scrolled, setScrolled] = useState(0);
    const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl' | '2xl'>('lg');

    // Handle scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrolled(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopy = () => {
        if (essay.content) {
            navigator.clipboard.writeText(essay.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-[100]">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-gold-500 transition-all duration-150 ease-out"
                    style={{ width: `${scrolled}%` }}
                />
            </div>

            <Header />
            <main className="min-h-screen bg-cream-50 dark:bg-gray-950">
                {/* Hero Section */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                    <div className="container-custom py-12 md:py-16">
                        {/* Back Button */}
                        <Link
                            href="/prose"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-gold-400 mb-8 transition-all group text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>সকল গদ্য</span>
                        </Link>

                        <div className="max-w-3xl mx-auto text-center">
                            <span className="inline-block px-3 py-1 mb-4 text-sm font-medium text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                                {essay.category || essay.type || "প্রবন্ধ"}
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                {essay.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
                                {essay.year && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary-500" />
                                        <span>{essay.year}</span>
                                    </span>
                                )}
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary-500" />
                                    <span>{essay.readTime}</span>
                                </span>
                                {essay.views > 0 && (
                                    <span className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-primary-500" />
                                        <span>{essay.views.toLocaleString('bn-BD')}</span>
                                    </span>
                                )}
                            </div>

                            {/* Published In (Book Link) */}
                            {book && (
                                <div className="flex justify-center mb-10">
                                    <Link
                                        href={`/books/${book.slug}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-gold-400 transition-colors border border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-800"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        <span>প্রকাশিত হয়েছে: <span className="font-bold">{book.title}</span> বইতে</span>
                                    </Link>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {/* Font Controls */}
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 mr-4">
                                    <button
                                        onClick={() => setFontSize('base')}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${fontSize === 'base' ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-gold-400' : 'text-gray-500 dark:text-gray-400'}`}
                                        title="ছোট ফন্ট"
                                    >
                                        A-
                                    </button>
                                    <button
                                        onClick={() => setFontSize('lg')}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-base font-bold transition-colors ${fontSize === 'lg' ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-gold-400' : 'text-gray-500 dark:text-gray-400'}`}
                                        title="মাঝারি ফন্ট"
                                    >
                                        A
                                    </button>
                                    <button
                                        onClick={() => setFontSize('xl')}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold transition-colors ${fontSize === 'xl' ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-gold-400' : 'text-gray-500 dark:text-gray-400'}`}
                                        title="বড় ফন্ট"
                                    >
                                        A+
                                    </button>
                                </div>

                                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

                                <button
                                    onClick={handleCopy}
                                    className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                                    title="কপি করুন"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                                <button className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors" title="প্রিন্ট করুন">
                                    <Printer className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors" title="শেয়ার করুন">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`p-2.5 rounded-full transition-colors ${liked
                                        ? 'bg-red-50 text-red-500 dark:bg-red-900/20'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    title="লাইক দিন"
                                >
                                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container-custom py-12">
                    <article className="max-w-4xl mx-auto">
                        <div className="bg-white/70 dark:bg-gray-900/50 rounded-2xl p-8 md:p-12">
                            <div className="prose dark:prose-invert prose-headings:font-display prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-loose max-w-none transition-all duration-300">
                                <div className={`whitespace-pre-line font-serif leading-loose text-justify ${fontSize === 'base' ? 'text-base' : fontSize === 'xl' ? 'text-xl' : fontSize === '2xl' ? 'text-2xl' : 'text-lg'}`}>
                                    {essay.content}
                                </div>
                            </div>
                        </div>

                        {/* End Mark */}
                        <div className="flex justify-center mt-12 mb-16">
                            <span className="text-gray-300 dark:text-gray-700 text-2xl">❖</span>
                        </div>
                    </article>

                    {/* Scroll to Top Button */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-8 right-8 p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-gold-400 transition-all z-50 group"
                        title="উপরে যান"
                    >
                        <ArrowLeft className="w-5 h-5 rotate-90" />
                    </button>

                    {/* Related Section */}
                    {relatedEssays.length > 0 && (
                        <div className="max-w-4xl mx-auto border-t border-gray-200 dark:border-gray-800 pt-12">
                            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                আরও পড়ুন
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {relatedEssays.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={`/prose/${related.slug}`}
                                        className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all hover:shadow-lg hover:shadow-primary-100/30 dark:hover:shadow-none"
                                    >
                                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs mb-3">
                                            {related.type}
                                        </span>
                                        <h4 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                            {related.title}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                            {related.excerpt || related.content?.slice(0, 100)}...
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comment Section */}
                    <div className="max-w-4xl mx-auto mt-12">
                        <CommentSection writingId={essay.id} title="পাঠকদের মন্তব্য" />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
