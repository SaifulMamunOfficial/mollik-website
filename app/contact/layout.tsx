import { Metadata } from "next";

export const metadata: Metadata = {
    title: "যোগাযোগ",
    description: "কবি মতিউর রহমান মল্লিক আর্কাইভের সাথে যোগাযোগ করুন। সাইমুম শিল্পীগোষ্ঠীর যোগাযোগ তথ্য।",
    openGraph: {
        title: "কবি মতিউর রহমান মল্লিক - যোগাযোগ",
        description: "আর্কাইভ পরিচালনা দলের সাথে যোগাযোগ করুন।",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
