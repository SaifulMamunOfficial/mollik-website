import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { BiographySection } from "@/components/home/BiographySection";
import { FeaturedPoems } from "@/components/home/FeaturedPoems";
import { FeaturedSongs } from "@/components/home/FeaturedSongs";
import { WorksGrid } from "@/components/home/WorksGrid";
import { TributeSection } from "@/components/home/TributeSection";
import { RecentBlog } from "@/components/home/RecentBlog";
import { PhotoGalleryPreview } from "@/components/home/PhotoGalleryPreview";
import { VideoHighlights } from "@/components/home/VideoHighlights";
import { AwardsSection } from "@/components/home/AwardsSection";

export default function Home() {
    return (
        <>
            <Header />
            <main id="main-content" className="flex-1">
                <HeroSection />
                <BiographySection />
                <AwardsSection />
                <FeaturedPoems />
                <FeaturedSongs />
                <PhotoGalleryPreview />
                <VideoHighlights />
                <WorksGrid />
                <TributeSection />
                <RecentBlog />
            </main>
            <Footer />
        </>
    );
}

