"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    User,
    Settings,
    FileText,
    Heart,
    Bell,
    Calendar,
    Edit3,
    PenTool,
    BookOpen,
    MessageSquare,
    ChevronRight,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    Sparkles,
    TrendingUp,
    Eye,
    Share2,
    MoreHorizontal,
    Loader2,
    Shield,
} from "lucide-react";

type TabType = "submissions" | "favorites" | "activity";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio: string;
    role: string;
    joinedDate: string;
    stats: {
        submissions: number;
        comments: number;
        tributes: number;
        views: number;
    };
}

interface Submission {
    id: string;
    slug: string;
    title: string;
    type: string;
    status: string;
    date: string;
    views: number;
}

interface Activity {
    id: string;
    action: string;
    target: string;
    time: string;
}

const statusConfig = {
    pending: { label: "অপেক্ষমাণ", icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
    published: { label: "প্রকাশিত", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" },
    rejected: { label: "প্রত্যাখ্যাত", icon: XCircle, color: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
    draft: { label: "খসড়া", icon: FileText, color: "text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800" },
    archived: { label: "আর্কাইভ", icon: FileText, color: "text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800" },
};

const typeIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; gradient: string }> = {
    "কবিতা": { icon: PenTool, gradient: "from-violet-500 to-purple-600" },
    "গদ্য": { icon: BookOpen, gradient: "from-blue-500 to-cyan-600" },
    "ব্লগ": { icon: MessageSquare, gradient: "from-orange-500 to-red-600" },
    "গান": { icon: Sparkles, gradient: "from-pink-500 to-rose-600" },
    "শোকবার্তা": { icon: Heart, gradient: "from-rose-500 to-pink-600" },
};

export default function ProfileClient() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("submissions");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Profile data state
    const [user, setUser] = useState<UserProfile | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [favorites, setFavorites] = useState<Submission[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);

    // Fetch profile data
    useEffect(() => {
        if (sessionStatus === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch("/api/profile", { cache: "no-store" });

                if (!response.ok) {
                    throw new Error("প্রোফাইল লোড করতে সমস্যা হয়েছে");
                }

                const data = await response.json();
                setUser(data.user);
                setSubmissions(data.submissions || []);
                setFavorites(data.favorites || []);
                setActivities(data.recentActivity || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [session, sessionStatus, router]);

    const tabs = [
        { id: "submissions" as TabType, label: "আমার লেখা", icon: FileText, count: submissions.length },
        { id: "favorites" as TabType, label: "প্রিয় তালিকা", icon: Heart, count: favorites.length },
        { id: "activity" as TabType, label: "কার্যকলাপ", icon: Clock, count: activities.length },
    ];

    // Loading state
    if (sessionStatus === "loading" || isLoading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">প্রোফাইল লোড হচ্ছে...</p>
                    </div>
                </main>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                </main>
            </>
        );
    }

    if (!user) return null;

    return (
        <>
            <Header />
            <main id="main-content" className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950">
                {/* Hero Section with Decorative Elements */}
                <section className="relative overflow-hidden">
                    {/* Background Pattern */}
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
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                            {/* Avatar with Ring */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-primary-950 text-4xl md:text-5xl font-bold shadow-2xl">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0) || "?"
                                    )}
                                </div>
                                <button className="absolute bottom-1 right-1 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white dark:border-gray-700">
                                    <Edit3 className="w-4 h-4 text-primary-600" />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="text-center lg:text-left flex-1">
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                                        {user.name}
                                    </h1>
                                </div>
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-medium rounded-full border border-gold-500/30">
                                        {user.role === "ADMIN" ? "অ্যাডমিন" : user.role === "MODERATOR" ? "মডারেটর" : "সদস্য"}
                                    </span>
                                </div>
                                <p className="text-white/70 text-base mb-5 max-w-lg leading-relaxed">{user.bio}</p>

                                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-white/60 mb-6">
                                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                        <Calendar className="w-4 h-4" />
                                        যোগদান: {user.joinedDate}
                                    </span>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
                                    {[
                                        { value: user.stats.submissions, label: "লেখা", icon: FileText, color: "from-violet-500 to-purple-600" },
                                        { value: user.stats.views, label: "মোট ভিউ", icon: Eye, color: "from-rose-500 to-pink-600" },
                                        { value: user.stats.comments, label: "মন্তব্য", icon: MessageSquare, color: "from-blue-500 to-cyan-600" },
                                        { value: user.stats.tributes, label: "শ্রদ্ধাঞ্জলি", icon: Sparkles, color: "from-amber-500 to-orange-600" },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors group cursor-default">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                                            <p className="text-xs text-white/60">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-row lg:flex-col gap-3">
                                <Link
                                    href="/profile/settings"
                                    className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="hidden sm:inline">সেটিংস</span>
                                </Link>
                                <Link
                                    href="/blog/new"
                                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-semibold rounded-xl transition-all shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:scale-105"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="hidden sm:inline">নতুন লেখা</span>
                                </Link>
                                <button className="flex items-center justify-center w-12 h-12 lg:w-auto lg:px-5 lg:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10">
                                    <Share2 className="w-5 h-5" />
                                    <span className="hidden lg:inline ml-2">শেয়ার</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-8 md:py-12">
                    <div className="container-custom">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${isActive
                                            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30"
                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-700"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"}`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-fade-in">
                            {/* Submissions Tab */}
                            {activeTab === "submissions" && (
                                <div className="space-y-4">
                                    {submissions.length > 0 ? (
                                        submissions.map((item, index) => {
                                            const status = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.draft;
                                            const StatusIcon = status.icon;
                                            const typeConfig = typeIcons[item.type] || typeIcons["ব্লগ"];
                                            const TypeIcon = typeConfig.icon;

                                            return (
                                                <Link
                                                    href={`/blog/${item.slug}`}
                                                    key={item.id}
                                                    className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <div className="p-5 md:p-6">
                                                        <div className="flex items-start gap-4">
                                                            {/* Icon */}
                                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                                <TypeIcon className="w-7 h-7 text-white" />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                    <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                                                                        {item.type}
                                                                    </span>
                                                                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border ${status.color}`}>
                                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                                        {status.label}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                    {item.date}
                                                                </p>

                                                                {/* Stats Row */}
                                                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                                        <Eye className="w-4 h-4" />
                                                                        {item.views} বার দেখা হয়েছে
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-2">
                                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-16 text-center border border-gray-100 dark:border-gray-700">
                                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                <FileText className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">এখনো কোনো লেখা জমা দেননি</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-6">আপনার প্রথম কবিতা, গদ্য বা ব্লগ পোস্ট লিখুন</p>
                                            <Link href="/blog/new" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-colors shadow-lg">
                                                <Plus className="w-5 h-5" />
                                                প্রথম লেখা শুরু করুন
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Favorites Tab */}
                            {/* Favorites Tab */}
                            {activeTab === "favorites" && (
                                <div className="space-y-4">
                                    {favorites.length > 0 ? (
                                        favorites.map((item, index) => {
                                            const status = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.published;
                                            const typeConfig = typeIcons[item.type] || typeIcons["ব্লগ"];
                                            const TypeIcon = typeConfig.icon;

                                            return (
                                                <Link
                                                    href={`/blog/${item.slug}`}
                                                    key={item.id}
                                                    className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <div className="p-5 md:p-6">
                                                        <div className="flex items-start gap-4">
                                                            {/* Icon */}
                                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                                <Heart className="w-7 h-7 text-white fill-current" />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                    <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                                                                        {item.type}
                                                                    </span>
                                                                    <span className="text-xs px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full font-medium">
                                                                        পছন্দ করা হয়েছে
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                    প্রকাশিত: {item.date}
                                                                </p>

                                                                {/* Stats Row */}
                                                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                                        <Eye className="w-4 h-4" />
                                                                        {item.views} বার দেখা হয়েছে
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-2">
                                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-16 text-center border border-gray-100 dark:border-gray-700">
                                            <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400">প্রিয় তালিকায় কিছু নেই</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">আপনি যেসব পোস্টে লাইক করবেন সেগুলো এখানে থাকবে</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Activity Tab */}
                            {activeTab === "activity" && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {activities.length > 0 ? (
                                            activities.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center flex-shrink-0">
                                                            <MessageSquare className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-gray-900 dark:text-white">
                                                                <span className="font-medium">{item.action}</span>{" "}
                                                                <span className="text-primary-600 dark:text-gold-400 font-medium">"{item.target}"</span>
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {item.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-16 text-center">
                                                <Clock className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                                <p className="text-gray-500 dark:text-gray-400">কোনো কার্যকলাপ নেই</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Links Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            {[
                                { href: "/profile/notifications", icon: Bell, title: "বিজ্ঞপ্তি", desc: "শীঘ্রই আসছে", color: "from-blue-500 to-indigo-600" },
                                { href: "/blog/new", icon: TrendingUp, title: "নতুন ব্লগ", desc: "আপনার লেখা শেয়ার করুন", color: "from-emerald-500 to-teal-600" },
                                { href: "/profile/settings", icon: Settings, title: "সেটিংস", desc: "প্রোফাইল এডিট", color: "from-gray-500 to-gray-600" },
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <link.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">{link.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{link.desc}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
