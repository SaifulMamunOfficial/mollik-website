"use client";

import { Search } from "lucide-react";

interface BlogFilterProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function BlogFilter({
    categories,
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange
}: BlogFilterProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm w-full max-w-full">
            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide max-w-full">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === cat
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        {cat === "all" ? "সবগুলো" : cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64 max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 rounded-full text-sm outline-none transition-all"
                />
            </div>
        </div>
    );
}
