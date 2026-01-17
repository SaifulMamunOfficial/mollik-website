
import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import VideoDetailClient from "./VideoDetailClient";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const decodedSlug = decodeURIComponent(params.slug);
    const video = await prisma.video.findUnique({
        where: { slug: decodedSlug }
    });

    if (!video) {
        return {
            title: "ভিডিও পাওয়া যায়নি",
        };
    }

    return {
        title: video.title,
        description: video.description ? video.description.substring(0, 160) : video.title,
    };
}

export default async function VideoDetailPage({ params }: Props) {
    const decodedSlug = decodeURIComponent(params.slug);

    const video = await prisma.video.findUnique({
        where: { slug: decodedSlug, status: 'PUBLISHED' }
    });

    if (!video) {
        notFound();
    }

    // Get related videos (same category)
    const relatedVideosData = await prisma.video.findMany({
        where: {
            status: 'PUBLISHED',
            id: { not: video.id },
            ...(video.category ? { category: video.category } : {})
        },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    // Normalize data
    const normalize = (v: any) => ({
        id: v.id,
        title: v.title,
        slug: v.slug,
        description: v.description || "",
        youtubeId: v.youtubeId,
        thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`,
        duration: v.duration || "N/A",
        views: v.views,
        category: v.category || "video",
        year: v.createdAt ? new Date(v.createdAt).getFullYear().toString() : "2024",
        featured: v.featured
    });

    const normalizedVideo = normalize(video);
    const normalizedRelated = relatedVideosData.map(normalize);

    return <VideoDetailClient video={normalizedVideo} relatedVideos={normalizedRelated} />;
}
