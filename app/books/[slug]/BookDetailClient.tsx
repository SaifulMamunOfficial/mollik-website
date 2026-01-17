
"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    Calendar,
    ArrowLeft,
    BookOpen,
    FileText,
    Search,
    ChevronRight,
    Clock
} from "lucide-react";

interface Book {
    id: number;
    slug: string;
    title: string;
    subtitle?: string;
    description: string;
    year: string;
    publisher: string;
    category: string;
    categoryId: string;
    coverImage?: string;
    totalWritings: number;
}

interface Writing {
    id: string;
    slug: string;
    title: string;
    type: string;
    readTime: string;
}

interface Props {
    book: Book;
    writings: Writing[];
}

export default function BookDetailClient({ book, writings }: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredWritings = writings.filter((writing) =>
        writing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary-100/30 via-transparent to-transparent dark:from-primary-900/20 blur-3xl" />

                    <div className="container-custom relative">
                        {/* Back Button */}
                        <Link
                            href="/books"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-gold-400 mb-8 transition-all group text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>সকল বই</span>
                        </Link>

                        <div className="max-w-4xl">
                            {/* Category Badge */}
                            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                                {book.category}
                            </span>

                            {/* Title */}
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                {book.title}
                            </h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
                                {book.subtitle}
                            </p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary-500" />
                                    {book.year}
                                </span>
                                <span className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary-500" />
                                    {book.publisher}
                                </span>
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary-500" />
                                    {book.totalWritings} টি রচনা
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {book.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Writings List Section */}
                <section className="py-12">
                    <div className="container-custom">
                        <div className="max-w-4xl">
                            {/* Section Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-gold-500 rounded-full" />
                                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                                        সূচিপত্র
                                    </h2>
                                </div>

                                {/* Search */}
                                <div className="relative max-w-xs w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="রচনা খুঁজুন..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-gold-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Writings List */}
                            <div className="space-y-3">
                                {filteredWritings.map((writing, index) => (
                                    <Link
                                        key={writing.id}
                                        href={`/books/${book.slug}/${writing.slug}`}
                                        className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800/50 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-none transition-all"
                                    >
                                        {/* Number */}
                                        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                            {index + 1}
                                        </span>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                {writing.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                    {writing.type}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {writing.readTime}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                    </Link>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredWritings.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">কোনো রচনা পাওয়া যায়নি</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Other Books Section - Could be fetched in Server Component too, but keeping simple for now */}
            </main>
            <Footer />
        </>
    );
}
