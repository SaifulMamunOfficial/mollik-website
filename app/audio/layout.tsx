import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "অডিও আর্কাইভ | কবি মতিউর রহমান মল্লিক",
    description: "কবি মতিউর রহমান মল্লিকের গান, বক্তব্য ও আবৃত্তির অডিও সংকলন। শুনুন এবং ডাউনলোড করুন।",
};

export default function AudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
