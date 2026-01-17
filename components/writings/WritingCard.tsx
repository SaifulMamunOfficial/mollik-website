import Link from "next/link";
import { BookOpen, Calendar, Eye, Heart, Music, Mic2, FileText } from "lucide-react";
import { Writing } from "@/lib/data";

interface WritingCardProps {
    writing: Writing;
    theme?: 'poem' | 'song';
    showComposer?: boolean;
}

export function WritingCard({ writing, theme, showComposer = true }: WritingCardProps) {
    // Determine the theme based on the prop or the writing kind
    const resolvedTheme = theme || (writing.kind === 'song' ? 'song' : 'poem');

    // Theme-specific styles and icons
    const isSong = resolvedTheme === 'song';

    // Dynamic styles
    const categoryBg = isSong
        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
        : "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-gold-400";

    const iconBg = isSong
        ? "group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
        : "group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-gold-400";

    const hoverBorder = isSong
        ? "hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:shadow-emerald-100/50 dark:hover:shadow-none"
        : "hover:border-primary-200 dark:hover:border-primary-800/50 hover:shadow-primary-500/5";

    const titleHover = isSong
        ? "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
        : "group-hover:text-primary-600 dark:group-hover:text-gold-400";

    const Icon = isSong ? Music : (writing.kind === 'essay' ? FileText : BookOpen);

    let href = `/poems/${writing.slug}`;
    if (writing.kind === 'song') href = `/songs/${writing.slug}`;
    if (writing.kind === 'essay') href = `/prose/${writing.slug}`;

    return (
        <Link
            href={href}
            className={`group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 ${hoverBorder}`}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className={`inline-block px-3 py-1 mb-2 text-xs font-medium rounded-full ${categoryBg}`}>
                            {writing.category || writing.type || (isSong ? "গান" : "কবিতা")}
                        </span>
                        <h3 className={`font-display text-xl font-bold text-gray-900 dark:text-white transition-colors ${titleHover}`}>
                            {writing.title}
                        </h3>
                        {/* Composer Info for Songs */}
                        {isSong && showComposer && writing.composer && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <Mic2 className="w-3 h-3" />
                                <span>সুর: {writing.composer}</span>
                            </div>
                        )}
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors ${iconBg}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-line line-clamp-4 font-bengali">
                    {writing.excerpt || (writing.content ? writing.content.slice(0, 150) + (writing.content.length > 150 ? "..." : "") : "কিঞ্চিৎ সারসংক্ষেপ")}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {writing.year || "অজানা"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {writing.views?.toLocaleString('bn-BD') || 0}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 group-hover:text-red-500 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        {writing.likes?.toLocaleString('bn-BD') || 0}
                    </span>
                </div>
            </div>
        </Link>
    );
}
