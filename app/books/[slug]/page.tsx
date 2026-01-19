
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
    Calendar,
    ArrowLeft,
    BookOpen,
    FileText,
    ChevronRight,
    Search, // Kept Search for UI but logic will need client Component or simple implementation
    Clock
} from "lucide-react";
import { getBookBySlugFromDB, getWritingsByBookSlugFromDB } from "@/lib/data";
import BookDetailClient from "./BookDetailClient"; // Moving client logic here

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function BookDetailPage({ params }: PageProps) {
    const decodedSlug = decodeURIComponent(params.slug);
    const book = await getBookBySlugFromDB(decodedSlug);

    if (!book) {
        notFound();
    }

    const writings = await getWritingsByBookSlugFromDB(decodedSlug);

    // Casting strict types to match Client expectations if loosely typed in lib
    const formattedWritings = writings.map(w => ({
        ...w,
        type: (w.type === 'কবিতা' || w.type === 'গান' || w.type === 'প্রবন্ধ') ? w.type : 'কবিতা', // Fallback safely
        readTime: '5 min'
    }));

    return (
        <BookDetailClient book={book} writings={formattedWritings} />
    );
}
