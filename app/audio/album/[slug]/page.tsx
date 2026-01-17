
import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import AlbumDetailClient from "./AlbumDetailClient";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = params.slug;

    // We infer album data from the first track with this albumSlug
    const track = await prisma.audio.findFirst({
        where: { albumSlug: slug, status: 'PUBLISHED' }
    });

    if (!track) {
        return {
            title: "অ্যালবাম পাওয়া যায়নি",
        };
    }

    return {
        title: track.album || "অ্যালবাম",
        description: `শুনুন কবি মতিউর রহমান মল্লিকের অ্যালবাম - ${track.album}।`,
    };
}

export default async function AlbumDetailPage({ params }: Props) {
    const slug = params.slug;

    // Fetch all tracks for this album
    const tracks = await prisma.audio.findMany({
        where: { albumSlug: slug, status: 'PUBLISHED' },
        orderBy: { createdAt: 'asc' } // Assuming created order is track order, or we could add a trackNumber field later
    });

    if (!tracks || tracks.length === 0) {
        notFound();
    }

    // Infer album metadata from the first track
    const firstTrack = tracks[0];
    const album = {
        title: firstTrack.album || "অজানা অ্যালবাম",
        artist: firstTrack.artist || "মতিউর রহমান মল্লিক",
        cover: firstTrack.coverImage || "/images/audio-cover.jpg",
        year: firstTrack.createdAt ? new Date(firstTrack.createdAt).getFullYear().toString() : "2005",
        slug: slug
    };

    // Normalize tracks
    const normalizedTracks = tracks.map(t => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        category: "song", // Default or fetch if available
        duration: t.duration || "N/A"
    }));

    return <AlbumDetailClient album={album} albumTracks={normalizedTracks} />;
}
