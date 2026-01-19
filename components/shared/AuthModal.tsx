"use client";

import Link from "next/link";
import { X, LogIn, UserPlus, Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export function AuthModal({
    isOpen,
    onClose,
    title = "লগইন করা প্রয়োজন",
    message = "এই অ্যাকশনটি সম্পন্ন করতে অনুগ্রহ করে লগইন করুন"
}: AuthModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center px-4 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={`relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>

                {/* Decorative Header Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 dark:from-emerald-900/40 dark:to-teal-900/40 opacity-50" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-colors z-10 backdrop-blur-sm"
                >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>

                <div className="relative p-8 text-center pt-12">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center shadow-inner rotate-3 transform hover:rotate-6 transition-transform">
                        <Heart className="w-10 h-10 text-emerald-600 dark:text-emerald-400 fill-current animate-pulse" />
                    </div>

                    <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
                        {title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <LogIn className="w-5 h-5" />
                            লগইন করুন
                        </Link>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">অথবা</span>
                            </div>
                        </div>

                        <Link
                            href="/register"
                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all hover:border-gray-200 dark:hover:border-gray-600"
                        >
                            <UserPlus className="w-5 h-5" />
                            নতুন অ্যাকাউন্ট খুলুন
                        </Link>
                    </div>

                    <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                        সদস্য হলে আপনি মন্তব্য ও লাইক করতে পারবেন
                    </p>
                </div>
            </div>
        </div>
    );
}
