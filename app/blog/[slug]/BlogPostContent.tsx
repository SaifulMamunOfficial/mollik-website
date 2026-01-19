"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/components/comments/CommentSection";
import { Calendar, Eye, Share2, Heart, ArrowLeft, Clock, User, Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react";

// Types matching the simplified prop structure from the server component
interface EnhancedBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    publishedAt: string;
    category: string;
    tags: string[];
    author: {
        id: string;
        name: string;
        avatar: string;
        role: string;
        bio: string;
    };
}

interface BlogPostContentProps {
    post: EnhancedBlogPost;
    relatedPosts: EnhancedBlogPost[];
}

import { AuthModal } from "@/components/shared/AuthModal";

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
    // Scroll & Copy State
    const [copied, setCopied] = useState(false);
    const [scrolled, setScrolled] = useState(0);

    // Like State
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Handle scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrolled(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Initial check for like status
    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const res = await fetch(`/api/blog/${post.slug}/like`, {
                    cache: 'no-store',
                    headers: {
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache'
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLikeCount(data.likeCount);
                    setIsLiked(data.isLiked);
                }
            } catch (error) {
                console.error("Error checking like status:", error);
            }
        };
        checkLikeStatus();
    }, [post.slug]);

    const handleLike = async () => {
        setLikeLoading(true);
        // Optimistic UI update
        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            const res = await fetch(`/api/blog/${post.slug}/like`, {
                method: 'POST',
                cache: 'no-store'
            });

            if (!res.ok) {
                if (res.status === 401) {
                    // Revert state
                    setIsLiked(previousLiked);
                    setLikeCount(previousCount);
                    // Show Auth Modal
                    setShowAuthModal(true);
                    return;
                }
                throw new Error("Failed to like");
            }

            const data = await res.json();
            // Sync with server source of truth
            setLikeCount(data.likeCount);
            setIsLiked(data.isLiked);

        } catch (error) {
            // Revert state on error
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        } finally {
            setLikeLoading(false);
        }
    };

    return (
        <>
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                title="লগইন প্রয়োজন"
                message="পোস্টে লাইক দিতে বা প্রতিক্রিয়া জানাতে অনুগ্রহ করে লগইন করুন।"
            />

            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-[100]">
                <div
                    className="h-full bg-emerald-500 transition-all duration-150 ease-out"
                    style={{ width: `${scrolled}%` }}
                />
            </div>

            <Header />
            <main className="min-h-screen bg-white dark:bg-gray-950">
                {/* Hero / Cover Image */}
                <div className="relative h-[60vh] min-h-[400px] w-full">
                    <Image
                        src={post.coverImage || "/placeholder-blog.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

                    <div className="absolute inset-0 container-custom flex flex-col justify-end pb-16">
                        <div className="max-w-4xl mx-auto w-full">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>ব্লগ এ ফিরে যান</span>
                            </Link>

                            <span className="inline-block px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-full mb-6">
                                {post.category}
                            </span>

                            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden relative border-2 border-white/20">
                                        {post.author.avatar ? (
                                            <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 m-auto" />
                                        )}
                                    </div>
                                    <span className="font-medium text-white">{post.author.name}</span>
                                </div>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {post.publishedAt}
                                </span>

                                {/* Hero Like Button */}
                                <button
                                    onClick={handleLike}
                                    disabled={likeLoading}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all ${isLiked
                                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                    <span className="text-sm font-medium">{new Intl.NumberFormat('bn-BD').format(likeCount)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-custom py-16">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <article className="lg:col-span-8">
                            <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-loose prose-img:rounded-2xl">
                                <p className="lead font-medium text-xl md:text-2xl text-gray-900 dark:text-white mb-8 border-l-4 border-emerald-500 pl-6 italic">
                                    {post.excerpt}
                                </p>
                                <div className="whitespace-pre-line font-serif">
                                    {post.content}
                                </div>
                            </div>

                            {/* Tags & Share - Single Line */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {post.tags && post.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Share Buttons */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">শেয়ার:</span>
                                    <button onClick={handleCopy} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors" title="Copy Link">
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button className="p-2 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-colors">
                                        <Facebook className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors">
                                        <Twitter className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Author Box */}
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-6">
                                    লেখক পরিচিতি
                                </h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                        {post.author.avatar ? (
                                            <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 m-auto text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                            {post.author.name}
                                        </h4>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">
                                            {post.author.role === 'ADMIN' ? 'কন্ট্রিবিউটর' : 'গেস্ট রাইটার'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                    {post.author.bio || "তিনি সাহিত্য ও সংস্কৃতির প্রতি অনুরাগী।"}
                                </p>
                                <Link href={`/user/${post.author.id}`} className="block w-full py-2.5 text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors">
                                    প্রোফাইল দেখুন
                                </Link>
                            </div>

                            {/* Related Posts */}
                            {relatedPosts.length > 0 && (
                                <div>
                                    <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-6 pl-2 border-l-4 border-emerald-500">
                                        আরও পড়ুন
                                    </h3>
                                    <div className="flex flex-col gap-6">
                                        {relatedPosts.map(related => (
                                            <Link key={related.id} href={`/blog/${related.slug}`} className="group flex gap-4 items-start">
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <Image
                                                        src={related.coverImage || "/placeholder-blog.jpg"}
                                                        alt={related.title}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                                                        {related.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {related.publishedAt}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>

                    {/* Comment Section - Outside Grid */}
                    <div className="mt-12 max-w-4xl">
                        <CommentSection blogPostId={post.id} title="পাঠকদের মন্তব্য" />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
