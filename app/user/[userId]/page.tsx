"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    Calendar, Users, BookOpen, User as UserIcon, Briefcase,
    FileText, PenTool, Music, Video, Image as ImageIcon, Heart,
    Loader2, AlertCircle, ChevronRight, Eye, Share2, UserPlus, Award, Sparkles, MessageSquare, Check, UserMinus, UserCheck, X
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Types
interface Publication {
    id: string;
    title: string;
    slug: string | null;
    excerpt: string;
    createdAt: string;
    views: number;
    type: string;
    image: string | null;
}

interface UserProfile {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    role: string;
    joinDate: string;
    isFollowing?: boolean;
    stats: {
        comments: number;
        publications: number;
        totalViews: number;
        followers?: number;
        following?: number;
    };
}

// Configuration for Type Icons and Gradients (Premium Look from V2)
const typeIcons: { [key: string]: any } = {
    "শোকবার্তা": { icon: Heart, gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    "প্রবন্ধ": { icon: BookOpen, gradient: "from-blue-500 to-cyan-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    "কবিতা": { icon: PenTool, gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    "ছবিঘর": { icon: ImageIcon, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    "অডিও": { icon: Music, gradient: "from-orange-500 to-amber-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    "ভিডিও": { icon: Video, gradient: "from-red-500 to-rose-600", bg: "bg-red-50 dark:bg-red-900/20" },
    "সব": { icon: Sparkles, gradient: "from-gray-500 to-gray-600", bg: "bg-gray-50 dark:bg-gray-700/50" },
    // Fallbacks
    "গদ্য": { icon: FileText, gradient: "from-blue-500 to-cyan-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    "ব্লগ": { icon: BookOpen, gradient: "from-amber-500 to-yellow-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    "গান": { icon: Music, gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50 dark:bg-pink-900/20" },
};

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const userId = params.userId as string;

    const [user, setUser] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("সব");
    const [copied, setCopied] = useState(false);

    // Follow State
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const categories = ["সব", "শোকবার্তা", "প্রবন্ধ", "কবিতা", "ছবিঘর", "অডিও", "ভিডিও"];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/user/${userId}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("ব্যবহারকারী পাওয়া যায়নি");
                    throw new Error("সার্ভার সমস্যা");
                }
                const data = await res.json();
                setUser(data.user);
                setPosts(data.posts);

                // Set follow state
                setIsFollowing(data.user.isFollowing || false);
                setFollowersCount(data.user.stats.followers || 0);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchProfile();
    }, [userId]);

    const handleFollow = async () => {
        if (status !== "authenticated") {
            setShowLoginModal(true);
            return;
        }

        // Prevent following self (though API also checks)
        if (session.user?.id === userId) return;

        // Optimistic Update
        const previousFollowing = isFollowing;
        const previousCount = followersCount;

        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
        setIsFollowLoading(true);

        try {
            const res = await fetch(`/api/user/${userId}/follow`, {
                method: 'POST'
            });

            if (!res.ok) {
                throw new Error("Failed to follow");
            }
        } catch (error) {
            // Revert on error
            setIsFollowing(previousFollowing);
            setFollowersCount(previousCount);
            console.error("Follow error:", error);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const toBengali = (num: number) => {
        if (!num && num !== 0) return "০";
        const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        return num.toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
            "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
        return `${toBengali(date.getDate())} ${months[date.getMonth()]} ${toBengali(date.getFullYear())}`;
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredPosts = activeCategory === "সব"
        ? posts
        : posts.filter(post => post.type === activeCategory);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">প্রোফাইল লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center px-4">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-4xl">🤷</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
                            ব্যবহারকারী পাওয়া যায়নি
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            কোনো ব্যবহারকারী পাওয়া যায়নি বা তার প্রোফাইল প্রাইভেট করা আছে।
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-colors shadow-lg"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                            মুখপাতায় ফিরুন
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const isInternalProfile = session?.user?.id === userId;

    return (
        <>
            <Header />
            <main id="main-content" className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950">
                {/* Hero Section - The Premium Look */}
                <section className="relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    {/* Floating Orbs */}
                    <div className="absolute top-10 right-20 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-0 left-10 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

                    <div className="relative container-custom py-12 md:py-16">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Avatar with Ring */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000" />
                                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-primary-950 text-4xl md:text-5xl font-bold shadow-2xl overflow-hidden">
                                    <Image
                                        src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                        alt={user.name || "User"}
                                        fill
                                        className="object-cover"
                                        unoptimized // Handle external avatars
                                    />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="text-center md:text-left flex-1">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                                        {user.name}
                                    </h1>
                                </div>
                                <div className="mb-3">
                                    <span className="flex items-center gap-1 px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-medium rounded-full border border-gold-500/30 w-fit md:mx-0 mx-auto">
                                        <Award className="w-3 h-3" />
                                        <Award className="w-3 h-3" />
                                        সদস্য
                                    </span>
                                </div>
                                {user.bio && (
                                    <p className="text-white/70 text-base mb-5 max-w-xl leading-relaxed mx-auto md:mx-0">
                                        {user.bio}
                                    </p>
                                )}

                                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-white/60 mb-6">
                                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                        <Calendar className="w-4 h-4" />
                                        যোগদান: {user.joinDate}
                                    </span>
                                </div>

                                {/* Stats Cards - DYNAMIC */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 flex items-center gap-3">
                                        <Users className="w-5 h-5 text-gold-400" />
                                        <div>
                                            <p className="text-xl font-bold text-white">{toBengali(followersCount)}</p>
                                            <p className="text-xs text-white/60">অনুসারী</p>
                                        </div>
                                    </div>
                                    {[
                                        { value: toBengali(user.stats.publications), label: "প্রকাশিত", icon: FileText },
                                        { value: toBengali(user.stats.comments), label: "মন্তব্য", icon: MessageSquare }, // Changed form Heart to MessageSquare for clarity
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 flex items-center gap-3">
                                            <stat.icon className="w-5 h-5 text-gold-400" />
                                            <div>
                                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                                <p className="text-xs text-white/60">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                {!isInternalProfile && (
                                    <button
                                        onClick={handleFollow}
                                        disabled={isFollowLoading}
                                        className={`flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all shadow-lg ${isFollowing
                                            ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                            : "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 shadow-gold-500/30"
                                            } ${isFollowLoading ? "opacity-70 cursor-wait" : ""}`}
                                    >
                                        {isFollowLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : isFollowing ? (
                                            <>
                                                <UserCheck className="w-5 h-5" />
                                                অনুসরণ করছেন
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5" />
                                                অনুসরণ করুন
                                            </>
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                                    {copied ? "কপি হয়েছে!" : "শেয়ার"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Login Modal */}
                {showLoginModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserPlus className="w-8 h-8 text-primary-600 dark:text-gold-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    অনুসরণ করতে লগইন করুন
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    এই ব্যবহারকারীকে অনুসরণ করতে আপনাকে প্রথমে লগইন করতে হবে।
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <Link
                                    href="/login"
                                    className="block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-center transition-colors shadow-lg shadow-primary-600/25"
                                >
                                    লগইন করুন
                                </Link>
                                <Link
                                    href="/register"
                                    className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl text-center transition-colors"
                                >
                                    নতুন অ্যাকাউন্ট তৈরি করুন
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Publications Section */}
                <section className="py-8 md:py-12">
                    <div className="container-custom max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
                                    <PenTool className="w-5 h-5 text-white" />
                                </div>
                                প্রকাশিত লেখাসমূহ ({toBengali(filteredPosts.length)})
                            </h2>

                            {/* Tabs */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all border ${activeCategory === cat
                                            ? "bg-primary-600 text-white border-primary-600 shadow-md transform scale-105"
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {filteredPosts.map((pub, index) => {
                                    const typeConfig = typeIcons[pub.type] || typeIcons["সব"];
                                    const TypeIcon = typeConfig.icon;

                                    return (
                                        <article
                                            key={pub.id}
                                            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer"
                                        >
                                            {/* Gradient Top Bar */}
                                            <div className={`h-1.5 bg-gradient-to-r ${typeConfig.gradient}`} />

                                            <div className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                        <TypeIcon className="w-7 h-7 text-white" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeConfig.bg} text-gray-700 dark:text-gray-200`}>
                                                                {pub.type}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-bengali">
                                                                {formatDate(pub.createdAt)}
                                                            </span>
                                                        </div>

                                                        <Link href={
                                                            pub.type === "অডিও" ? `/audio/${pub.slug}` :
                                                                pub.type === "ভিডিও" ? `/videos/${pub.slug}` :
                                                                    pub.type === "শোকবার্তা" ? "/tributes" :
                                                                        pub.type === "ছবিঘর" ? "/gallery" :
                                                                            pub.slug ? `/blog/${pub.slug}` : "#"
                                                        }>
                                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors mb-2 line-clamp-2">
                                                                {pub.title}
                                                            </h3>
                                                        </Link>

                                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                                            {pub.excerpt.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
                                                        </p>

                                                        {/* Stats Row */}
                                                        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                                <Eye className="w-4 h-4" />
                                                                {toBengali(pub.views)}
                                                            </span>
                                                            <span className="flex-1" />
                                                            <Link href={
                                                                pub.type === "অডিও" ? `/audio/${pub.slug}` :
                                                                    pub.type === "ভিডিও" ? `/videos/${pub.slug}` :
                                                                        pub.type === "শোকবার্তা" ? "/tributes" :
                                                                            pub.type === "ছবিঘর" ? "/gallery" :
                                                                                pub.slug ? `/blog/${pub.slug}` : "#"
                                                            } className="text-primary-600 dark:text-gold-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                                {pub.type === "শোকবার্তা" || pub.type === "ছবিঘর" ? "দেখুন" : "পড়ুন"}
                                                                <ChevronRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-16 text-center border border-gray-100 dark:border-gray-700 animate-fade-in">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    কোনো {activeCategory} পাওয়া যায়নি
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    এই বিভাগে এখনো কিছু যোগ করা হয়নি
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
