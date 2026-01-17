"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Copy,
    Check,
    Share2,
    Printer,
    Minus,
    Plus,
    X,
    Search
} from "lucide-react";

interface Writing {
    id: string
    title: string
    slug: string
    content: string
    type: string
}

interface Book {
    title: string
    slug: string
}

interface ReadingPageClientProps {
    book: Book
    writing: Writing
    prevWriting: { title: string; slug: string } | null
    nextWriting: { title: string; slug: string } | null
    allWritings: { id: string; title: string; slug: string }[]
}

export default function ReadingPageClient({
    book,
    writing,
    prevWriting,
    nextWriting,
    allWritings
}: ReadingPageClientProps) {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [showMobileToc, setShowMobileToc] = useState(false);
    const [tocSearch, setTocSearch] = useState("");

    // Filter writings for TOC
    const filteredWritings = allWritings.filter(w =>
        w.title.toLowerCase().includes(tocSearch.toLowerCase())
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(writing.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="container-custom max-w-7xl py-8 md:py-12">
                    {/* Mobile TOC Toggle & Breadcrumb Wrapper */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                            <Link href="/books" className="hover:text-primary-600 dark:hover:text-gold-400 transition-colors">
                                গ্রন্থাগার
                            </Link>
                            <span>/</span>
                            <Link href={`/books/${book.slug}`} className="hover:text-primary-600 dark:hover:text-gold-400 transition-colors">
                                {book.title}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 dark:text-white font-medium">{writing.title}</span>
                        </div>

                        {/* Mobile TOC Button */}
                        <button
                            onClick={() => setShowMobileToc(!showMobileToc)}
                            className="lg:hidden flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm"
                        >
                            {showMobileToc ? <X className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                            {showMobileToc ? "সূচিপত্র লুকান" : "সূচিপত্র দেখুন"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Sidebar (TOC) */}
                        <aside className={`lg:col-span-3 lg:block ${showMobileToc ? 'block' : 'hidden'} order-2 lg:order-1`}>
                            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-100/50 dark:shadow-none p-4">
                                <div className="mb-4 px-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-6 bg-primary-500 rounded-full" />
                                        <h3 className="font-display font-bold text-gray-900 dark:text-white">
                                            সূচিপত্র
                                        </h3>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="খুঁজুন..."
                                            value={tocSearch}
                                            onChange={(e) => setTocSearch(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {filteredWritings.length > 0 ? (
                                        filteredWritings.map((w, idx) => (
                                            <Link
                                                key={w.id}
                                                href={`/books/${book.slug}/${w.slug}`}
                                                className={`group flex items-start gap-3 p-2.5 rounded-lg text-sm transition-all ${w.slug === writing.slug
                                                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-gold-400 font-medium"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                                                    }`}
                                            >
                                                <span className={`mt-0.5 text-xs font-mono opacity-60 ${w.slug === writing.slug
                                                    ? "text-primary-400 dark:text-gold-500/50"
                                                    : "text-gray-400 dark:text-gray-600"
                                                    }`}>
                                                    {(allWritings.findIndex(aw => aw.id === w.id) + 1).toString().padStart(2, '0')}
                                                </span>
                                                <span className="leading-snug">{w.title}</span>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 text-sm">
                                            কোনো রচনা পাওয়া যায়নি
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Card */}
                        <article className="lg:col-span-9 order-1 lg:order-2 relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
                            {/* Header */}
                            <header className="p-6 md:p-12 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-3 py-1 text-sm font-medium text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                                        {writing.type}
                                    </span>
                                    <span className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        {book.title}
                                    </span>
                                </div>

                                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                    {writing.title}
                                </h1>

                                <p className="text-gray-500 dark:text-gray-400">
                                    — মতিউর রহমান মল্লিক —
                                </p>

                                {/* Action Bar */}
                                <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    {/* Font Size Controls */}
                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                        <button
                                            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                            title="অক্ষর ছোট করুন"
                                        >
                                            <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center font-medium">{fontSize}px</span>
                                        <button
                                            onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                            title="অক্ষর বড় করুন"
                                        >
                                            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            <span className="hidden sm:inline">{copied ? "কপি হয়েছে" : "কপি"}</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                                            <Printer className="w-4 h-4" />
                                            <span className="hidden sm:inline">প্রিন্ট</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                                            <Share2 className="w-4 h-4" />
                                            <span className="hidden sm:inline">শেয়ার</span>
                                        </button>
                                    </div>
                                </div>
                            </header>

                            {/* Content */}
                            <div className="p-6 md:p-12">
                                <div
                                    className="font-bengali leading-loose text-gray-800 dark:text-gray-200 whitespace-pre-line selection:bg-gold-200 dark:selection:bg-gold-900/50"
                                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
                                >
                                    {writing.content}
                                </div>

                                {/* Decorative End */}
                                <div className="flex flex-col items-center mt-12 gap-4 opacity-50">
                                    <div className="flex items-center gap-3">
                                        <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-400/50" />
                                        <span className="text-2xl text-gold-400">❦</span>
                                        <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold-400/50" />
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Footer */}
                            <div className="grid grid-cols-2 gap-4 p-6 md:p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                                {prevWriting ? (
                                    <Link
                                        href={`/books/${book.slug}/${prevWriting.slug}`}
                                        className="group flex flex-col items-start gap-1 text-left p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                                    >
                                        <span className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-primary-600 dark:group-hover:text-gold-400">
                                            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                            পূর্ববর্তী
                                        </span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white line-clamp-1">
                                            {prevWriting.title}
                                        </span>
                                    </Link>
                                ) : (
                                    <div />
                                )}

                                {nextWriting ? (
                                    <Link
                                        href={`/books/${book.slug}/${nextWriting.slug}`}
                                        className="group flex flex-col items-end gap-1 text-right p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                                    >
                                        <span className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-primary-600 dark:group-hover:text-gold-400">
                                            পরবর্তী
                                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white line-clamp-1">
                                            {nextWriting.title}
                                        </span>
                                    </Link>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
