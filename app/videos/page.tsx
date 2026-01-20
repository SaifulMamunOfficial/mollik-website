import { getVideosFromDB } from "@/lib/data";
import { getYouTubeVideoStats } from "@/lib/youtube";
import VideosClient from "./VideosClient";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "ভিডিও",
    description: "কবি মতিউর রহমান মল্লিকের গান, সাক্ষাৎকার এবং বিভিন্ন অনুষ্ঠানের ভিডিও আর্কাইভ।",
};

export default async function VideosPage() {
    const videos = await getVideosFromDB();

    // Fetch live YouTube stats
    const youtubeIds = videos.map(v => v.youtubeId).filter(Boolean);
    const stats = await getYouTubeVideoStats(youtubeIds);

    // Merge stats with videos
    const enrichedVideos = videos.map(video => {
        const stat = stats[video.youtubeId];
        return {
            ...video,
            // Use live YouTube views/duration if available, otherwise fallback to DB
            views: stat?.viewCount || video.views,
            duration: stat?.duration || video.duration
        };
    });

    return <VideosClient videos={enrichedVideos} />;
}
