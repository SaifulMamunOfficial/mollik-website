"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { X, ChevronLeft, ChevronRight, Camera, Calendar, MapPin, ZoomIn, Grid3X3, LayoutGrid } from "lucide-react";

// Convert English numbers to Bengali
const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

const categories = [
    { value: "all", label: "সবগুলো", icon: Grid3X3 },
    { value: "portrait", label: "প্রতিকৃতি", icon: Camera },
    { value: "event", label: "অনুষ্ঠান", icon: Calendar },
    { value: "family", label: "পরিবার", icon: Camera },
    { value: "work", label: "কর্মময়", icon: Camera },
    { value: "archive", label: "আর্কাইভ", icon: Camera }
];

interface GalleryItem {
    id: number;
    src: string;
    alt: string;
    title?: string;
    category: string;
    year?: string;
    location?: string;
    description?: string;
    featured?: boolean;
    aspectRatio?: "portrait" | "landscape" | "square";
}

export default function GalleryClient({ galleryItems }: { galleryItems: GalleryItem[] }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");

    const filteredItems = selectedCategory === "all"
        ? galleryItems
        : galleryItems.filter(item => item.category === selectedCategory);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, filteredItems.length]);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Hero Section */}
                <section className="relative py-20 md:py-28 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-3xl" />
                    </div>

                    <div className="container-custom relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold-400 text-sm mb-6">
                                <Camera className="w-4 h-4" />
                                <span>স্মৃতির আলোকচিত্র</span>
                            </div>
                            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
                                ছবিঘর
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                কবি মতিউর রহমান মল্লিকের জীবনের বিভিন্ন মুহূর্তের দুর্লভ আলোকচিত্র সংগ্রহ
                            </p>

                            {/* Stats */}
                            <div className="flex justify-center gap-8 mt-10">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">{toBengaliNumber(galleryItems.length)}+</div>
                                    <div className="text-gray-400 text-sm">ছবি</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">{toBengaliNumber(categories.length - 1)}</div>
                                    <div className="text-gray-400 text-sm">ক্যাটাগরি</div>
                                </div>
                                <div className="w-px bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gold-400">৩০+</div>
                                    <div className="text-gray-400 text-sm">বছরের স্মৃতি</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter & Gallery Section */}
                <section className="py-12 md:py-16">
                    <div className="container-custom">
                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            {/* Categories */}
                            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setSelectedCategory(cat.value)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.value
                                            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <cat.icon className="w-4 h-4" />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode("masonry")}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === "masonry"
                                        ? "bg-white dark:bg-gray-700 shadow text-primary-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    title="ম্যাসনরি ভিউ"
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === "grid"
                                        ? "bg-white dark:bg-gray-700 shadow text-primary-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    title="গ্রিড ভিউ"
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        {viewMode === "masonry" ? (
                            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                                {filteredItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="break-inside-avoid group cursor-pointer"
                                        onClick={() => openLightbox(index)}
                                    >
                                        <div className={`relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 ${item.aspectRatio === "portrait" ? "aspect-[3/4]" :
                                            item.aspectRatio === "square" ? "aspect-square" : "aspect-video"
                                            }`}>
                                            <Image
                                                src={item.src}
                                                alt={item.alt}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                                                        <ZoomIn className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <h3 className="text-white font-medium mb-1 line-clamp-1">{item.alt}</h3>
                                                    <div className="flex items-center gap-3 text-white/70 text-xs">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {item.year || "N/A"}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {item.location || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Featured Badge */}
                                            {item.featured && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2 py-1 bg-gold-500 text-white text-xs font-bold rounded-md">
                                                        ফিচার্ড
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="group cursor-pointer"
                                        onClick={() => openLightbox(index)}
                                    >
                                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800">
                                            <Image
                                                src={item.src}
                                                alt={item.alt}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                                                        <ZoomIn className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <h3 className="text-white text-sm font-medium line-clamp-1">{item.alt}</h3>
                                                </div>
                                            </div>

                                            {item.featured && (
                                                <div className="absolute top-2 left-2">
                                                    <span className="px-2 py-0.5 bg-gold-500 text-white text-xs font-bold rounded">
                                                        ফিচার্ড
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredItems.length === 0 && (
                            <div className="text-center py-20">
                                <Camera className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                                    এই ক্যাটাগরিতে কোনো ছবি নেই
                                </h3>
                            </div>
                        )}
                    </div>
                </section>

                {/* Lightbox */}
                {lightboxOpen && filteredItems[currentImageIndex] && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Image */}
                        <div className="relative max-w-5xl max-h-[80vh] w-full mx-4">
                            <div className="relative aspect-auto h-[70vh]">
                                <Image
                                    src={filteredItems[currentImageIndex].src}
                                    alt={filteredItems[currentImageIndex].alt}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </div>

                            {/* Image Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-white text-xl font-medium mb-2">
                                    {filteredItems[currentImageIndex].alt}
                                </h3>
                                <p className="text-white/70 text-sm mb-3">
                                    {filteredItems[currentImageIndex].description}
                                </p>
                                <div className="flex items-center gap-4 text-white/60 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {filteredItems[currentImageIndex].year}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {filteredItems[currentImageIndex].location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-xl overflow-x-auto p-2 bg-black/50 rounded-xl">
                            {filteredItems.slice(0, 8).map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${index === currentImageIndex ? "ring-2 ring-gold-400 scale-110" : "opacity-50 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Counter */}
                        <div className="absolute top-6 left-6 text-white/70 text-sm">
                            {currentImageIndex + 1} / {filteredItems.length}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
