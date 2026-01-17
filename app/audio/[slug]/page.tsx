
import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import AudioDetailClient from "./AudioDetailClient";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const decodedSlug = decodeURIComponent(params.slug);
    const track = await prisma.audio.findUnique({
        where: { slug: decodedSlug }
    });

    if (!track) {
        return {
            title: "অডিও ট্র্যাক পাওয়া যায়নি",
        };
    }

    return {
        title: track.title,
        description: `শুনুন কবি মতিউর রহমান মল্লিকের ${track.album ? 'অ্যালবাম: ' + track.album : 'অডিও'} - ${track.title}।`,
    };
}

export default async function AudioDetailPage({ params }: Props) {
    const decodedSlug = decodeURIComponent(params.slug);

    const track = await prisma.audio.findUnique({
        where: { slug: decodedSlug, status: 'PUBLISHED' }
    });

    if (!track) {
        notFound();
    }

    // Get related tracks (same album if exists, or just latest)
    const relatedTracksData = await prisma.audio.findMany({
        where: {
            status: 'PUBLISHED',
            id: { not: track.id },
            ...(track.album ? { album: track.album } : {})
        },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    // Normalize data
    const normalize = (t: any) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        artist: t.artist || "মতিউর রহমান মল্লিক",
        album: t.album || "একক",
        duration: t.duration || "N/A",
        audioUrl: t.audioUrl,
        coverImage: t.coverImage || "",
        lyrics: t.lyrics || "",
        category: "song", // Defaulting to 'song' for now as DB doesn't have strict category enum for audio yet
        embedUrl: t.audioUrl // Using audioUrl as embedUrl for now
    });

    const normalizedTrack = normalize(track);
    const normalizedRelated = relatedTracksData.map(normalize);

    return <AudioDetailClient track={normalizedTrack} relatedTracks={normalizedRelated} />;
}
