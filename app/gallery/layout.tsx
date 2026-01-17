import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ছবিঘর",
    description: "কবি মতিউর রহমান মল্লিকের দুর্লভ ছবি সংগ্রহ। বিভিন্ন সময়ের স্মৃতিচিত্র।",
    openGraph: {
        title: "কবি মতিউর রহমান মল্লিক - ছবিঘর",
        description: "কবির জীবনের বিভিন্ন মুহূর্তের আলোকচিত্র।",
    },
};

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
