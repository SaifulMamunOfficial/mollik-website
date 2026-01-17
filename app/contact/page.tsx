"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Send, Youtube, Facebook, CheckCircle, AlertCircle, Music, ExternalLink } from "lucide-react";

// Custom icons for platforms without lucide icons
const SpotifyIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
);

const AppleMusicIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.785-.384-2.24-1.237-.378-.71-.376-1.46.01-2.167.328-.598.863-.973 1.51-1.163.39-.115.79-.184 1.194-.223.37-.036.74-.085 1.114-.128.186-.022.294-.12.307-.3.004-.063.003-.126.003-.19V8.03c0-.246-.046-.296-.288-.252l-5.52 1.073c-.047.01-.094.024-.142.028-.17.015-.24.09-.247.262-.003.06 0 .12 0 .18V17.4c0 .445-.067.878-.273 1.278-.316.615-.814.977-1.473 1.138-.332.08-.67.127-1.013.145-.965.05-1.82-.36-2.295-1.27-.39-.746-.378-1.516.052-2.242.344-.58.867-.933 1.5-1.116.396-.114.8-.176 1.208-.216.38-.037.762-.08 1.143-.123.203-.023.304-.12.31-.324.003-.07 0-.14 0-.21V7.196c0-.138.025-.27.088-.397.1-.198.26-.32.47-.364.168-.035.34-.058.51-.086L18.965 5.1c.184-.035.37-.063.556-.086.16-.02.27.067.305.225.018.087.024.177.024.265.002 1.528.002 3.054.002 4.58v.03z" />
    </svg>
);

const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus("success");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setSubmitStatus("error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
            // Reset status after 5 seconds
            setTimeout(() => setSubmitStatus("idle"), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const socialLinks = [
        {
            name: "YouTube",
            url: "https://www.youtube.com/channel/UCjINfKW8Z-y8AV4m2AzcueA",
            icon: <Youtube className="w-5 h-5" />,
            color: "red",
            bgClass: "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30",
            iconBgClass: "bg-red-100 dark:bg-red-900/40",
            textClass: "text-red-600"
        },
        {
            name: "Facebook",
            url: "https://facebook.com/MM12082010",
            icon: <Facebook className="w-5 h-5" />,
            color: "blue",
            bgClass: "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30",
            iconBgClass: "bg-blue-100 dark:bg-blue-900/40",
            textClass: "text-blue-600"
        },
        {
            name: "Spotify",
            url: "https://open.spotify.com/artist/7IALRnAqW13PSjno6FTzfP",
            icon: <SpotifyIcon />,
            color: "green",
            bgClass: "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30",
            iconBgClass: "bg-green-100 dark:bg-green-900/40",
            textClass: "text-green-600"
        },
        {
            name: "Apple Music",
            url: "https://music.apple.com/us/artist/1676925734",
            icon: <AppleMusicIcon />,
            color: "pink",
            bgClass: "bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30",
            iconBgClass: "bg-pink-100 dark:bg-pink-900/40",
            textClass: "text-pink-600"
        },
        {
            name: "YouTube Music",
            url: "https://music.youtube.com/channel/UCsgqE0mPe4coAp9vhXqIs3g",
            icon: <Music className="w-5 h-5" />,
            color: "red",
            bgClass: "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30",
            iconBgClass: "bg-red-100 dark:bg-red-900/40",
            textClass: "text-red-600"
        },
        {
            name: "Instagram",
            url: "https://instagram.com/motiurrahman.mollik",
            icon: <InstagramIcon />,
            color: "purple",
            bgClass: "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30",
            iconBgClass: "bg-purple-100 dark:bg-purple-900/40",
            textClass: "text-purple-600"
        },
        {
            name: "Twitter / X",
            url: "https://twitter.com/KobiMollik",
            icon: <TwitterIcon />,
            color: "gray",
            bgClass: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
            iconBgClass: "bg-gray-200 dark:bg-gray-700",
            textClass: "text-gray-800 dark:text-gray-200"
        }
    ];

    const musicPlatforms = [
        { name: "Deezer", url: "https://deezer.com/en/artist/12510588" },
        { name: "iHeart", url: "https://iheart.com/artist/motiur-rahman-motin-36644870" },
        { name: "Amazon Music", url: "https://amazon.com/music/player/artists/B0723H8ZW2" },
        { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/Motiur_Rahman_Mollik" }
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
                {/* Hero Section */}
                <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
                    </div>
                    <div className="container-custom relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                                যোগাযোগ
                            </h1>
                            <p className="text-emerald-100 text-lg md:text-xl">
                                কবি মতিউর রহমান মল্লিকের আর্কাইভ সংক্রান্ত যেকোনো বিষয়ে আমাদের সাথে যোগাযোগ করুন
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 md:py-24">
                    <div className="container-custom">
                        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16">
                            {/* Contact Info - Left side on desktop, second on mobile */}
                            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1 overflow-hidden">
                                {/* Organization Info */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        আর্কাইভ পরিচালনা
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        এই আর্কাইভ পরিচালনা করছে <strong className="text-emerald-600 dark:text-emerald-400">সাইমুম শিল্পীগোষ্ঠী</strong> — কবি মতিউর রহমান মল্লিক কর্তৃক ১৯৭৮ সালে প্রতিষ্ঠিত সাংস্কৃতিক সংগঠন।
                                    </p>

                                    {/* Email */}
                                    <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">ইমেইল</p>
                                            <a
                                                href="mailto:contact@motiurrahmanmollik.com"
                                                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline break-all text-sm md:text-base"
                                            >
                                                contact@motiurrahmanmollik.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">
                                        সোশ্যাল মিডিয়া
                                    </h3>
                                    {/* Mobile: Horizontal scroll with icons only */}
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:hidden">
                                        {socialLinks.map((link) => (
                                            <a
                                                key={link.name}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={link.name}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0 ${link.iconBgClass} ${link.textClass}`}
                                            >
                                                {link.icon}
                                            </a>
                                        ))}
                                    </div>
                                    {/* Desktop: Vertical list with names */}
                                    <div className="hidden md:grid md:grid-cols-1 gap-3">
                                        {socialLinks.map((link) => (
                                            <a
                                                key={link.name}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-4 p-3 rounded-xl transition-colors group ${link.bgClass}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${link.iconBgClass} ${link.textClass}`}>
                                                    {link.icon}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {link.name}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Other Music Platforms */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        অন্যান্য প্লাটফর্ম
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {musicPlatforms.map((platform) => (
                                            <a
                                                key={platform.name}
                                                href={platform.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                                            >
                                                {platform.name}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Contribution Note */}
                                <div className="bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gold-900/20 dark:to-amber-900/20 rounded-2xl p-6 md:p-8 border border-gold-200 dark:border-gold-800/30">
                                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        কন্টেন্ট অবদান
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        আপনার কাছে কবির অপ্রকাশিত লেখা, দুর্লভ ছবি, অডিও বা ভিডিও থাকলে আমাদের সাথে শেয়ার করুন।
                                        কবির স্মৃতিচারণ বা তাঁকে নিয়ে লেখা পাঠাতে ব্লগ সেকশন ব্যবহার করুন।
                                    </p>
                                </div>
                            </div>

                            {/* Contact Form - Right side on desktop, first on mobile */}
                            <div className="lg:col-span-3 order-1 lg:order-2">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        বার্তা পাঠান
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                                        নিচের ফর্মটি পূরণ করুন, আমরা যত দ্রুত সম্ভব উত্তর দেব।
                                    </p>

                                    {submitStatus === "success" && (
                                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            <p className="text-emerald-700 dark:text-emerald-300">
                                                আপনার বার্তা সফলভাবে পাঠানো হয়েছে!
                                            </p>
                                        </div>
                                    )}

                                    {submitStatus === "error" && (
                                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            <p className="text-red-700 dark:text-red-300">
                                                কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
                                            </p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    আপনার নাম
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                    placeholder="নাম লিখুন"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    ইমেইল
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                বিষয়
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                            >
                                                <option value="">বিষয় নির্বাচন করুন</option>
                                                <option value="general">সাধারণ জিজ্ঞাসা</option>
                                                <option value="content">কন্টেন্ট জমা দিতে চাই</option>
                                                <option value="copyright">কপিরাইট/অনুমতি সংক্রান্ত</option>
                                                <option value="correction">তথ্য সংশোধন</option>
                                                <option value="feedback">ফিডব্যাক/পরামর্শ</option>
                                                <option value="other">অন্যান্য</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                বার্তা
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                                placeholder="আপনার বার্তা লিখুন..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>পাঠানো হচ্ছে...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span>বার্তা পাঠান</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
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
