import { Metadata } from "next";

export const metadata: Metadata = {
    title: "গান ও সংগীত",
    description: "কবি মতিউর রহমান মল্লিকের রচিত গানসমূহ। হামদ, নাত, দেশাত্মবোধক ও ভক্তিমূলক গান।",
    openGraph: {
        title: "কবি মতিউর রহমান মল্লিক - গান ও সংগীত",
        description: "সাইমুম শিল্পীগোষ্ঠীর জনপ্রিয় গানের সংগ্রহ।",
    },
};

export default function SongsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
