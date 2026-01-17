
import { notFound } from "next/navigation";
import { getWritingBySlugFromDB, getSongsFromDB, getBookBySlugFromDB } from "@/lib/data";
import SongDetailClient from "./SongDetailClient";

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SongDetailPage({ params }: PageProps) {
    const decodedSlug = decodeURIComponent(params.slug);

    // Fetch data in parallel
    const song = await getWritingBySlugFromDB(decodedSlug);

    if (!song) {
        notFound();
    }

    const allSongs = await getSongsFromDB();
    const relatedSongs = allSongs.filter(s => s.id !== song.id).slice(0, 2);

    const book = song.bookSlug ? await getBookBySlugFromDB(song.bookSlug) : null;

    // Type casting/transformation for Client Component
    const formattedSong = {
        ...song,
        category: song.category || "গান",
        type: song.type,
        kind: song.kind,
        year: song.year || "", // Ensure strictly string
        views: song.views || 0,
        likes: song.likes || 0
    };

    return (
        <SongDetailClient
            song={formattedSong}
            relatedSongs={relatedSongs}
            book={book}
        />
    );
}
