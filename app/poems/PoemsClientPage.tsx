"use client";

import { useState } from "react";
import { WritingCard } from "@/components/writings/WritingCard";
import { PoemFilter } from "@/components/poems/PoemFilter";
import type { Writing } from "@/lib/data";

interface PoemsClientPageProps {
    poems: Writing[];
}

export default function PoemsClientPage({ poems }: PoemsClientPageProps) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPoems = poems.filter((poem) => {
        const matchesCategory = selectedCategory === "all" || poem.categoryId === selectedCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = poem.title.toLowerCase().includes(query) || (poem.excerpt?.toLowerCase().includes(query) ?? false);
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-cream-50 dark:bg-gray-950 pt-8 pb-16">
            {/* Page Header */}
            <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 mb-12">
                <div className="container-custom py-12">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        কবিতা সম্ভার
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-bengali">
                        মতিউর রহমান মল্লিকের অমর সৃষ্টিসমূহ। এখানে আপনি কবির বিভিন্ন সময়ের লেখা কবিতাগুলো খুঁজে পেতে পারেন।
                    </p>
                </div>
            </div>

            <div className="container-custom">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <PoemFilter
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                onSearchChange={setSearchQuery}
                            />
                        </div>
                    </aside>

                    {/* Content Grid */}
                    <div className="lg:col-span-3 min-w-0">
                        {/* Mobile Filters */}
                        <div className="lg:hidden">
                            <PoemFilter
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                onSearchChange={setSearchQuery}
                                variant="mobile"
                            />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                সবমোট <span className="font-bold text-gray-900 dark:text-white">{filteredPoems.length}</span> টি কবিতা পাওয়া গেছে
                            </p>
                        </div>

                        {filteredPoems.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredPoems.map((poem) => (
                                    <WritingCard key={poem.id} writing={poem} theme="poem" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400">কোনো কবিতা পাওয়া যায়নি</p>
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
    );
}
