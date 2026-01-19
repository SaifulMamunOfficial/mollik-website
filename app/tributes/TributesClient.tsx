"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Quote, Heart, PenTool, Calendar, User, ChevronRight } from "lucide-react";

// Sample tribute data for Featured section (Static)


const stats = [
    { label: "কবিতা", value: "৫০০+" },
    { label: "গান", value: "৩০০+" },
    { label: "গ্রন্থ", value: "৫০+" },
    { label: "পুরস্কার", value: "২০+" }
];

interface Tribute {
    id: string;
    content: string;
    author: any;
    displayName: string;
    authorImage?: string;
    date: string;
    district?: string | null;
    designation?: string;
    displayOption?: string;
    isFeatured?: boolean;
}

export default function TributesClient({ tributes }: { tributes: Tribute[] }) {
    const [filter, setFilter] = useState("all");

    // Default DB tributes to 'personal' type for filtering if type is missing
    const tributesWithType = tributes.map(t => ({
        ...t,
        type: "personal", // Defaulting to personal since DB doesn't have type
        location: t.displayOption === 'DESIGNATION' && t.designation
            ? t.designation
            : (t.district || "বাংলাদেশ")
    }));

    const featuredTributes = tributesWithType.filter(t => t.isFeatured);
    const readerTributes = tributesWithType.filter(t => !t.isFeatured);

    const filteredReaderTributes = filter === "all"
        ? readerTributes
        : readerTributes.filter(t => t.type === filter);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
                    </div>

                    <div className="container-custom relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm mb-6">
                            <Heart className="w-4 h-4" />
                            <span>স্মরণে অমলিন</span>
                        </div>

                        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
                            শোকবার্তা
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
                            কবি মতিউর রহমান মল্লিকের স্মৃতির প্রতি শ্রদ্ধা নিবেদন।
                            তাঁর কবিতা, গান ও সাহিত্যকর্ম চিরকাল আমাদের অনুপ্রাণিত করবে।
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <div className="font-display text-3xl md:text-4xl font-bold text-gold-400 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Tributes */}
                <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                বিশিষ্টজনের শোকবার্তা
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                সাহিত্যিক, শিক্ষাবিদ এবং সংস্কৃতিকর্মীদের কথায় কবি মল্লিক
                            </p>
                        </div>

                        <div className="relative group">
                            {featuredTributes.length > 0 && (
                                <>
                                    <button
                                        onClick={() => {
                                            const container = document.getElementById('featured-tributes-container');
                                            if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                                        }}
                                        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                    >
                                        <ChevronRight className="w-6 h-6 rotate-180" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const container = document.getElementById('featured-tributes-container');
                                            if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                                        }}
                                        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            <div
                                id="featured-tributes-container"
                                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
                            >
                                {featuredTributes.length > 0 ? featuredTributes.map((tribute) => (
                                    <div
                                        key={tribute.id}
                                        className="relative bg-gradient-to-br from-primary-50 to-gold-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border border-primary-100 dark:border-gray-700 w-[85vw] md:w-[380px] flex-shrink-0 snap-center flex flex-col transition-transform hover:-translate-y-1 duration-300"
                                    >
                                        <div className="flex-1">
                                            <Quote className="w-10 h-10 text-primary-300 dark:text-primary-700 mb-4" />
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic text-lg">
                                                "{tribute.content}"
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-primary-100 dark:border-gray-700">
                                            {tribute.authorImage ? (
                                                <img src={tribute.authorImage} alt={tribute.displayName} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border-2 border-primary-100 dark:border-gray-600 shadow-sm">
                                                    <User className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">
                                                    {tribute.displayName}
                                                </h4>
                                                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                                                    {tribute.designation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500 w-full py-10">কোনো বিশিষ্টজনের শোকবার্তা পাওয়া যায়নি</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Community Tributes */}
                <section className="py-16 md:py-24">
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    পাঠকের শোকবার্তা
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    কবির ভক্ত ও পাঠকদের স্মৃতিচারণ ও শ্রদ্ধা
                                </p>
                            </div>

                            {/* Filter */}
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { value: "all", label: "সবগুলো" },
                                    { value: "memory", label: "স্মৃতি" },
                                    { value: "personal", label: "ব্যক্তিগত" },
                                    { value: "literary", label: "সাহিত্যিক" }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilter(option.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === option.value
                                            ? "bg-primary-600 text-white"
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tribute Grid */}
                        {filteredReaderTributes.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredReaderTributes.map((tribute) => (
                                    <article
                                        key={tribute.id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
                                    >
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                            "{tribute.content}"
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-3">
                                                {tribute.authorImage ? (
                                                    <img src={tribute.authorImage} alt={tribute.displayName} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400">
                                                        {tribute.displayName?.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">
                                                        {tribute.displayName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <span>{tribute.location}</span>
                                                        <span>•</span>
                                                        <span>{tribute.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400">এখনো কোনো শোকবার্তা নেই</p>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="mt-16 text-center">
                            <div className="inline-block bg-gradient-to-br from-primary-50 to-gold-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 md:p-12 border border-primary-100 dark:border-gray-700 max-w-2xl">
                                <PenTool className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    আপনার শোকবার্তা জানান
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    কবি মল্লিকের সাথে আপনার স্মৃতি বা তাঁর সাহিত্যকর্ম সম্পর্কে আপনার অনুভূতি শেয়ার করুন।
                                </p>
                                <Link
                                    href="/blog/new"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all"
                                >
                                    <span>লেখা জমা দিন</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
