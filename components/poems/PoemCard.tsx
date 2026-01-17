import Link from "next/link";
import { BookOpen, Calendar, Eye, Heart } from "lucide-react";

interface Poem {
    id: string | number;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    category?: string;
    year?: string;
    views?: number;
    likes?: number;
}

interface PoemCardProps {
    poem: Poem;
}

export function PoemCard({ poem }: PoemCardProps) {
    return (
        <Link
            href={`/poems/${poem.slug}`}
            className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                            {poem.category || "কবিতা"}
                        </span>
                        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                            {poem.title}
                        </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-gold-400 transition-colors">
                        <BookOpen className="w-4 h-4" />
                    </div>
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-line line-clamp-4 font-bengali">
                    {poem.excerpt || (poem.content ? poem.content.slice(0, 150) + (poem.content.length > 150 ? "..." : "") : "কিঞ্চিৎ সারসংক্ষেপ")}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {poem.year}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {poem.views}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 group-hover:text-red-500 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        {poem.likes}
                    </span>
                </div>
            </div>
        </Link>
    );
}
