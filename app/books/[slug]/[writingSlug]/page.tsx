"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    ArrowLeft,
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

// Mock Data for Books with their writings content
const books = [
    {
        id: 1,
        slug: "ek-jiboner-kobita",
        title: "এক জীবনের কবিতা",
        writings: [
            {
                id: 1,
                slug: "probhater-alo",
                title: "প্রভাতের আলো",
                type: "কবিতা",
                content: `সকালের সূর্য উঠেছে আকাশে
প্রকৃতি জেগে উঠেছে নতুন আশে
পাখিরা গান গায় ডালে ডালে
স্বপ্নেরা ভেসে যায় সকালের আলে।

শিশির ভেজা ঘাসের ডগায়
রোদের ঝিলিক নাচে
নতুন দিনের আহবানে
মন যে আমার বাঁচে।

চল যাই মাঠে ঘাটে
সোনালী রোদের সাথে
প্রকৃতির এই অপরূপ সাজে
মন হারায় বারে বারে।

হে প্রভাত তুমি সুন্দর
তুমি আনো নতুন আশা
তোমার আলোয় মুছে যাক
জীবনের সব নিরাশা।`
            },
            {
                id: 2,
                slug: "matribhumir-proti",
                title: "মাতৃভূমির প্রতি",
                type: "কবিতা",
                content: `হে আমার স্বদেশ, হে আমার মাতৃভূমি
তোমার কাছে আমি চিরকাল ঋণী
তোমার মাটিতে খেলেছি শৈশবে
তোমার আকাশে দেখেছি স্বপ্নের রবি।

নদীনালা খালবিল তোমার অহংকার
সবুজ শ্যামল এই মায়াবী সংসার
পাখির গানে ঘুম ভাঙ্গে ভোরে
তোমার মমতা থাকে যে অন্তরে।

যতো দূরে যাই, যতো পথ হাঁটি
তোমার স্মৃতি যে হৃদয়ে খাঁটি
মায়ের মতো তুমি আগলে রাখো
সারাটি জীবন শুধু ভালোবেসে থাকো।

বাঁচতে চাই আমি তোমার কোলে
মরতে চাই আমি তোমারি বোলে
হে আমার দেশ, আমার ঠিকানা
তুমি ছাড়া আর কিছু জানি না।`
            },
            {
                id: 3,
                slug: "borshar-gaan",
                title: "বর্ষার গান",
                type: "কবিতা",
                content: `মেঘ জমেছে আকাশে
বৃষ্টি নামবে সারা দেশে
ধান ক্ষেত হাসবে আনন্দে
কৃষকের মুখে ফুটবে উল্লাস।

টিনের চালে বৃষ্টির গান
শুনতে ভালো লাগে
শ্রাবণ এলে মন উড়ে যায়
দূর অজানায়।

নদীতে জল বাড়ে
নৌকা ভাসে জলে
প্রকৃতি সেজেছে সবুজে
বর্ষা এসেছে বলে।`
            },
            {
                id: 4,
                slug: "shantir-khoje",
                title: "শান্তির খোঁজে",
                type: "কবিতা",
                content: `মানুষ আমি শান্তির খোঁজে
ঘুরি পথে পথে
কোথায় পাবো সেই শান্তি
কোন সুখের রথে?

অর্থ বিত্ত সবই তো দেখি
তবুও মনে সুখ নেই
হৃদয় আমার শূন্য কেন
কার জন্য কেঁদে মরে?

শান্তি আসে ত্যাগে, ভোগে নয়
প্রেমে আসে, ঘৃণায় নয়
আল্লাহর পথে চললে তবেই
প্রকৃত সুখ পাওয়া রয়।`
            },
            {
                id: 5,
                slug: "shoishober-smriti",
                title: "শৈশবের স্মৃতি",
                type: "কবিতা",
                content: `মনে পড়ে সেই শৈশব দিন
মায়ের কোলে খেলা
নদীর পাড়ে কাদা মাটি
সারাটি বেলা।

কোথায় গেল সেই দিনগুলো
সোনার চেয়ে দামী
ফিরে যদি পেতাম আবার
হতাম অনেক নামী।`
            },
            {
                id: 6,
                slug: "jiboner-gaan",
                title: "জীবনের গান",
                type: "কবিতা",
                content: `জীবন মানে যুদ্ধ করা
থামা মানেই মরণ
চড়াই উৎরাই পেরিয়ে চলা
সাহসে বুক বাঁধা।

কষ্ট আছে দুঃখ আছে
আছে অনেক ব্যথা
তবুও জীবন সুন্দর
এই তো মোদের কথা।`
            },
            {
                id: 7,
                slug: "prem-o-biroho",
                title: "প্রেম ও বিরহ",
                type: "কবিতা",
                content: `প্রেমের আগুন জ্বলে বুকে
বিরহ কি সয়?
তুমি ছাড়া এই ভুবনে
সবই যে শূন্য রয়।

মিলন হবে কত দিনে
এই আশা বাঁধি
তোমার জন্য সারাটি জীবন
নিরবে আমি কাঁদি।`
            },
            {
                id: 8,
                slug: "shrabon-din",
                title: "শ্রাবণ দিন",
                type: "কবিতা",
                content: `শ্রাবণের মেঘে ঢাকা আকাশ
বৃষ্টি ঝরে অবিরাম
তোমার কথা মনে পড়ে
আমার প্রিয় নাম।

ভিজে ভিজে একাকার
মাঠ ঘাট পথ
তোমার জন্য অপেক্ষায়
কাটে আমার রথ।`
            },
            {
                id: 9,
                slug: "mon-kharap",
                title: "মন খারাপ",
                type: "কবিতা",
                content: `আজকে আমার মন খারাপ
কারণ জানি না
আকাশ পানে চেয়ে থাকি
কিছু ভালো লাগে না।

মেঘের মতো ভারি কেন
বুকের ভাজঁ
কখন হবে বৃষ্টি নামবে
করবে সব সাফ।`
            },
            {
                id: 10,
                slug: "amar-desh",
                title: "আমার দেশ",
                type: "কবিতা",
                content: `আমার দেশ সোনার দেশ
ভালোবাসি আমি
এই দেশেরই ধুলোবালি
আমার কাছে দামী।

সবুজ ক্ষেত নদীর বাঁক
পাখির কলতান
এই দেশেতে জন্ম আমার
জুড়ায় আমার প্রাণ।`
            },
        ],
    },
    {
        id: 2,
        slug: "mollik-geeti",
        title: "মল্লিক গীতি",
        writings: [
            {
                id: 1,
                slug: "allah-amar-prabhu",
                title: "আল্লাহ আমার প্রভু",
                type: "হামদ",
                content: `আল্লাহ আমার প্রভু
তোমার নাম নিই সদা
তুমি ছাড়া নেই কেউ
আমার এই জীবনে।

তুমি দিয়েছ আলো
তুমি দিয়েছ বাতাস
তোমার রহমতে ভরা
এই পৃথিবী সমস্ত।

শুকরিয়া জানাই তোমায়
প্রতিটি মুহূর্তে
তোমার দয়া ও করুণায়
বেঁচে আছি পৃথিবীতে।`
            },
        ],
    },
    {
        id: 3,
        slug: "notun-prithibi",
        title: "নতুন পৃথিবী",
        writings: [
            {
                id: 1,
                slug: "islam-o-adhunik-somaj",
                title: "ইসলাম ও আধুনিক সমাজ",
                type: "প্রবন্ধ",
                content: `আধুনিক সমাজে ইসলামের ভূমিকা অত্যন্ত গুরুত্বপূর্ণ। ইসলাম শুধু একটি ধর্ম নয়, এটি একটি সম্পূর্ণ জীবন ব্যবস্থা যা মানুষের ব্যক্তিগত, পারিবারিক, সামাজিক ও রাষ্ট্রীয় জীবনের সকল দিক নির্দেশনা দেয়।

আজকের যুগে মানুষ নানা সমস্যায় জর্জরিত। মানসিক অশান্তি, পারিবারিক বিশৃঙ্খলা, সামাজিক অবক্ষয় - এই সবকিছুর মূলে রয়েছে নৈতিক মূল্যবোধের অভাব। ইসলাম এই মূল্যবোধ প্রতিষ্ঠা করতে সক্ষম।

ইসলামের মূল শিক্ষা হলো ন্যায়বিচার, সাম্য ও মানবতা। এই শিক্ষাগুলো যদি আমরা আমাদের জীবনে প্রয়োগ করতে পারি, তাহলে একটি সুন্দর সমাজ গড়ে তোলা সম্ভব।

আমাদের উচিত ইসলামের প্রকৃত শিক্ষা গ্রহণ করা এবং তা নিজেদের জীবনে বাস্তবায়ন করা। তবেই আমরা একটি সুখী ও সমৃদ্ধ সমাজ গড়ে তুলতে পারব।`
            },
        ],
    },
];

interface PageProps {
    params: {
        slug: string;
        writingSlug: string;
    };
}

export default function ReadingPage({ params }: PageProps) {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [showMobileToc, setShowMobileToc] = useState(false);
    const [tocSearch, setTocSearch] = useState("");

    const book = books.find((b) => b.slug === params.slug);
    if (!book) {
        notFound();
    }

    const writing = book.writings.find((w) => w.slug === params.writingSlug);
    if (!writing) {
        notFound();
    }

    // Filter writings for TOC
    const filteredWritings = book.writings.filter(w =>
        w.title.toLowerCase().includes(tocSearch.toLowerCase())
    );

    // Find previous and next writings (global list, not filtered, to maintain navigation flow)
    const currentIndex = book.writings.findIndex((w) => w.slug === params.writingSlug);
    const prevWriting = currentIndex > 0 ? book.writings[currentIndex - 1] : null;
    const nextWriting = currentIndex < book.writings.length - 1 ? book.writings[currentIndex + 1] : null;

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
                                                    {/* We use original index here from full list to keep consistent numbering? 
                                                        Or just visual Index? Let's find the original index for correct numbering even in filtered view */}
                                                    {(book.writings.findIndex(bw => bw.id === w.id) + 1).toString().padStart(2, '0')}
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
                                    className="font-serif leading-loose text-gray-800 dark:text-gray-200 whitespace-pre-line selection:bg-gold-200 dark:selection:bg-gold-900/50"
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
