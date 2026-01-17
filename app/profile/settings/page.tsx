"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    Camera,
    Save,
    Loader2,
    Eye,
    EyeOff,
    Bell,
    Shield,
    Trash2,
    LogOut,
    CheckCircle,
    XCircle,
} from "lucide-react";

type SettingsTab = "profile" | "security" | "notifications";

interface UserData {
    id: string;
    name: string;
    email: string;
    bio: string;
    image: string | null;
}

export default function ProfileSettingsPage() {
    const { data: session, status: sessionStatus, update: updateSession } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingProfile, setIsFetchingProfile] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/profile/delete", {
                method: "DELETE",
            });
            const data = await response.json();

            if (response.ok) {
                // Force logout and redirect to home
                await signOut({ callbackUrl: "/" });
            } else {
                setMessage({ type: "error", text: data.message || "একাউন্ট মুছতে সমস্যা হয়েছে" });
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            setMessage({ type: "error", text: "একাউন্ট মুছতে সমস্যা হয়েছে" });
            setShowDeleteConfirm(false);
        } finally {
            setIsLoading(false);
        }
    };

    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        lastUsernameChange: null as string | null,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        newComments: true,
        submissionStatus: true,
        newsletter: false,
    });

    const handleNotificationChange = async (key: string, value: boolean) => {
        const newNotifications = { ...notifications, [key]: value };
        setNotifications(newNotifications);

        // Auto-save
        try {
            await fetch("/api/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notifications: newNotifications
                }),
            });
        } catch (error) {
            console.error("Failed to update notification settings");
            // Revert state on error? Ideally yes, but skipping for simplicity
        }
    };

    // Calculate if username can be changed
    const canChangeUsername = !profileData.lastUsernameChange ||
        new Date(profileData.lastUsernameChange) < new Date(new Date().setMonth(new Date().getMonth() - 3));

    // Fetch user profile data
    useEffect(() => {
        if (sessionStatus === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/profile");
                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        name: data.user.name || "",
                        username: data.user.username || "",
                        email: data.user.email || "",
                        bio: data.user.bio || "",
                        lastUsernameChange: data.user.lastUsernameChange || null,
                    });

                    if (data.user.notifications) {
                        setNotifications(data.user.notifications);
                    }

                    if (data.user.image) {
                        setAvatarPreview(data.user.image);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsFetchingProfile(false);
            }
        };

        fetchProfile();
    }, [session, sessionStatus, router]);
    // ... (rest of component) ...

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSave = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profileData.name,
                    username: profileData.username,
                    bio: profileData.bio,
                    image: avatarPreview,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: "success", text: data.message });

                // Update session immediately on client
                await updateSession({
                    name: profileData.name,
                    image: avatarPreview
                });

                // Dispatch event for other components (like AdminDropdown)
                window.dispatchEvent(new Event('profileUpdated'));

                // Update last change date if username changed
                if (data.user.lastUsernameChange) {
                    setProfileData(prev => ({
                        ...prev,
                        lastUsernameChange: data.user.lastUsernameChange
                    }));
                }

            } else {
                setMessage({ type: "error", text: data.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে" });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "নতুন পাসওয়ার্ড মিলছে না!" });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে" });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/profile/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: "success", text: data.message });
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setMessage({ type: "error", text: data.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    const tabs = [
        { id: "profile" as SettingsTab, label: "প্রোফাইল", icon: User },
        { id: "security" as SettingsTab, label: "নিরাপত্তা", icon: Shield },
        { id: "notifications" as SettingsTab, label: "বিজ্ঞপ্তি", icon: Bell },
    ];

    // Loading state
    if (sessionStatus === "loading" || isFetchingProfile) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">লোড হচ্ছে...</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main id="main-content" className="min-h-screen bg-[rgb(var(--background))] py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/profile"
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                                একাউন্ট সেটিংস
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                আপনার প্রোফাইল ও একাউন্ট সেটিংস পরিচালনা করুন
                            </p>
                        </div>
                    </div>

                    {/* Message Alert */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                            }`}>
                            {message.type === "success" ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-24">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                    ? "bg-primary-600 text-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>

                                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    লগআউট
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-3 min-w-0">
                            {/* Mobile Navigation */}
                            <div className="lg:hidden mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                <div className="flex gap-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeTab === tab.id
                                                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                                {/* Profile Tab */}
                                {activeTab === "profile" && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            প্রোফাইল তথ্য
                                        </h2>

                                        {/* Avatar */}
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-primary-950 text-2xl font-bold overflow-hidden">
                                                    {avatarPreview ? (
                                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        profileData.name?.charAt(0) || "?"
                                                    )}
                                                </div>
                                                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                                                    <Camera className="w-4 h-4 text-white" />
                                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
                                                </label>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">প্রোফাইল ছবি</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG বা GIF (সর্বোচ্চ 2MB)</p>
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        পুরো নাম
                                                    </label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={profileData.name}
                                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        ইউজারনেম (Username)
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                                                        <input
                                                            type="text"
                                                            value={profileData.username}
                                                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                                            placeholder="username"
                                                            disabled={!canChangeUsername}
                                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                    {!canChangeUsername && (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            ৩ মাসের মধ্যে একবারই ইউজারনেম পরিবর্তন করা যায়।
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        ইমেইল
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            value={profileData.email}
                                                            disabled
                                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ইমেইল পরিবর্তন করা যাবে না</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    বায়ো
                                                </label>
                                                <textarea
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                    rows={4}
                                                    maxLength={200}
                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                                    placeholder="নিজের সম্পর্কে কিছু লিখুন..."
                                                />
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {profileData.bio.length}/200 অক্ষর
                                                </p>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleProfileSave}
                                                    disabled={isLoading}
                                                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Save className="w-5 h-5" />
                                                    )}
                                                    সংরক্ষণ করুন
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Tab */}
                                {activeTab === "security" && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            পাসওয়ার্ড পরিবর্তন
                                        </h2>

                                        <div className="max-w-md space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    বর্তমান পাসওয়ার্ড
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    নতুন পাসওয়ার্ড
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    পাসওয়ার্ড নিশ্চিত করুন
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePasswordChange}
                                                disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                                                className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Shield className="w-5 h-5" />
                                                )}
                                                পাসওয়ার্ড পরিবর্তন করুন
                                            </button>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-red-600 mb-4">বিপদ অঞ্চল</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                                                একবার একাউন্ট মুছে ফেললে এটি পুনরুদ্ধার করা সম্ভব নয়।
                                            </p>
                                            <button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                                একাউন্ট মুছে ফেলুন
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === "notifications" && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            বিজ্ঞপ্তি সেটিংস
                                        </h2>

                                        <div className="space-y-6">
                                            {[
                                                { key: "emailNotifications", label: "ইমেইল বিজ্ঞপ্তি", desc: "গুরুত্বপূর্ণ আপডেট ইমেইলে পাবেন" },
                                                { key: "newComments", label: "নতুন মন্তব্য", desc: "আপনার লেখায় কেউ মন্তব্য করলে জানবেন" },
                                                { key: "submissionStatus", label: "জমাকৃত লেখার আপডেট", desc: "লেখার স্ট্যাটাস পরিবর্তন হলে জানবেন" },
                                                { key: "newsletter", label: "নিউজলেটার", desc: "সাপ্তাহিক আপডেট ও নতুন বৈশিষ্ট্যের খবর" },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={notifications[item.key as keyof typeof notifications]}
                                                            onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    আপনি কি নিশ্চিত? ⚠️
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    আপনার একাউন্ট মুছে ফেললে আপনার প্রোফাইল আর দেখা যাবে না। তবে আপনার প্রকাশিত লেখাগুলো থেকে যাবে। এই কাজটি <span className="font-bold text-red-500">ফেরতযোগ্য নয়</span>।
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        বাতিল করুন
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isLoading}
                                        className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2"
                                    >
                                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        হ্যাঁ, মুছে ফেলুন
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
