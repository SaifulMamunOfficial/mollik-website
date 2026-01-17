import { Metadata } from "next";

export const metadata: Metadata = {
    title: "গ্রন্থাগার",
    description: "কবি মতিউর রহমান মল্লিকের প্রকাশিত সকল বই। কাব্যগ্রন্থ, গানের বই, এবং গদ্য সংকলন পড়ুন।",
    openGraph: {
        title: "কবি মতিউর রহমান মল্লিক - গ্রন্থাগার",
        description: "মল্লিকের সাহিত্যকর্মের ডিজিটাল গ্রন্থাগার।",
    },
};

export default function BooksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
