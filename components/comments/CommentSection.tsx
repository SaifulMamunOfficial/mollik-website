"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    MessageSquare,
    Send,
    Trash2,
    Loader2,
    User,
    AlertCircle,
} from "lucide-react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    timeAgo: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface CommentSectionProps {
    writingId?: string;
    blogPostId?: string;
    title?: string;
}

export function CommentSection({ writingId, blogPostId, title = "মন্তব্য" }: CommentSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const params = new URLSearchParams();
                if (writingId) params.set("writingId", writingId);
                if (blogPostId) params.set("blogPostId", blogPostId);

                const response = await fetch(`/api/comments?${params.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments);
                }
            } catch (err) {
                console.error("Error fetching comments:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (writingId || blogPostId) {
            fetchComments();
        }
    }, [writingId, blogPostId]);

    // Submit comment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newComment,
                    writingId,
                    blogPostId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Add new comment to list
                setComments(prev => [{
                    ...data.comment,
                    timeAgo: "এইমাত্র"
                }, ...prev]);
                setNewComment("");
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("মন্তব্য করতে সমস্যা হয়েছে");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete comment
    const handleDelete = async (commentId: string) => {
        if (deletingId) return;

        setDeletingId(commentId);
        try {
            const response = await fetch(`/api/comments?id=${commentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setComments(prev => prev.filter(c => c.id !== commentId));
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary-600 dark:text-gold-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({comments.length})
                    </span>
                </div>
            </div>

            {/* Comment Form */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                {session ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-gold-500 dark:to-gold-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || ""}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    session.user?.name?.charAt(0) || "?"
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="আপনার মন্তব্য লিখুন..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                />
                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || isSubmitting}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-gold-600 dark:hover:bg-gold-500 text-white dark:text-primary-950 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        মন্তব্য করুন
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400 mb-3">
                            মন্তব্য করতে লগইন করুন
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                        >
                            <User className="w-4 h-4" />
                            লগইন করুন
                        </Link>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-gold-400 mx-auto" />
                        <p className="text-gray-500 dark:text-gray-400 mt-2">মন্তব্য লোড হচ্ছে...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                            এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যকারী হন!
                        </p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        // Check if this is the logged-in user's comment
                        const isOwnComment = session?.user?.id === comment.user.id;
                        const profileLink = isOwnComment ? "/profile" : `/user/${comment.user.id}`;

                        return (
                            <div key={comment.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex gap-3">
                                    <Link
                                        href={profileLink}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white font-bold flex-shrink-0 hover:ring-2 hover:ring-primary-500 dark:hover:ring-gold-400 transition-all"
                                        title={isOwnComment ? "আপনার প্রোফাইল" : `${comment.user.name || "ব্যবহারকারী"} এর প্রোফাইল দেখুন`}
                                    >
                                        {comment.user.image ? (
                                            <img
                                                src={comment.user.image}
                                                alt={comment.user.name || ""}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            comment.user.name?.charAt(0) || "?"
                                        )}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <Link
                                                    href={profileLink}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-gold-400 transition-colors"
                                                >
                                                    {comment.user.name || "অজানা ব্যবহারকারী"}
                                                </Link>
                                                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                                                    {comment.timeAgo}
                                                </span>
                                            </div>
                                            {session?.user?.id === comment.user.id && (
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    disabled={deletingId === comment.id}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="মন্তব্য মুছুন"
                                                >
                                                    {deletingId === comment.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
