"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Calendar, FileText, Filter, Grid, List, ChevronRight } from "lucide-react";

interface Book {
    id: string
    title: string
    slug: string
    subtitle: string
    description: string
    year: string
    publisher: string
    coverImage: string
    categoryId: string
    category: string
    totalWritings: number
}

interface BooksPageClientProps {
    books: Book[]
}

export default function BooksPageClient({ books }: BooksPageClientProps) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const categories = [
        { id: "all", name: "সব বই", count: books.length },
        { id: "poetry", name: "কবিতা সংকলন", count: books.filter(b => b.categoryId === 'poetry').length },
        { id: "songs", name: "গান সংকলন", count: books.filter(b => b.categoryId === 'songs').length },
        { id: "essays", name: "প্রবন্ধ", count: books.filter(b => b.categoryId === 'essays').length },
        { id: "children", name: "শিশু সাহিত্য", count: books.filter(b => b.categoryId === 'children').length },
        { id: "complete", name: "রচনাবলী", count: books.filter(b => b.categoryId === 'complete').length },
    ];

    const filteredBooks = books.filter((book) => {
        const matchesCategory = selectedCategory === "all" || book.categoryId === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Hero Section */}
            <section className="relative pt-16 pb-10 border-b border-[rgb(var(--border))]/20">
                <div className="container-custom relative">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-[rgb(var(--foreground))] tracking-tight mb-3">
                            গ্রন্থাগার
                        </h1>
                        <p className="text-sm md:text-base text-[rgb(var(--muted-foreground))] leading-relaxed max-w-xl mx-auto mb-8">
                            কবি মতিউর রহমান মল্লিকের প্রকাশিত সকল গ্রন্থসমূহ ও তাদের সূচিপত্র। বইতে ক্লিক করে সেই বইয়ের সকল রচনা পড়তে পারবেন।
                        </p>

                        {/* Minimalist Search Bar */}
                        <div className="max-w-md mx-auto relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted-foreground))]" />
                            <input
                                type="text"
                                placeholder="বই খুঁজুন..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/55 rounded-xl text-sm text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted-foreground))]/70 focus:outline-none focus:border-[rgb(var(--primary))] transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                            <div className="sticky top-24 space-y-6">
                                {/* Categories */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        <Filter className="w-5 h-5 text-primary-500" />
                                        বিভাগ
                                    </h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === category.id
                                                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                    }`}
                                            >
                                                <span>{category.name}</span>
                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                                    {category.count}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-gradient-to-br from-primary-50 to-gold-50 dark:from-primary-900/20 dark:to-gold-900/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-800/50">
                                    <BookOpen className="w-8 h-8 text-primary-500 mb-3" />
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">ডিজিটাল আর্কাইভ</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        এখানে কবির সকল প্রকাশিত বইয়ের রচনাসমূহ পড়তে পারবেন। বইতে ক্লিক করে সূচিপত্র দেখুন এবং পছন্দের রচনা পড়ুন।
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Books Grid */}
                        <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold text-gray-900 dark:text-white">{filteredBooks.length}</span> টি বই পাওয়া গেছে
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400"
                                            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <Grid className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400"
                                            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Books Grid */}
                            <div className={viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "space-y-4"
                            }>
                                {filteredBooks.map((book) => (
                                    <Link
                                        key={book.id}
                                        href={`/books/${book.slug}`}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300"
                                    >
                                        {/* Book Cover */}
                                        <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-100 to-gold-100 dark:from-primary-900/30 dark:to-gold-900/30 overflow-hidden flex items-center justify-center">
                                            {book.coverImage ? (
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <BookOpen className="w-16 h-16 text-primary-300 dark:text-primary-700" />
                                            )}
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                <span className="text-white text-sm font-medium flex items-center gap-1">
                                                    রচনা পড়ুন <ChevronRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>

                                        {/* Book Info */}
                                        <div className="p-5">
                                            <span className="inline-block px-2 py-1 mb-2 text-xs font-medium text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                                                {book.category}
                                            </span>
                                            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors line-clamp-1">
                                                {book.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                                                {book.subtitle}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                                <span className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-gold-400">
                                                    <FileText className="w-4 h-4" />
                                                    {book.totalWritings} টি রচনা
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {book.year}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {filteredBooks.length === 0 && (
                                <div className="text-center py-16">
                                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">কোনো বই পাওয়া যায়নি</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
