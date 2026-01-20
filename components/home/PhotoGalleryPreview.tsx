"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, ZoomIn } from "lucide-react";
import { useState } from "react";
import type { FeaturedGalleryImage } from "@/types/home";

interface PhotoGalleryPreviewProps {
    images: FeaturedGalleryImage[];
}

// Sample data for fallback
const sampleImages: FeaturedGalleryImage[] = [
    { id: "1", title: "তরুণ বয়সে কবি", description: null, url: "", year: "১৯৭৫" },
    { id: "2", title: "কবি সম্মেলনে", description: null, url: "", year: "১৯৯০" },
    { id: "3", title: "পরিবারের সাথে", description: null, url: "", year: "২০০০" },
    { id: "4", title: "পুরস্কার গ্রহণ", description: null, url: "", year: "২০০৫" },
];

export function PhotoGalleryPreview({ images }: PhotoGalleryPreviewProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const displayImages = images.length > 0 ? images : sampleImages;

    return (
        <section className="section bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Camera className="w-5 h-5 text-gold-500" />
                            <span className="text-gold-600 dark:text-gold-400 font-medium text-sm tracking-wider uppercase">
                                স্মৃতিচারণ
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            ফটো গ্যালারি
                        </h2>
                    </div>
                    <Link
                        href="/gallery"
                        className="hidden md:inline-flex items-center gap-2 mt-4 md:mt-0 text-primary-600 dark:text-gold-400 hover:text-primary-700 dark:hover:text-gold-300 font-medium transition-colors"
                    >
                        সব ছবি দেখুন
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:hidden">
                    {displayImages.map((image) => (
                        <Link
                            key={image.id}
                            href={`/gallery?photo=${image.id}`}
                            className="group relative flex-shrink-0 w-[240px] aspect-[3/4] overflow-hidden rounded-2xl snap-start"
                            onMouseEnter={() => setHoveredId(image.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Image or Placeholder */}
                            {image.url ? (
                                <Image
                                    src={image.url}
                                    alt={image.title || "Gallery Image"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 via-primary-300 to-gold-200 dark:from-primary-800 dark:via-primary-700 dark:to-gold-800 transition-transform duration-500 group-hover:scale-110">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-5xl md:text-6xl font-display font-bold text-white/30">
                                            {(image.title || "G").charAt(0)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Overlay - Always Visible on Mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                {/* Zoom Icon */}
                                <div className="absolute top-3 right-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                        <ZoomIn className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                {/* Caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-semibold text-base line-clamp-1">
                                        {image.title || "গ্যালারি ছবি"}
                                    </p>
                                    <p className="text-white/70 text-xs mt-1">
                                        {image.year || ""}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* See More Card - Mobile */}
                    <Link
                        href="/gallery"
                        className="flex-shrink-0 w-[160px] aspect-[3/4] bg-primary-50 dark:bg-gray-800 rounded-2xl p-6 border border-primary-200 dark:border-gray-700 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform snap-start"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary-600 dark:bg-gold-500 flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display font-semibold text-primary-700 dark:text-gold-400 text-center text-sm">
                            আরো ছবি
                        </span>
                    </Link>
                </div>

                {/* Desktop: Clean 4 Column Layout */}
                <div className="hidden md:grid md:grid-cols-4 gap-4">
                    {displayImages.map((image) => (
                        <Link
                            key={image.id}
                            href={`/gallery?photo=${image.id}`}
                            className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
                            onMouseEnter={() => setHoveredId(image.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Image or Placeholder */}
                            {image.url ? (
                                <Image
                                    src={image.url}
                                    alt={image.title || "Gallery Image"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 via-primary-300 to-gold-200 dark:from-primary-800 dark:via-primary-700 dark:to-gold-800 transition-transform duration-500 group-hover:scale-110">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-5xl md:text-6xl font-display font-bold text-white/30">
                                            {(image.title || "G").charAt(0)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${hoveredId === image.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                {/* Zoom Icon */}
                                <div className="absolute top-3 right-3">
                                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                        <ZoomIn className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                {/* Caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-semibold text-base">
                                        {image.title || "গ্যালারি ছবি"}
                                    </p>
                                    <p className="text-white/70 text-sm mt-1">
                                        {image.year || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Border on hover */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-400/50 transition-colors pointer-events-none" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
