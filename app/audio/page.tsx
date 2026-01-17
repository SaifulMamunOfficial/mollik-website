import { getAudioFromDB } from "@/lib/data";
import AudioClient from "./AudioClient";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "অডিও",
    description: "কবি মতিউর রহমান মল্লিকের গান, হামদ, নাত এবং কবিতার অডিও সংকলন।",
};

export default async function AudioPage() {
    const audioTracks = await getAudioFromDB();
    return <AudioClient audioTracks={audioTracks} />;
}
