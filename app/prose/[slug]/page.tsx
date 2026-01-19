
import { notFound } from "next/navigation";
import { getWritingBySlugFromDB, getEssaysFromDB, getBookBySlugFromDB } from "@/lib/data";
import ProseDetailClient from "./ProseDetailClient";

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function ProseDetailPage({ params }: PageProps) {
    const decodedSlug = decodeURIComponent(params.slug);

    const essay = await getWritingBySlugFromDB(decodedSlug);

    if (!essay) {
        notFound();
    }

    const allEssays = await getEssaysFromDB();
    const relatedEssays = allEssays.filter(e => e.id !== essay.id).slice(0, 2);

    const book = essay.bookSlug ? await getBookBySlugFromDB(essay.bookSlug) : null;

    // Type casting/transformation for Client Component
    const formattedEssay = {
        ...essay,
        type: essay.type, // 'প্রবন্ধ'
        kind: essay.kind, // 'essay'
        year: essay.year || "",
        views: essay.views || 0,
        likes: essay.likes || 0,
        readTime: "5 মিনিট"
    };

    return (
        <ProseDetailClient
            essay={formattedEssay}
            relatedEssays={relatedEssays}
            book={book}
        />
    );
}
