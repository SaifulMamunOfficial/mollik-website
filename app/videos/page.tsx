import { getVideosFromDB } from "@/lib/data";
import VideosClient from "./VideosClient";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "ভিডিও",
    description: "কবি মতিউর রহমান মল্লিকের গান, সাক্ষাৎকার এবং বিভিন্ন অনুষ্ঠানের ভিডিও আর্কাইভ।",
};

export default async function VideosPage() {
    const videos = await getVideosFromDB();
    return <VideosClient videos={videos} />;
}
