"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Twitter, Youtube, Mail, ArrowUp, Users } from "lucide-react";

// Convert English numbers to Bengali
const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

const footerLinks = {
    explore: [
        { name: "ছবিঘর", href: "/gallery" },
        { name: "অডিও", href: "/audio" },
        { name: "ভিডিও", href: "/videos" },
        { name: "শোকবার্তা", href: "/tributes" },
    ],
    about: [
        { name: "জীবনী", href: "/biography" },
        { name: "টাইমলাইন", href: "/biography#timeline" },
        { name: "ব্লগ", href: "/blog" },
    ],
    connect: [
        { name: "যোগাযোগ", href: "/contact" },
        { name: "লেখা পাঠান", href: "/blog/new" },
    ],
};

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

export function Footer() {
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [settings, setSettings] = useState<SiteSettings>({
        siteName: "মতিউর রহমান মল্লিক",
        siteDescription: "কবি মতিউর রহমান মল্লিকের কবিতা, গান এবং সাহিত্যকর্মের ডিজিটাল সংগ্রহশালা।",
        contactEmail: "info@mollik.com",
        bornDate: "১৯৫০",
        deathDate: "২০১০",
        socialLinks: {
            facebook: "https://facebook.com",
            twitter: "https://twitter.com",
            youtube: "https://youtube.com",
            email: "contact@motiurrahmanmollik.com"
        },
        footerExplore: [],
        footerAbout: [],
        footerConnect: []
    });

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setEmail("");
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const initVisitorCount = async () => {
            try {
                const hasVisited = sessionStorage.getItem('mollik_session_visit');
                let response;

                if (!hasVisited) {
                    response = await fetch('/api/visitor', { method: 'POST' });
                    sessionStorage.setItem('mollik_session_visit', 'true');
                } else {
                    response = await fetch('/api/visitor');
                }

                if (response.ok) {
                    const data = await response.json();
                    setVisitorCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch visitor count:", error);
                setVisitorCount(15234);
            }
        };

        initVisitorCount();

        const interval = setInterval(async () => {
            try {
                const response = await fetch('/api/visitor');
                if (response.ok) {
                    const data = await response.json();
                    setVisitorCount(data.count);
                }
            } catch (e) {
                // Ignore polling errors
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Fetch site settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        siteName: data.siteName || "মতিউর রহমান মল্লিক",
                        siteDescription: data.siteDescription || "কবি মতিউর রহমান মল্লিকের কবিতা, গান এবং সাহিত্যকর্মের ডিজিটাল সংগ্রহশালা।",
                        contactEmail: data.contactEmail || "info@mollik.com",
                        bornDate: data.bornDate || "১৯৫০",
                        deathDate: data.deathDate || "২০১০",
                        socialLinks: data.socialLinks || {
                            facebook: "https://facebook.com",
                            twitter: "https://twitter.com",
                            youtube: "https://youtube.com",
                            email: "contact@motiurrahmanmollik.com"
                        },
                        footerExplore: data.footerExplore || [],
                        footerAbout: data.footerAbout || [],
                        footerConnect: data.footerConnect || []
                    });
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Build dynamic social links
    const dynamicSocialLinks = [
        { name: "Facebook", icon: Facebook, href: settings.socialLinks.facebook },
        { name: "Twitter", icon: Twitter, href: settings.socialLinks.twitter },
        { name: "YouTube", icon: Youtube, href: settings.socialLinks.youtube },
        { name: "Email", icon: Mail, href: `mailto:${settings.socialLinks.email}` },
    ].filter(link => link.href && link.href !== "mailto:");

    // Use dynamic links if available, otherwise fallback to defaults
    const exploreLinks = settings.footerExplore && settings.footerExplore.length > 0
        ? settings.footerExplore
        : footerLinks.explore;

    const aboutLinks = settings.footerAbout && settings.footerAbout.length > 0
        ? settings.footerAbout
        : footerLinks.about;

    const connectLinks = settings.footerConnect && settings.footerConnect.length > 0
        ? settings.footerConnect
        : footerLinks.connect;

    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300">
            {/* ... (rest of the detailed footer code remains same until link mapping) ... */}
            <div className="h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600" />

            <div className="container-custom py-12 md:py-16">
                {/* Brand Section - Always full width on top for mobile */}
                <div className="mb-8 md:mb-0 md:hidden">
                    <Link href="/" className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-white font-display font-bold text-lg">
                            {settings.siteName[0]}
                        </div>
                        <div>
                            <h2 className="font-display font-semibold text-lg text-white">
                                {settings.siteName}
                            </h2>
                            <p className="text-xs text-gray-400">{settings.bornDate} - {settings.deathDate}</p>
                        </div>
                    </Link>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        {settings.siteDescription}
                    </p>
                    {/* Social Links Mobile */}
                    <div className="flex gap-3">
                        {dynamicSocialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                                aria-label={social.name}
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links Grid - 2 columns on mobile, 4 on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
                    {/* Brand Column - Desktop only */}
                    <div className="hidden md:block lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-white font-display font-bold text-xl">
                                {settings.siteName[0]}
                            </div>
                            <div>
                                <h2 className="font-display font-semibold text-xl text-white">
                                    {settings.siteName}
                                </h2>
                                <p className="text-sm text-gray-400">{settings.bornDate} - {settings.deathDate}</p>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            ভবিষ্যৎ প্রজন্মের জন্য সংরক্ষিত সাহিত্যিক ঐতিহ্য। {settings.siteDescription}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {dynamicSocialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore Column */}
                    <div>
                        <h3 className="font-display font-semibold text-base md:text-lg text-white mb-3 md:mb-4">
                            আরো দেখুন
                        </h3>
                        <ul className="space-y-2 md:space-y-3">
                            {exploreLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm md:text-base text-gray-400 hover:text-gold-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Column */}
                    <div>
                        <h3 className="font-display font-semibold text-base md:text-lg text-white mb-3 md:mb-4">
                            কবি সম্পর্কে
                        </h3>
                        <ul className="space-y-2 md:space-y-3">
                            {aboutLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm md:text-base text-gray-400 hover:text-gold-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect Column - Full width on mobile */}
                    <div className="col-span-2 md:col-span-1 mt-4 md:mt-0">
                        <h3 className="font-display font-semibold text-base md:text-lg text-white mb-3 md:mb-4">
                            যোগাযোগ
                        </h3>
                        <ul className="space-y-2 md:space-y-3 mb-4">
                            {connectLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm md:text-base text-gray-400 hover:text-gold-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Newsletter Mini Form */}
                        <div>
                            <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3">
                                নতুন আপডেটের জন্য সাবস্ক্রাইব করুন
                            </p>
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="আপনার ইমেইল"
                                    required
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent min-w-0"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "..." : "সাবস্ক্রাইব"}
                                </button>
                            </form>
                            {message && (
                                <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {message.text}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        © ২০২৬ সাইমুম শিল্পীগোষ্ঠী। সর্বস্বত্ব সংরক্ষিত।
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Visitor Counter */}
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gold-500" />
                            <span className="text-gray-400">
                                মোট ভিজিটর: <span className="text-gold-400 font-semibold">{toBengaliNumber(visitorCount)}</span>
                            </span>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                            aria-label="উপরে যান"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
