import { getGalleryFromDB } from "@/lib/data";
import GalleryClient from "./GalleryClient";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "গ্যালারি",
    description: "কবি মতিউর রহমান মল্লিকের জীবনের দুর্লভ মুহূর্ত এবং স্মৃতিবিজড়িত ছবি।",
};

export default async function GalleryPage() {
    const galleryItems = await getGalleryFromDB();
    return <GalleryClient galleryItems={galleryItems} />;
}
