import { Metadata } from "next";

export const metadata: Metadata = {
    title: "কবিতা সম্ভার",
    description: "কবি মতিউর রহমান মল্লিকের সকল কবিতা। ভক্তি, প্রকৃতি, দেশপ্রেম ও মানবতার কবিতাগুলো পড়ুন এখানে।",
    openGraph: {
        title: "কবি মতিউর রহমান মল্লিক - কবিতা সম্ভার",
        description: "বাংলা কবিতার এক অনন্য সংকলন। মতিউর রহমান মল্লিকের অমর কবিতাগুলো পড়ুন।",
    },
};

export default function PoemsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
