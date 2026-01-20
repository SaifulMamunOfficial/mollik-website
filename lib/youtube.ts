import { unstable_cache } from 'next/cache';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/videos';

interface YouTubeVideoStats {
    id: string;
    viewCount?: number;
    likeCount?: string;
    duration?: string; // Formatted duration (e.g., "4:05")
}

// Helper to parse ISO 8601 duration (PT4M13S -> 4:13)
const parseDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";

    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");

    let result = "";

    if (hours) {
        result += `${hours}:`;
        result += `${minutes.padStart(2, "0")}:`;
    } else {
        result += `${minutes || "0"}:`;
    }

    result += seconds.padStart(2, "0");
    return result;
};

/**
 * Validates the YouTube API Key
 */
export const hasYouTubeApiKey = () => !!YOUTUBE_API_KEY;

/**
 * Fetches statistics and details for a batch of YouTube video IDs.
 * Uses Next.js unstable_cache to cache results for 1 hour.
 * 
 * @param youtubeIds Array of YouTube Video IDs (max 50 recommended per batch)
 * @returns Map of YouTube ID to stats object
 */
export const getYouTubeVideoStats = async (youtubeIds: string[]): Promise<Record<string, YouTubeVideoStats>> => {
    if (!YOUTUBE_API_KEY || youtubeIds.length === 0) {
        return {};
    }

    // Deduplicate IDs
    const uniqueIds = Array.from(new Set(youtubeIds));

    // Chunk into batches of 50 (YouTube API limit)
    const chunks = [];
    for (let i = 0; i < uniqueIds.length; i += 50) {
        chunks.push(uniqueIds.slice(i, i + 50));
    }

    const statsMap: Record<string, YouTubeVideoStats> = {};

    try {
        const promises = chunks.map(async (chunk) => {
            // Request 'statistics' and 'contentDetails' (for duration)
            const url = `${YOUTUBE_API_BASE}?part=statistics,contentDetails&id=${chunk.join(',')}&key=${YOUTUBE_API_KEY}`;

            const response = await fetch(url, {
                next: { revalidate: 3600 } // Cache for 1 hour
            });

            if (!response.ok) {
                console.error(`YouTube API Error: ${response.status} ${response.statusText}`);
                return;
            }

            const data = await response.json();

            if (data.items) {
                data.items.forEach((item: any) => {
                    statsMap[item.id] = {
                        id: item.id,
                        viewCount: item.statistics?.viewCount ? parseInt(item.statistics.viewCount, 10) : undefined,
                        duration: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : undefined
                    };
                });
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Failed to fetch YouTube stats:', error);
    }

    return statsMap;
};

/**
 * Fetches the latest videos from a specific YouTube channel.
 * Uses the 'search' endpoint with order=date.
 * 
 * @param channelId YouTube Channel ID
 * @returns Array of video objects { id, title, description, thumbnail, publishedAt }
 */
export const getChannelLatestVideos = async (channelId: string) => {
    if (!YOUTUBE_API_KEY) return [];

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${YOUTUBE_API_KEY}`;

        const response = await fetch(url, {
            next: { revalidate: 300 } // Cache for 5 mins
        });

        if (!response.ok) {
            console.error(`YouTube API Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (!data.items) return [];

        return data.items.map((item: any) => ({
            youtubeId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            publishedAt: item.snippet.publishedAt
        }));

    } catch (error) {
        console.error('Failed to fetch channel videos:', error);
        return [];
    }
};
