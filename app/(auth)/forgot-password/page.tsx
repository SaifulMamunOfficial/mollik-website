"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {!isSubmitted ? (
                <>
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center">
                            <KeyRound className="w-10 h-10 text-gold-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-display text-white mb-2">পাসওয়ার্ড পুনরুদ্ধার</h2>
                        <p className="text-white/60 text-sm leading-relaxed">
                            আপনার ইমেইল ঠিকানা দিন। আমরা পাসওয়ার্ড রিসেট করার জন্য একটি লিংক পাঠাবো।
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="reset-email" className="text-white/80 text-sm block">
                                ইমেইল ঠিকানা
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    id="reset-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400/50 focus:bg-white/10 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-semibold rounded-xl shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    পাঠানো হচ্ছে...
                                </>
                            ) : (
                                "রিসেট লিংক পাঠান"
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="text-center mt-6">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-gold-400 transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            লগইন পেজে ফিরুন
                        </Link>
                    </div>
                </>
            ) : (
                /* Success State */
                <div className="text-center py-8 animate-fade-in">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-2xl font-display text-white mb-3">ইমেইল পাঠানো হয়েছে!</h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                        আমরা <span className="text-gold-400">{email}</span> এ একটি পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি।
                        অনুগ্রহ করে আপনার ইনবক্স চেক করুন।
                    </p>

                    {/* Info Box */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                        <p className="text-white/50 text-xs leading-relaxed">
                            <strong className="text-white/70">💡 টিপস:</strong> যদি ইমেইল না পান, স্প্যাম ফোল্ডার চেক করুন।
                            ইমেইল আসতে কয়েক মিনিট সময় লাগতে পারে।
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setEmail("");
                            }}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300"
                        >
                            অন্য ইমেইল ব্যবহার করুন
                        </button>

                        <Link
                            href="/login"
                            className="block w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-semibold rounded-xl shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-all duration-300 text-center"
                        >
                            লগইন পেজে যান
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
