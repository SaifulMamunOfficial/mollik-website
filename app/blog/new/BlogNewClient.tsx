"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    ArrowLeft,
    ImagePlus,
    X,
    Send,
    Save,
    CheckCircle2,
    Camera,
    Mic,
    Video,
    Heart,
    MessageSquare,
    PenTool,
    Sparkles,
    FileText,
    Eye,
    Info,
    User,
    Users,
    Music,
    BookOpen,
    MapPin,
    Calendar,
    Lightbulb,
    Film,
} from "lucide-react";
import { signIn } from "next-auth/react";

// Submission types - all centered around the poet
const submissionTypes = [
    {
        id: "condolence",
        name: "শোকবার্তা",
        icon: Heart,
        description: "কবির প্রতি আপনার শ্রদ্ধা ও শোকবার্তা জানান",
        gradient: "from-rose-500 to-pink-600",
    },
    {
        id: "blog",
        name: "ব্লগ/প্রবন্ধ",
        icon: MessageSquare,
        description: "কবিকে নিয়ে স্মৃতিচারণ, বিশ্লেষণ বা দর্শন লিখুন",
        gradient: "from-blue-500 to-indigo-600",
    },
    {
        id: "poem",
        name: "কবিকে নিয়ে কবিতা",
        icon: PenTool,
        description: "কবির প্রতি উৎসর্গীকৃত কবিতা শেয়ার করুন",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        id: "photo",
        name: "ছবিঘর",
        icon: Camera,
        description: "কবির সাথে বা কবি সম্পর্কিত ছবি আপলোড করুন",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        id: "audio",
        name: "অডিও",
        icon: Mic,
        description: "কবির কণ্ঠ, গান বা অডিও রেকর্ডিং শেয়ার করুন",
        gradient: "from-orange-500 to-amber-600",
    },
    {
        id: "video",
        name: "ভিডিও",
        icon: Video,
        description: "কবির ভিডিও বা ডকুমেন্টারি শেয়ার করুন",
        gradient: "from-red-500 to-rose-600",
    },
];

// Categories based on submission type
const categoryOptions: Record<string, { icon: any; name: string }[]> = {
    blog: [
        { icon: Heart, name: "কবিকে নিয়ে স্মৃতিচারণ" },
        { icon: Lightbulb, name: "কবির দর্শন" },
        { icon: BookOpen, name: "সাহিত্য বিশ্লেষণ" },
        { icon: MapPin, name: "কবির সাথে ভ্রমণ" },
        { icon: Calendar, name: "কবিকে নিয়ে অনুষ্ঠান" },
        { icon: Music, name: "গান ও সংগীত বিশ্লেষণ" },
        { icon: Film, name: "মিডিয়া কাভারেজ" },
    ],
    poem: [
        { icon: Heart, name: "শ্রদ্ধাঞ্জলি" },
        { icon: Sparkles, name: "অনুপ্রেরণা" },
        { icon: BookOpen, name: "কবির কবিতার অনুসরণে" },
    ],
    condolence: [
        // শোকবার্তা has no categories - simple text only
    ],
    photo: [
        { icon: User, name: "কবির ব্যক্তিগত ছবি" },
        { icon: Calendar, name: "অনুষ্ঠানের ছবি" },
        { icon: Users, name: "পরিবার ও বন্ধুদের সাথে" },
        { icon: MapPin, name: "ভ্রমণের ছবি" },
    ],
    audio: [
        { icon: Music, name: "গান" },
        { icon: Mic, name: "আবৃত্তি" },
        { icon: MessageSquare, name: "সাক্ষাৎকার" },
        { icon: BookOpen, name: "বক্তৃতা" },
    ],
    video: [
        { icon: Film, name: "ডকুমেন্টারি" },
        { icon: Music, name: "গানের ভিডিও" },
        { icon: MessageSquare, name: "সাক্ষাৎকার" },
        { icon: Calendar, name: "অনুষ্ঠানের ভিডিও" },
    ],
};

// Designation/role options for condolence (optional)
const designationOptions = [
    "পাঠক",
    "ভক্ত",
    "কবি",
    "সাহিত্যিক",
    "লেখক",
    "গবেষক",
    "সাংবাদিক",
    "শিক্ষক",
    "শিক্ষার্থী",
    "সংগঠক",
    "সাংস্কৃতিকর্মী",
];

// Bangladesh districts list
const bangladeshDistricts = [
    "ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সিগঞ্জ", "নরসিংদী",
    "ফরিদপুর", "গোপালগঞ্জ", "মাদারীপুর", "রাজবাড়ী", "শরীয়তপুর",
    "চট্টগ্রাম", "কক্সবাজার", "রাঙামাটি", "বান্দরবান", "খাগড়াছড়ি", "কুমিল্লা", "চাঁদপুর", "লক্ষ্মীপুর",
    "নোয়াখালী", "ফেনী", "ব্রাহ্মণবাড়িয়া",
    "সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ",
    "রাজশাহী", "চাঁপাইনবাবগঞ্জ", "নওগাঁ", "নাটোর", "পাবনা", "সিরাজগঞ্জ", "বগুড়া", "জয়পুরহাট",
    "রংপুর", "দিনাজপুর", "ঠাকুরগাঁও", "পঞ্চগড়", "নীলফামারী", "লালমনিরহাট", "কুড়িগ্রাম", "গাইবান্ধা",
    "খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "নড়াইল", "মাগুরা", "ঝিনাইদহ", "কুষ্টিয়া", "মেহেরপুর", "চুয়াডাঙ্গা",
    "বরিশাল", "পটুয়াখালী", "ভোলা", "বরগুনা", "পিরোজপুর", "ঝালকাঠি",
    "ময়মনসিংহ", "জামালপুর", "শেরপুর", "নেত্রকোণা",
];

// Organization types for condolence
const organizationTypes = [
    "সাহিত্য সংগঠন",
    "সাংস্কৃতিক সংগঠন",
    "সামাজিক সংগঠন",
    "রাজনৈতিক সংগঠন",
    "ধর্মীয় সংগঠন",
    "শিক্ষাপ্রতিষ্ঠান",
    "মিডিয়া/সংবাদ মাধ্যম",
    "পেশাজীবী সংগঠন",
    "যুব সংগঠন",
    "অন্যান্য",
];
export default function SubmitPage() {
    const { data: session } = useSession();
    const loggedInUser = {
        name: session?.user?.name || "অতিথি",
        username: (session?.user as any)?.username || "guest",
    };
    const [step, setStep] = useState(1);
    const [submissionType, setSubmissionType] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [isOwnWriting, setIsOwnWriting] = useState(true);
    const [authorName, setAuthorName] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [mediaFile, setMediaFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);

    // Condolence specific states
    const [selectedDistrict, setSelectedDistrict] = useState(""); // জেলা dropdown
    const [selectedDesignation, setSelectedDesignation] = useState(""); // Optional: পাঠক, ভক্ত, কবি etc.
    const [organizationName, setOrganizationName] = useState("");
    const [organizationType, setOrganizationType] = useState(""); // প্রতিষ্ঠানের ধরন
    const [organizationRole, setOrganizationRole] = useState(""); // কী দায়িত্বে আছেন
    const [isOrganization, setIsOrganization] = useState(false); // Whether submitting as organization

    // Photo specific states
    const [photoYear, setPhotoYear] = useState(""); // সাল
    const [photoLocation, setPhotoLocation] = useState(""); // স্থান
    const [showLoginModal, setShowLoginModal] = useState(false); // Login prompt modal

    const selectedType = submissionTypes.find(t => t.id === submissionType);
    const categories = submissionType ? categoryOptions[submissionType] || [] : [];

    // Type checks
    const isCondolence = submissionType === "condolence";
    const isMediaType = submissionType === "photo" || submissionType === "audio" || submissionType === "video";
    const needsContent = submissionType === "blog" || submissionType === "poem" || isCondolence;
    const needsCoverImage = !isCondolence && !isMediaType; // No cover image for condolence

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file.name);
        }
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("ড্রাফট সেভ করা হয়েছে!");
        }, 1000);
    };

    const handlePublish = async () => {
        // শোকবার্তা specific validation
        if (isCondolence) {
            if (!content.trim()) {
                alert("দয়া করে শোকবার্তার বিষয়বস্তু লিখুন।");
                return;
            }
            if (!selectedDistrict) {
                alert("দয়া করে জেলা নির্বাচন করুন।");
                return;
            }
            if (isOrganization) {
                if (!organizationName.trim()) {
                    alert("দয়া করে প্রতিষ্ঠানের নাম দিন।");
                    return;
                }
                if (!organizationType) {
                    alert("দয়া করে প্রতিষ্ঠানের ধরন নির্বাচন করুন।");
                    return;
                }
                if (!organizationRole.trim()) {
                    alert("দয়া করে আপনার দায়িত্ব উল্লেখ করুন।");
                    return;
                }
            }
        } else {
            // Other submission types validation
            if (!title.trim()) {
                alert("দয়া করে শিরোনাম পূরণ করুন।");
                return;
            }
            if (categories.length > 0 && !category) {
                alert("দয়া করে ক্যাটাগরি নির্বাচন করুন।");
                return;
            }
            if (!isOwnWriting && !authorName.trim()) {
                alert("দয়া করে লেখকের নাম দিন।");
                return;
            }
        }

        setIsPublishing(true);

        try {
            let response;

            if (isCondolence) {
                // Submit condolence/tribute
                response = await fetch('/api/submit/tribute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content,
                        district: selectedDistrict,
                        designation: selectedDesignation,
                        isOrganization,
                        organizationName: isOrganization ? organizationName : null,
                        organizationType: isOrganization ? organizationType : null,
                        organizationRole: isOrganization ? organizationRole : null,
                    }),
                });
            } else if (submissionType === 'blog' || submissionType === 'poem') {
                // Submit blog/poem
                response = await fetch('/api/submit/blog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        content,
                        excerpt: content.substring(0, 200),
                        coverImage,
                        category,
                        type: submissionType,
                        isOwnWriting,
                        authorName: !isOwnWriting ? authorName : null,
                    }),
                });
            } else if (submissionType === 'photo') {
                // Submit photo to gallery
                response = await fetch('/api/submit/gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        description: content,
                        coverImage,
                        category,
                        year: photoYear,
                        location: photoLocation,
                    }),
                });
            } else if (submissionType === 'audio') {
                // Submit audio
                response = await fetch('/api/submit/audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        description: content,
                        audioUrl: mediaUrl,
                        coverImage,
                        category,
                    }),
                });
            } else if (submissionType === 'video') {
                // Submit video
                response = await fetch('/api/submit/video', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        description: content,
                        youtubeUrl: mediaUrl,
                        thumbnail: coverImage,
                        category,
                    }),
                });
            }

            if (response && !response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'সাবমিট করতে সমস্যা হয়েছে');
            }

            setIsPublishing(false);
            setIsSubmitted(true);
        } catch (error: any) {
            setIsPublishing(false);
            alert(error.message || 'সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
    };

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    // Success Screen
    if (isSubmitted) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center py-20 px-4">
                    <div className="text-center max-w-lg mx-auto animate-fade-in">
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full blur-xl opacity-50" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-2xl">
                                <CheckCircle2 className="w-12 h-12 text-primary-950" />
                            </div>
                        </div>

                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            জাযাকাল্লাহু খাইরান!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-lg">
                            আপনার <span className="text-primary-600 dark:text-gold-400 font-medium">{selectedType?.name}</span> সফলভাবে জমা দেওয়া হয়েছে!
                        </p>
                        <div className="bg-gold-50 dark:bg-gold-900/20 rounded-xl p-4 mb-8 border border-gold-200 dark:border-gold-800">
                            <p className="text-sm text-gold-800 dark:text-gold-300 flex items-center justify-center gap-2">
                                <Info className="w-4 h-4" />
                                অ্যাডমিন রিভিউয়ের পর প্রকাশিত হলে আপনাকে জানানো হবে।
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/profile"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium transition-all shadow-lg"
                            >
                                <FileText className="w-4 h-4" />
                                আমার জমাকৃত তালিকা
                            </Link>
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setStep(1);
                                    setSubmissionType(null);
                                    setTitle("");
                                    setContent("");
                                    setCategory("");
                                    setCoverImage(null);
                                    setIsOwnWriting(true);
                                    setAuthorName("");
                                    // Reset condolence states
                                    setSelectedDistrict("");
                                    setSelectedDesignation("");
                                    setOrganizationName("");
                                    setOrganizationType("");
                                    setOrganizationRole("");
                                    setIsOrganization(false);
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all border border-gray-200 dark:border-gray-700"
                            >
                                <Sparkles className="w-4 h-4" />
                                আরেকটি জমা দিন
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950">
                {/* Hero Header */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-10 md:py-12">
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    <div className="absolute top-10 right-20 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl animate-float" />

                    <div className="relative container-custom">
                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            প্রোফাইলে ফিরুন
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary-950" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                                    কবিকে স্মরণ করুন
                                </h1>
                                <p className="text-white/60 text-sm md:text-base mt-1">
                                    মতিউর রহমান মল্লিকের স্মৃতি সংরক্ষণে আপনার অবদান রাখুন
                                </p>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-3 mt-6">
                            {[
                                { num: 1, label: "ধরন নির্বাচন" },
                                { num: 2, label: "তথ্য প্রদান" },
                            ].map((s, i) => (
                                <div key={s.num} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s.num
                                        ? "bg-gold-500 text-primary-950"
                                        : "bg-white/10 text-white/50"
                                        }`}>
                                        {step > s.num ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : s.num}
                                    </div>
                                    <span className={`text-xs md:text-sm font-medium hidden sm:inline ${step >= s.num ? "text-white" : "text-white/50"}`}>
                                        {s.label}
                                    </span>
                                    {i < 1 && (
                                        <div className={`w-8 md:w-12 h-0.5 ${step > s.num ? "bg-gold-500" : "bg-white/20"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container-custom py-6 md:py-10">
                    {/* Step 1: Select Type */}
                    {step === 1 && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white mb-2 text-center">
                                কী শেয়ার করতে চান?
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-sm md:text-base">
                                কবি মতিউর রহমান মল্লিককে কেন্দ্র করে আপনার জমাদানের ধরন নির্বাচন করুন
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {submissionTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = submissionType === type.id;

                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setSubmissionType(type.id)}
                                            className={`group flex items-center gap-4 p-4 md:p-5 rounded-xl border-2 transition-all text-left ${isSelected
                                                ? "border-gold-500 bg-gold-50 dark:bg-gold-900/20 shadow-lg"
                                                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                        >
                                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                                                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-0.5">
                                                    {type.name}
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    {type.description}
                                                </p>
                                            </div>
                                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected
                                                ? "border-gold-500 bg-gold-500"
                                                : "border-gray-300 dark:border-gray-600"
                                                }`}>
                                                {isSelected && <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 md:mt-8 flex justify-center">
                                <button
                                    onClick={() => {
                                        if (!session?.user) {
                                            setShowLoginModal(true);
                                            return;
                                        }
                                        if (submissionType) {
                                            setStep(2);
                                        }
                                    }}
                                    disabled={!submissionType}
                                    className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-semibold rounded-xl transition-all shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    পরবর্তী ধাপ
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Editor */}
                    {step === 2 && selectedType && (
                        <div className="max-w-3xl mx-auto animate-fade-in">
                            <button
                                onClick={() => setStep(1)}
                                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-gold-400 mb-4 transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                ধরন পরিবর্তন করুন
                            </button>

                            {/* Type Badge */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedType.gradient} flex items-center justify-center shadow-md`}>
                                    <selectedType.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
                                    {selectedType.name}
                                </span>
                            </div>

                            {/* Editor Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                                {/* Cover Image Upload - Not for Condolence */}
                                {!isCondolence && (
                                    <div className="relative">
                                        {coverImage ? (
                                            <div className="relative h-48 md:h-64 w-full">
                                                <Image
                                                    src={coverImage}
                                                    alt="Cover"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors"
                                                    title="ছবি সরান"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-40 md:h-52 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 cursor-pointer hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-colors border-b border-dashed border-gray-300 dark:border-gray-600 group">
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <ImagePlus className="w-6 h-6 md:w-7 md:h-7 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">
                                                    {submissionType === "photo" ? "ছবি যোগ করুন" : isMediaType ? "থাম্বনেইল/কাভার ছবি যোগ করুন" : "কাভার ছবি যোগ করুন"}
                                                </span>
                                                <span className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                                    {isMediaType ? "প্রয়োজনীয়" : "ঐচ্ছিক"}
                                                </span>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}

                                {/* Form Fields */}
                                <div className="p-5 md:p-8 space-y-5">
                                    {/* Title - Not for Condolence */}
                                    {!isCondolence && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                শিরোনাম <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="শিরোনাম লিখুন..."
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full text-lg md:text-xl font-semibold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                                            />
                                        </div>
                                    )}

                                    {/* Category Selection */}
                                    {categories.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                ক্যাটাগরি <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map((cat) => {
                                                    const CatIcon = cat.icon;
                                                    return (
                                                        <button
                                                            key={cat.name}
                                                            onClick={() => setCategory(cat.name)}
                                                            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.name
                                                                ? "bg-primary-600 text-white shadow-md"
                                                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                                }`}
                                                        >
                                                            <CatIcon className="w-4 h-4" />
                                                            {cat.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Media Upload for audio/video */}
                                    {(submissionType === "audio" || submissionType === "video") && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {submissionType === "audio" ? "অডিও ফাইল বা YouTube লিংক" : "ভিডিও ফাইল বা YouTube লিংক"}
                                            </label>
                                            <div className="space-y-3">
                                                <input
                                                    type="url"
                                                    placeholder="YouTube বা অন্য প্ল্যাটফর্মের লিংক দিন..."
                                                    value={mediaUrl}
                                                    onChange={(e) => setMediaUrl(e.target.value)}
                                                    className="w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/50"
                                                />

                                                {/* YouTube Preview */}
                                                {submissionType === "video" && mediaUrl && (() => {
                                                    const match = mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/);
                                                    const videoId = match && match[1].length === 11 ? match[1] : null;

                                                    if (videoId) {
                                                        return (
                                                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mt-3">
                                                                <iframe
                                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                                    title="YouTube video player"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    className="absolute inset-0 w-full h-full"
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}

                                                <p className="text-xs text-gray-500 text-center">অথবা</p>
                                                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                    {submissionType === "audio" ? <Mic className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                                                    <span>{mediaFile || "ফাইল আপলোড করুন"}</span>
                                                    <input
                                                        ref={mediaInputRef}
                                                        type="file"
                                                        accept={submissionType === "audio" ? "audio/*" : "video/*"}
                                                        onChange={handleMediaUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Content for text-based submissions */}
                                    {needsContent && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {submissionType === "poem" ? "কবিতা" : "বিস্তারিত লিখুন"}
                                            </label>
                                            <textarea
                                                placeholder={submissionType === "poem" ? "আপনার কবিতা লিখুন..." : "আপনার লেখা শুরু করুন..."}
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                rows={submissionType === "poem" ? 12 : 10}
                                                className="w-full text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/50 resize-none leading-relaxed"
                                            />
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{wordCount} শব্দ</p>
                                        </div>
                                    )}

                                    {/* Description for media types */}
                                    {isMediaType && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                বিবরণ (ঐচ্ছিক)
                                            </label>
                                            <textarea
                                                placeholder="এই মিডিয়া সম্পর্কে কিছু লিখুন..."
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                rows={4}
                                                className="w-full text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/50 resize-none"
                                            />
                                        </div>
                                    )}

                                    {/* Year and Location for Photo type */}
                                    {submissionType === "photo" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    সাল <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="যেমন: ২০০৮"
                                                    value={photoYear}
                                                    onChange={(e) => setPhotoYear(e.target.value)}
                                                    className="w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    স্থান <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="যেমন: ঢাকা"
                                                    value={photoLocation}
                                                    onChange={(e) => setPhotoLocation(e.target.value)}
                                                    className="w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/50"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Author Attribution - Different for Condolence */}
                                    {isCondolence ? (
                                        /* Condolence Identity Section */
                                        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 md:p-5 border border-rose-200 dark:border-rose-800">
                                            <label className="block text-sm font-medium text-rose-800 dark:text-rose-300 mb-4">
                                                শোকবার্তা প্রদানকারী
                                            </label>

                                            {/* Individual or Organization Toggle */}
                                            <div className="flex gap-2 mb-4">
                                                <button
                                                    onClick={() => setIsOrganization(false)}
                                                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${!isOrganization
                                                        ? "bg-rose-600 text-white shadow-md"
                                                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                                                        }`}
                                                >
                                                    ব্যক্তি
                                                </button>
                                                <button
                                                    onClick={() => setIsOrganization(true)}
                                                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${isOrganization
                                                        ? "bg-rose-600 text-white shadow-md"
                                                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                                                        }`}
                                                >
                                                    প্রতিষ্ঠান
                                                </button>
                                            </div>

                                            {!isOrganization ? (
                                                /* Individual - User Info Display */
                                                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-rose-200 dark:border-rose-700 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                                                        {loggedInUser.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{loggedInUser.name}</p>
                                                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full">সদস্য</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* প্রতিষ্ঠান - Name & Role Input */
                                                <div className="space-y-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="যেমন: বাংলাদেশ লেখক সংঘ"
                                                            value={organizationName}
                                                            onChange={(e) => setOrganizationName(e.target.value)}
                                                            className="w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            প্রতিষ্ঠানের ধরন <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            value={organizationType}
                                                            onChange={(e) => setOrganizationType(e.target.value)}
                                                            className="w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                                        >
                                                            <option value="">প্রতিষ্ঠানের ধরন নির্বাচন করুন</option>
                                                            {organizationTypes.map((type) => (
                                                                <option key={type} value={type}>
                                                                    {type}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            কী দায়িত্বে আছেন? <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="যেমন: সভাপতি, সাধারণ সম্পাদক, সদস্য"
                                                            value={organizationRole}
                                                            onChange={(e) => setOrganizationRole(e.target.value)}
                                                            className="w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* District/Location Dropdown */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    জেলা <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={selectedDistrict}
                                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                                    className="w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                                >
                                                    <option value="">জেলা নির্বাচন করুন</option>
                                                    {bangladeshDistricts.map((district) => (
                                                        <option key={district} value={district}>
                                                            {district}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Designation - Optional Chips */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    পরিচয় <span className="text-gray-400">(ঐচ্ছিক)</span>
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {designationOptions.map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => setSelectedDesignation(selectedDesignation === opt ? "" : opt)}
                                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedDesignation === opt
                                                                ? "bg-rose-600 text-white shadow-md"
                                                                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    প্রিভিউতে জেলার সাথে এটি দেখাবে। নির্বাচন না করলেও চলবে।
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Regular Author Attribution for other types */
                                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 md:p-5 border border-gray-200 dark:border-gray-600">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                লেখক/কর্তা
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                <button
                                                    onClick={() => setIsOwnWriting(true)}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${isOwnWriting
                                                        ? "bg-primary-600 text-white shadow-md"
                                                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                                                        }`}
                                                >
                                                    <User className="w-4 h-4" />
                                                    আমি নিজে
                                                </button>
                                                <button
                                                    onClick={() => setIsOwnWriting(false)}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${!isOwnWriting
                                                        ? "bg-primary-600 text-white shadow-md"
                                                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                                                        }`}
                                                >
                                                    <Users className="w-4 h-4" />
                                                    অন্য কেউ
                                                </button>
                                            </div>

                                            {isOwnWriting ? (
                                                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-primary-950 font-bold">
                                                        {loggedInUser.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{loggedInUser.name}</p>
                                                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-full">সদস্য</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="লেখক/কর্তার নাম লিখুন..."
                                                    value={authorName}
                                                    onChange={(e) => setAuthorName(e.target.value)}
                                                    className="w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/50"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Bar */}
                                <div className="px-5 md:px-8 py-4 md:py-5 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                        <Info className="w-4 h-4 flex-shrink-0" />
                                        <span>অ্যাডমিন রিভিউয়ের পর প্রকাশিত হবে</span>
                                    </div>
                                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={handleSaveDraft}
                                            disabled={isSaving}
                                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all border border-gray-200 dark:border-gray-600 disabled:opacity-50 text-sm"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span className="hidden sm:inline">{isSaving ? "সেভ হচ্ছে..." : "ড্রাফট"}</span>
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            disabled={isPublishing}
                                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-semibold rounded-xl transition-all shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 disabled:opacity-50 text-sm"
                                        >
                                            {isPublishing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-primary-950/30 border-t-primary-950 rounded-full animate-spin" />
                                                    জমা হচ্ছে...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    জমা দিন
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Login Required Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <User className="w-10 h-10 text-primary-950" />
                        </div>

                        <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
                            লগইন করুন
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            লেখা পাঠাতে আগে আপনাকে লগইন করতে হবে। লগইন করলে আপনার সব লেখা আপনার প্রোফাইলে সংরক্ষিত থাকবে।
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => signIn()}
                                className="w-full px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <User className="w-5 h-5" />
                                লগইন করুন
                            </button>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                            >
                                পরে করব
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
