"use client";

import { Search, Filter } from "lucide-react";

interface ProseFilterProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onSearchChange: (query: string) => void;
    searchQuery: string;
    variant?: 'sidebar' | 'mobile';
}

const categories = [
    { id: "all", name: "সকল গদ্য" },
    { id: "essays", name: "প্রবন্ধ" },
    { id: "articles", name: "নিবন্ধ" },
    { id: "complete", name: "রচনাবলী" },
];

export function ProseFilter({ selectedCategory, onCategoryChange, onSearchChange, searchQuery, variant = 'sidebar' }: ProseFilterProps) {
    if (variant === 'mobile') {
        return (
            <div className="space-y-4 mb-6 w-full max-w-full">
                {/* Search Box */}
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="গদ্য খুঁজুন..."
                        value={searchQuery}
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
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">অনুসন্ধান</h3>
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="গদ্য খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                />
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-4">ক্যাটাগরি</h3>
            <div className="space-y-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category.id
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-gold-400 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
