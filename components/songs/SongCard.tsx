import Link from "next/link";
import { Music, PlayCircle, Eye, Heart } from "lucide-react";

interface Song {
    id: string | number;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    category?: string;
    year?: string;
    views?: number;
    likes?: number;
    type?: string;
}

interface SongCardProps {
    song: Song;
}

export function SongCard({ song }: SongCardProps) {
    return (
        <Link
            href={`/songs/${song.slug}`}
            className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                            {song.category || song.type || "গান"}
                        </span>
                        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {song.title}
                        </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        <Music className="w-4 h-4" />
                    </div>
                </div>

                {/* Excerpt/Lyrics Preview */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-line line-clamp-4 font-bengali">
                    {song.excerpt || (song.content ? song.content.slice(0, 150) + (song.content.length > 150 ? "..." : "") : "কিঞ্চিৎ সারসংক্ষেপ")}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <PlayCircle className="w-3.5 h-3.5" />
                            {/* Placeholder for audio duration if available later */}
                            লিসত্
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {song.views}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 group-hover:text-red-500 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        {song.likes}
                    </span>
                </div>
            </div>
        </Link>
    );
}
