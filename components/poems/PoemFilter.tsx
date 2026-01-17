"use client";

import { Search, Filter } from "lucide-react";

interface PoemFilterProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onSearchChange: (query: string) => void;
    variant?: 'sidebar' | 'mobile';
}

const categories = [
    { id: "all", name: "সব কবিতা" },
    { id: "early", name: "প্রারম্ভিক রচনা" },
    { id: "mature", name: "পরিপক্ব রচনা" },
    { id: "spiritual", name: "আধ্যাত্মিক" },
    { id: "nature", name: "প্রকৃতি" },
    { id: "patriotic", name: "দেশাত্মবোধক" },
];

export function PoemFilter({ selectedCategory, onCategoryChange, onSearchChange, variant = 'sidebar' }: PoemFilterProps) {
    if (variant === 'mobile') {
        return (
            <div className="space-y-4 mb-6 w-full max-w-full">
                {/* Search Box */}
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="কবিতা খুঁজুন..."
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-gold-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 shadow-sm box-border"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {/* Categories (Horizontal Scroll) */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
                                ? "bg-primary-600 dark:bg-gold-500 text-white dark:text-gray-900 shadow-md shadow-primary-500/20"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search Box */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="কবিতা খুঁজুন..."
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-gold-500 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Categories */}
            <div>
                <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold font-display">
                    <Filter className="w-5 h-5" />
                    <span>ক্যাটাগরি</span>
                </div>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${selectedCategory === category.id
                                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-gold-400 border-l-4 border-primary-500 dark:border-gold-500"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
