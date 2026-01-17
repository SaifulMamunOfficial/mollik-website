"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search, BookOpen, Calendar, FileText, Filter, Grid, List, ChevronRight } from "lucide-react";

// Mock Data for Books (as collections of writings)
import { allBooks } from "@/lib/data";

const categories = [
    { id: "all", name: "সব বই", count: allBooks.length },
    { id: "poetry", name: "কবিতা সংকলন", count: allBooks.filter(b => b.categoryId === 'poetry').length },
    { id: "songs", name: "গান সংকলন", count: allBooks.filter(b => b.categoryId === 'songs').length },
    { id: "essays", name: "প্রবন্ধ", count: allBooks.filter(b => b.categoryId === 'essays').length },
    { id: "children", name: "শিশু সাহিত্য", count: allBooks.filter(b => b.categoryId === 'children').length },
    { id: "complete", name: "রচনাবলী", count: allBooks.filter(b => b.categoryId === 'complete').length },
];

export default function BooksPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredBooks = allBooks.filter((book) => {
        const matchesCategory = selectedCategory === "all" || book.categoryId === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-primary-100/30 via-transparent to-transparent dark:from-primary-900/20 blur-3xl" />

                    <div className="container-custom relative">
                        <div className="text-center max-w-3xl mx-auto">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-gold-500 dark:to-gold-600 rounded-3xl shadow-xl shadow-primary-500/25 dark:shadow-gold-500/25 mb-8 transform -rotate-6">
                                <BookOpen className="w-10 h-10 text-white transform rotate-6" />
                            </div>

                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                গ্রন্থাগার
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                                কবি মতিউর রহমান মল্লিকের প্রকাশিত গ্রন্থসমূহ পড়ুন। বইতে ক্লিক করে সেই বইয়ের সকল রচনা পড়তে পারবেন।
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-xl mx-auto relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="বই খুঁজুন..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-gold-500 focus:border-transparent shadow-lg shadow-gray-200/50 dark:shadow-none transition-all"
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
                                {/* Mobile Categories (Horizontal Scroll) */}
                                <div className="lg:hidden mb-8">
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
                                                    ? "bg-primary-600 dark:bg-gold-500 text-white dark:text-gray-900 shadow-md shadow-primary-500/20"
                                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    }`}
                                            >
                                                {category.name}
                                                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${selectedCategory === category.id
                                                    ? "bg-white/20 text-white dark:text-gray-900"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                                    }`}>
                                                    {category.count}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <span className="font-semibold text-gray-900 dark:text-white">{filteredBooks.length}</span> টি বই পাওয়া গেছে
                                    </p>
                                    <div className="flex items-center gap-2 relative z-[60]">
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-gold-400"
                                                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                            aria-label="Grid View"
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
                                            aria-label="List View"
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
                                        viewMode === "grid" ? (
                                            <Link
                                                key={book.id}
                                                href={`/books/${book.slug}`}
                                                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300"
                                            >
                                                {/* Book Cover Placeholder */}
                                                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-100 to-gold-100 dark:from-primary-900/30 dark:to-gold-900/30 overflow-hidden flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-primary-300 dark:text-primary-700" />
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
                                        ) : (
                                            <Link
                                                key={book.id}
                                                href={`/books/${book.slug}`}
                                                className="group flex gap-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300"
                                            >
                                                {/* Book Cover */}
                                                <div className="w-20 h-24 flex-shrink-0 bg-gradient-to-br from-primary-100 to-gold-100 dark:from-primary-900/30 dark:to-gold-900/30 rounded-xl flex items-center justify-center">
                                                    <BookOpen className="w-8 h-8 text-primary-300 dark:text-primary-700" />
                                                </div>

                                                {/* Book Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <span className="inline-block px-2 py-1 mb-2 text-xs font-medium text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                                                                {book.category}
                                                            </span>
                                                            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                                {book.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {book.subtitle}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                                    </div>

                                                    <div className="flex items-center gap-4 mt-3 text-sm">
                                                        <span className="flex items-center gap-1 font-medium text-primary-600 dark:text-gold-400">
                                                            <FileText className="w-4 h-4" />
                                                            {book.totalWritings} টি রচনা
                                                        </span>
                                                        <span className="flex items-center gap-1 text-gray-400">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {book.year}
                                                        </span>
                                                        <span className="text-gray-400">{book.publisher}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
