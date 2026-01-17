"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WritingCard } from "@/components/writings/WritingCard";
import { getEssays } from "@/lib/data";
import { ProseFilter } from "@/components/prose/ProseFilter";

export default function ProsePage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const essays = getEssays();

    const filteredEssays = essays.filter((essay) => {
        const matchesCategory = selectedCategory === "all" || essay.categoryId === selectedCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = essay.title.toLowerCase().includes(query) || (essay.excerpt?.toLowerCase().includes(query) ?? false);
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-cream-50 dark:bg-gray-950 pt-8 pb-16">
                {/* Page Header */}
                <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 mb-12">
                    <div className="container-custom py-12">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            গদ্য সাহিত্য
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-bengali">
                            মতিউর রহমান মল্লিকের চিন্তা ও দর্শনের প্রতিফলন। প্রবন্ধ, নিবন্ধ এবং অন্যান্য গদ্য রচনার সংকলন।
                        </p>
                    </div>
                </div>

                <div className="container-custom">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar Filters */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-24">
                                <ProseFilter
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={setSelectedCategory}
                                    onSearchChange={setSearchQuery}
                                    searchQuery={searchQuery}
                                />
                            </div>
                        </aside>

                        {/* Content Grid */}
                        <div className="lg:col-span-3 min-w-0">
                            {/* Mobile Filters */}
                            <div className="lg:hidden">
                                <ProseFilter
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={setSelectedCategory}
                                    onSearchChange={setSearchQuery}
                                    searchQuery={searchQuery}
                                    variant="mobile"
                                />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    সবমোট <span className="font-bold text-gray-900 dark:text-white">{filteredEssays.length}</span> টি রচনা পাওয়া গেছে
                                </p>
                            </div>

                            {filteredEssays.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {filteredEssays.map((essay) => (
                                        <WritingCard key={essay.id} writing={essay} theme="poem" /> // Using poem theme for now as it fits prose better than song theme
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">কোনো রচনা পাওয়া যায়নি</p>
                                    <button
                                        onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                                        className="mt-4 text-primary-600 dark:text-gold-400 hover:underline"
                                    >
                                        সকল ফিল্টার মুছুন
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
