import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ভিডিও আর্কাইভ | কবি মতিউর রহমান মল্লিক",
    description: "কবি মতিউর রহমান মল্লিকের ভিডিও সংকলন। গান, ডকুমেন্টারি এবং সাক্ষাৎকার দেখুন।",
};

export default function VideoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
