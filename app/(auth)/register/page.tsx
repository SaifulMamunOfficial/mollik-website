"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, Camera, Loader2, Check, ArrowRight, ArrowLeft } from "lucide-react";

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${index + 1 < currentStep
                            ? "bg-gold-500 text-primary-950"
                            : index + 1 === currentStep
                                ? "bg-gradient-to-r from-gold-400 to-gold-500 text-primary-950 ring-4 ring-gold-400/30"
                                : "bg-white/10 text-white/40"
                            }`}
                    >
                        {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    {index < totalSteps - 1 && (
                        <div
                            className={`w-8 h-0.5 mx-1 transition-all duration-300 ${index + 1 < currentStep ? "bg-gold-500" : "bg-white/10"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });

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

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep < 3) {
            handleNext();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    // phone: formData.phone
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "নিবন্ধন ব্যর্থ হয়েছে");
            }

            alert("নিবন্ধন সফল হয়েছে! এখন লগইন করুন।");
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-5 animate-fade-in">
                        {/* Avatar Upload */}
                        <div className="flex justify-center mb-6">
                            <label className="relative cursor-pointer group">
                                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-gold-400/50 transition-all duration-300">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-white/40 group-hover:text-gold-400 transition-colors" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Camera className="w-4 h-4 text-primary-950" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="sr-only"
                                />
                            </label>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-white/80 text-sm block">
                                পুরো নাম
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="আপনার নাম লিখুন"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400/50 focus:bg-white/10 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="reg-email" className="text-white/80 text-sm block">
                                ইমেইল
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    id="reg-email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400/50 focus:bg-white/10 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-5 animate-fade-in">
                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-white/80 text-sm block">
                                মোবাইল নম্বর
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="০১XXXXXXXXX"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400/50 focus:bg-white/10 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="reg-password" className="text-white/80 text-sm block">
                                পাসওয়ার্ড
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="reg-password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="কমপক্ষে ৮ অক্ষর"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400/50 focus:bg-white/10 transition-all duration-300"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-white/80 text-sm block">
                                পাসওয়ার্ড নিশ্চিত করুন
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400/50 focus:bg-white/10 transition-all duration-300"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${formData.password.length >= level * 2
                                                ? level <= 2
                                                    ? "bg-red-400"
                                                    : level === 3
                                                        ? "bg-yellow-400"
                                                        : "bg-green-400"
                                                : "bg-white/10"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-white/40">
                                    {formData.password.length < 4
                                        ? "দুর্বল পাসওয়ার্ড"
                                        : formData.password.length < 6
                                            ? "মোটামুটি পাসওয়ার্ড"
                                            : formData.password.length < 8
                                                ? "ভালো পাসওয়ার্ড"
                                                : "শক্তিশালী পাসওয়ার্ড"}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-fade-in">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Summary */}
                        <div className="bg-white/5 rounded-xl p-5 space-y-4">
                            <h3 className="text-gold-400 font-medium text-center mb-4">আপনার তথ্য</h3>

                            {avatarPreview && (
                                <div className="flex justify-center mb-4">
                                    <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-gold-400/50" />
                                </div>
                            )}

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-white/60">নাম:</span>
                                    <span className="text-white">{formData.name || "—"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-white/60">ইমেইল:</span>
                                    <span className="text-white">{formData.email || "—"}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-white/60">মোবাইল:</span>
                                    <span className="text-white">{formData.phone || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                    className="sr-only peer"
                                    required
                                />
                                <div className="w-5 h-5 border border-white/20 rounded bg-white/5 peer-checked:bg-gold-500 peer-checked:border-gold-500 transition-all duration-300 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary-950 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <span className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                                আমি{" "}
                                <Link href="/terms" className="text-gold-400 hover:text-gold-300 underline">
                                    শর্তাবলী
                                </Link>{" "}
                                ও{" "}
                                <Link href="/privacy" className="text-gold-400 hover:text-gold-300 underline">
                                    গোপনীয়তা নীতি
                                </Link>{" "}
                                পড়েছি এবং সম্মতি দিচ্ছি।
                            </span>
                        </label>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Step Labels */}
            <div className="text-center mb-4">
                <h2 className="text-xl font-display text-white mb-1">
                    {currentStep === 1 && "বেসিক তথ্য"}
                    {currentStep === 2 && "নিরাপত্তা তথ্য"}
                    {currentStep === 3 && "নিশ্চিতকরণ"}
                </h2>
                <p className="text-white/50 text-sm">ধাপ {currentStep} / ৩</p>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} totalSteps={3} />

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {renderStep()}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-8">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            পেছনে
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || (currentStep === 3 && !formData.agreeTerms)}
                        className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-semibold rounded-xl shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                নিবন্ধন হচ্ছে...
                            </>
                        ) : currentStep < 3 ? (
                            <>
                                পরবর্তী
                                <ArrowRight className="w-5 h-5" />
                            </>
                        ) : (
                            "নিবন্ধন সম্পন্ন করুন"
                        )}
                    </button>
                </div>
            </form>

            {/* Login Link (Mobile Only) */}
            <p className="text-center text-white/60 text-sm mt-6 sm:hidden">
                একাউন্ট আছে?{" "}
                <Link href="/login" className="text-gold-400 hover:text-gold-300 transition-colors">
                    প্রবেশ করুন
                </Link>
            </p>
        </div>
    );
}
