import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ব্লগ",
    description: "কবি মতিউর রহমান মল্লিক সম্পর্কে লেখা, স্মৃতিচারণ এবং বিশ্লেষণমূলক প্রবন্ধ পড়ুন।",
    openGraph: {
        title: "কবি মতিউর রহমান মল্লিক - ব্লগ",
        description: "সাহিত্য প্রেমীদের লেখা সংগ্রহ।",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
