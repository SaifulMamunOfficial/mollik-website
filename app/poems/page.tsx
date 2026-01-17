import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPoemsFromDB } from "@/lib/data";
import PoemsClientPage from "./PoemsClientPage";

export const dynamic = 'force-dynamic'

export default async function PoemsPage() {
    const poems = await getPoemsFromDB();

    return (
        <>
            <Header />
            <PoemsClientPage poems={poems} />
            <Footer />
        </>
    );
}
