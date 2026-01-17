import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSongsFromDB } from "@/lib/data";
import SongsClientPage from "./SongsClientPage";

export const dynamic = 'force-dynamic'

export default async function SongsPage() {
    const songs = await getSongsFromDB();

    return (
        <>
            <Header />
            <SongsClientPage songs={songs} />
            <Footer />
        </>
    );
}
