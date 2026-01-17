"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    User,
    Calendar,
    MessageSquare,
    FileText,
    ArrowLeft,
    Loader2,
    Shield,
} from "lucide-react";

interface UserProfile {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    role: string;
    joinDate: string;
    stats: {
        comments: number;
        posts: number;
    };
}

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    createdAt: string;
    views: number;
}

interface PageProps {
    params: {
        userId: string;
    };
}

export default function PublicProfilePage({ params }: PageProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/users/${params.userId}`);
                const data = await response.json();

                if (response.ok) {
                    setUser(data.user);
                    setPosts(data.posts || []);
                } else {
                    setError(data.message || "প্রোফাইল পাওয়া যায়নি");
                }
            } catch (err) {
                setError("প্রোফাইল লোড করতে সমস্যা হয়েছে");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [params.userId]);

    // Loading state
    if (isLoading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary-600 dark:text-gold-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">প্রোফাইল লোড হচ্ছে...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Error state
    if (error || !user) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center max-w-md px-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            ব্যবহারকারী পাওয়া যায়নি
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {error || "আপনি যে প্রোফাইলটি খুঁজছেন তা এখানে নেই।"}
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            ফিরে যান
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="container-custom py-12">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-gold-400 mb-8 transition-all group text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>ফিরে যান</span>
                    </button>

                    {/* Profile Card */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            {/* Header Banner */}
                            <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-gold-500 dark:from-primary-700 dark:via-primary-800 dark:to-gold-600" />

                            {/* Profile Info */}
                            <div className="relative px-6 pb-6">
                                {/* Avatar */}
                                <div className="absolute -top-16 left-6">
                                    <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-1 shadow-xl">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-gold-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name || ""}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                user.name?.charAt(0) || "?"
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Name and Role Badge */}
                                <div className="pt-20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {user.name || "অজানা ব্যবহারকারী"}
                                        </h1>
                                        {user.role === "ADMIN" && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-full">
                                                <Shield className="w-3.5 h-3.5" />
                                                অ্যাডমিন
                                            </span>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    {user.bio && (
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-xl">
                                            {user.bio}
                                        </p>
                                    )}

                                    {/* Join Date */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        <Calendar className="w-4 h-4" />
                                        <span>যোগদান: {user.joinDate}</span>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                                                <MessageSquare className="w-5 h-5 text-primary-500" />
                                                {user.stats.comments}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">মন্তব্য</p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-600" />
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                                                <FileText className="w-5 h-5 text-gold-500" />
                                                {user.stats.posts}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">পোস্ট</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User's Published Posts */}
                        {posts.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary-600 dark:text-gold-400" />
                                    প্রকাশিত লেখা
                                </h2>
                                <div className="grid gap-4">
                                    {posts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug}`}
                                            className="block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-gold-600/30 hover:shadow-lg transition-all group"
                                        >
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
