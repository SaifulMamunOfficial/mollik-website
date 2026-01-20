"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PenTool, Clock, Calendar, ChevronRight, User, Loader2, AlertCircle } from "lucide-react";
import { BlogFilter } from "@/components/blog/BlogFilter";

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Define types based on API response
interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    publishedAt: string;
    readTime: string;
    category: string;
    featured: boolean;
    author: {
        name: string | null;
        avatar: string | null;
    };
}

export default function BlogClient() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/blog");
                if (!res.ok) throw new Error("নেটওয়ার্ক সমস্যা");
                const data = await res.json();
                setPosts(data);
            } catch (err) {
                console.error(err);
                setError("লেখাগুলো লোড করা যায়নি");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Filter posts based on search and category
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Layout Logic:
    // Hero Section: Show the latest 3 posts (regardless of featured status)
    // This honors the user request: "blog page e publishing time onujayi sajano hobe"
    const featuredList = posts.slice(0, 3);

    // Sort logic could go here if needed, but assuming API returns createdDesc

    const mainFeatured = featuredList[0];
    const sideFeatured = featuredList.slice(1, 3);
    // If no featured posts, just take recent ones fallback? 
    // Logic: Keep strictly featured. If none, UI will hide section.

    // Get unique categories
    const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Hero / Featured Section */}
                <section className="relative pt-8 pb-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <div>
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                    কবি মল্লিক সম্পর্কে পড়ুন ও লিখুন
                                </h1>
                            </div>
                            <Link
                                href="/blog/new"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30"
                            >
                                <PenTool className="w-4 h-4" />
                                <span>লেখা পাঠান</span>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="h-[400px] flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-red-500 flex flex-col items-center">
                                <AlertCircle className="w-8 h-8 mb-2" />
                                {error}
                            </div>
                        ) : (
                            /* Featured Grid */
                            mainFeatured && (
                                <div className="grid lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
                                    {/* Main Featured Post (Left - 7 cols) */}
                                    <div className="lg:col-span-8 h-full">
                                        <Link href={`/blog/${mainFeatured.slug}`} className="group relative block h-full w-full rounded-2xl overflow-hidden min-h-[300px]">
                                            <Image
                                                src={mainFeatured.coverImage || "/placeholder-blog.jpg"}
                                                alt={mainFeatured.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                                <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full mb-3">
                                                    {mainFeatured.category}
                                                </span>
                                                <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-emerald-400 transition-colors">
                                                    {mainFeatured.title}
                                                </h2>
                                                <div className="flex items-center gap-4 text-gray-300 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden relative">
                                                            {mainFeatured.author.avatar ? (
                                                                <Image src={mainFeatured.author.avatar} alt={mainFeatured.author.name || "User"} fill className="object-cover" />
                                                            ) : (
                                                                <User className="w-4 h-4 m-auto" />
                                                            )}
                                                        </div>
                                                        <span>{mainFeatured.author.name || "অজানা লেখক"}</span>
                                                    </div>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(mainFeatured.publishedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Side Featured Posts (Right - 5 cols) */}
                                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                                        {sideFeatured.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/blog/${post.slug}`}
                                                className="group relative block flex-1 rounded-2xl overflow-hidden min-h-[200px]"
                                            >
                                                <Image
                                                    src={post.coverImage || "/placeholder-blog.jpg"}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                                    <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-md mb-2">
                                                        {post.category}
                                                    </span>
                                                    <h3 className="font-display text-xl font-bold text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </section>

                {/* Filter & List Section */}
                <section className="py-12">
                    <div className="container-custom">
                        {/* Search and Category Filter */}
                        <BlogFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        {/* Loading/Error State for list */}
                        {loading && posts.length === 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : filteredPosts.length > 0 ? (
                            /* Posts Grid */
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post) => (
                                    <article key={post.id} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300">
                                        {/* Image */}
                                        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                                            <Image
                                                src={post.coverImage || "/placeholder-image.jpg"}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-bold text-emerald-600 dark:text-emerald-400 rounded-lg shadow-sm">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(post.publishedAt)}
                                                </span>
                                            </div>

                                            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.title}
                                                </Link>
                                            </h3>

                                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                                                {post.excerpt.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
                                            </p>

                                            {/* Author & Action */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                                        {post.author.avatar ? (
                                                            <Image src={post.author.avatar} alt={post.author.name || "User"} fill className="object-cover" />
                                                        ) : (
                                                            <User className="w-4 h-4 m-auto text-gray-400" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        {post.author.name || "অজানা লেখক"}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                <p className="text-gray-500">কোনো লেখা পাওয়া যায়নি</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
