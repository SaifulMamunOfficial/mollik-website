"use client";

import { useState, useEffect } from "react";
import { Settings, Globe, Bell, Palette, Save, Loader2, Check, X, AlertTriangle, Share2, Facebook, Twitter, Youtube, Mail, Calendar } from "lucide-react";
import LinkListEditor from "@/components/admin/LinkListEditor";

interface SocialLinks {
    facebook: string;
    twitter: string;
    youtube: string;
    email: string;
}

interface FooterLink {
    name: string;
    href: string;
}

interface SiteSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    bornDate: string;
    deathDate: string;
    socialLinks: SocialLinks;
    footerExplore?: FooterLink[];
    footerAbout?: FooterLink[];
    footerConnect?: FooterLink[];
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: "",
        siteDescription: "",
        contactEmail: "",
        bornDate: "১৯৫০",
        deathDate: "২০১০",
        socialLinks: {
            facebook: "",
            twitter: "",
            youtube: "",
            email: ""
        },
        footerExplore: [],
        footerAbout: [],
        footerConnect: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    siteName: data.siteName || "",
                    siteDescription: data.siteDescription || "",
                    contactEmail: data.contactEmail || "",
                    bornDate: data.bornDate || "১৯৫০",
                    deathDate: data.deathDate || "২০১০",
                    socialLinks: data.socialLinks || {
                        facebook: "",
                        twitter: "",
                        youtube: "",
                        email: ""
                    },
                    footerExplore: data.footerExplore || [],
                    footerAbout: data.footerAbout || [],
                    footerConnect: data.footerConnect || []
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setShowSuccess(false);
        setShowError(false);

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে");
                setShowError(true);
                return;
            }

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setErrorMessage("সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে");
            setShowError(true);
        } finally {
            setSaving(false);
        }
    };

    const updateSocialLink = (key: keyof SocialLinks, value: string) => {
        setSettings({
            ...settings,
            socialLinks: {
                ...settings.socialLinks,
                [key]: value
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">সেটিংস</h1>
                    <p className="text-gray-600 mt-1">সাইটের সাধারণ সেটিংস পরিচালনা করুন</p>
                </div>

                {/* Save Button - Top */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {saving ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সেভ করুন"}
                </button>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shadow-lg animate-in slide-in-from-top fade-in duration-300">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-medium">সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
                </div>
            )}

            {/* Error Modal */}
            {showError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95">
                        <button
                            onClick={() => setShowError(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">সমস্যা হয়েছে!</h3>
                            <p className="text-gray-500 mb-6">{errorMessage}</p>
                            <button
                                onClick={() => setShowError(false)}
                                className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl"
                            >
                                ঠিক আছে
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Globe className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">সাধারণ সেটিংস</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                সাইটের নাম
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                সাইটের বিবরণ
                            </label>
                            <textarea
                                rows={3}
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                যোগাযোগ ইমেইল
                            </label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Timeline Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <Calendar className="text-indigo-600" size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">সময়কাল</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                জন্ম সাল
                            </label>
                            <input
                                type="text"
                                value={settings.bornDate}
                                onChange={(e) => setSettings({ ...settings, bornDate: e.target.value })}
                                placeholder="যেমন: ১৯৫০"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                মৃত্যু সাল
                            </label>
                            <input
                                type="text"
                                value={settings.deathDate}
                                onChange={(e) => setSettings({ ...settings, deathDate: e.target.value })}
                                placeholder="যেমন: ২০১০"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-pink-100 p-2 rounded-lg">
                            <Share2 className="text-pink-600" size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">সোশ্যাল লিংক</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Facebook size={16} className="text-blue-600" />
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={settings.socialLinks.facebook}
                                onChange={(e) => updateSocialLink("facebook", e.target.value)}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Twitter size={16} className="text-sky-500" />
                                Twitter
                            </label>
                            <input
                                type="url"
                                value={settings.socialLinks.twitter}
                                onChange={(e) => updateSocialLink("twitter", e.target.value)}
                                placeholder="https://twitter.com/..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Youtube size={16} className="text-red-600" />
                                YouTube
                            </label>
                            <input
                                type="url"
                                value={settings.socialLinks.youtube}
                                onChange={(e) => updateSocialLink("youtube", e.target.value)}
                                placeholder="https://youtube.com/..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Mail size={16} className="text-gray-600" />
                                ইমেইল
                            </label>
                            <input
                                type="email"
                                value={settings.socialLinks.email}
                                onChange={(e) => updateSocialLink("email", e.target.value)}
                                placeholder="contact@example.com"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>


                {/* Footer Settings */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                            <Settings className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">ফুটার সেটিংস</h2>
                            <p className="text-sm text-gray-600">ওয়েবসাইটের নিচের অংশের লিংকগুলো পরিবর্তন করুন</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <LinkListEditor
                            title="আরো দেখুন (Explore)"
                            links={settings.footerExplore || []}
                            onChange={(links) => setSettings({ ...settings, footerExplore: links })}
                        />
                        <LinkListEditor
                            title="কবি সম্পর্কে (About)"
                            links={settings.footerAbout || []}
                            onChange={(links) => setSettings({ ...settings, footerAbout: links })}
                        />
                        <LinkListEditor
                            title="যোগাযোগ (Connect)"
                            links={settings.footerConnect || []}
                            onChange={(links) => setSettings({ ...settings, footerConnect: links })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
