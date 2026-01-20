import { getTributesFromDB } from "@/lib/data";
import TributesClient from "./TributesClient";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "শোকবার্তা",
    description: "কবি মতিউর রহমান মল্লিকের প্রতি শ্রদ্ধা নিবেদন এবং স্মৃতিচারণ।",
};

export default async function TributesPage() {
    const tributes = await getTributesFromDB();
    return <TributesClient tributes={tributes} />;
}
