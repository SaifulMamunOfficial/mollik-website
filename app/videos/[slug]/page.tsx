
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
    // Normalize data helper
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

    let normalizedVideo = normalize(video);
    let normalizedRelated = relatedVideosData.map(normalize);

    // Fetch live YouTube stats
    try {
        const { getYouTubeVideoStats } = await import("@/lib/youtube");
        const allYoutubeIds = [video.youtubeId, ...relatedVideosData.map(v => v.youtubeId)].filter(Boolean);
        const stats = await getYouTubeVideoStats(allYoutubeIds);

        // Update views & duration for main video
        const mainVideoStat = stats[video.youtubeId];
        if (mainVideoStat) {
            normalizedVideo = {
                ...normalizedVideo,
                views: mainVideoStat.viewCount || normalizedVideo.views,
                duration: mainVideoStat.duration || normalizedVideo.duration
            };
        }

        // Update views & duration for related videos
        normalizedRelated = normalizedRelated.map(v => {
            const stat = stats[v.youtubeId];
            return {
                ...v,
                views: stat?.viewCount || v.views,
                duration: stat?.duration || v.duration
            };
        });
    } catch (error) {
        console.error("Failed to fetch YouTube stats:", error);
    }

    return <VideoDetailClient video={normalizedVideo} relatedVideos={normalizedRelated} />;
}
