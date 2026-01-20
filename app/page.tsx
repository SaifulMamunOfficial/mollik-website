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
import prisma from "@/lib/prisma";

// Fetch all home page data
async function getHomePageData() {
    const [
        settings,
        featuredPoems,
        featuredSongs,
        featuredVideos,
        featuredImages,
        recentBlogs,
        featuredTributes,
        poemCount,
        songCount,
        bookCount,
        essayCount,
        latestBooks,
    ] = await Promise.all([
        // Site Settings
        prisma.siteSettings.findFirst(),

        // Featured Poems (top 4)
        prisma.writing.findMany({
            where: { type: 'POEM', featured: true, status: 'PUBLISHED' },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                year: true,
                views: true,
            },
            orderBy: { views: 'desc' },
            take: 4,
        }),

        // Featured Songs (top 3)
        prisma.writing.findMany({
            where: { type: 'SONG', featured: true, status: 'PUBLISHED' },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                year: true,
                composer: true,
            },
            orderBy: { views: 'desc' },
            take: 3,
        }),

        // Featured Videos (top 3)
        prisma.video.findMany({
            where: { featured: true, status: 'PUBLISHED' },
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                youtubeId: true,
                thumbnail: true,
                duration: true,
                views: true,
                category: true,
            },
            orderBy: { views: 'desc' },
            take: 3,
        }),

        // Featured Gallery Images (top 4)
        prisma.galleryImage.findMany({
            where: { featured: true, status: 'PUBLISHED' },
            select: {
                id: true,
                title: true,
                description: true,
                url: true,
                year: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 4,
        }),

        // Recent Blog Posts (top 3)
        prisma.blogPost.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                coverImage: true,
                createdAt: true,
                author: { select: { name: true } },
                category: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
        }),

        // Featured Tributes (top 3)
        prisma.tribute.findMany({
            where: { isFeatured: true, status: 'PUBLISHED' },
            select: {
                id: true,
                content: true,
                name: true,
                designation: true,
                district: true,
                displayOption: true,
                createdAt: true,
                author: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
        }),

        // Stats - Poem count
        prisma.writing.count({ where: { type: 'POEM', status: 'PUBLISHED' } }),

        // Stats - Song count
        prisma.writing.count({ where: { type: 'SONG', status: 'PUBLISHED' } }),

        // Stats - Book count
        prisma.book.count(),

        // Stats - Essay count
        prisma.writing.count({ where: { type: 'ESSAY', status: 'PUBLISHED' } }),

        // Latest Books (top 2)
        prisma.book.findMany({
            select: {
                id: true,
                slug: true,
                title: true,
                subtitle: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 2,
        }),
    ]);

    // Parse awards from settings JSON - can be string[] or object[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let awards: any[] = [];
    if (settings?.awards && Array.isArray(settings.awards)) {
        awards = settings.awards;
    }

    return {
        settings,
        featuredPoems,
        featuredSongs,
        featuredVideos,
        featuredImages,
        recentBlogs,
        featuredTributes,
        awards,
        stats: {
            poemCount,
            songCount,
            bookCount,
            essayCount,
        },
        latestWorks: {
            poems: featuredPoems.slice(0, 2),
            songs: featuredSongs.slice(0, 2),
            books: latestBooks,
        },
    };
}

export default async function Home() {
    const data = await getHomePageData();

    return (
        <>
            <Header />
            <main id="main-content" className="flex-1">
                <HeroSection settings={data.settings} />
                <BiographySection settings={data.settings} stats={data.stats} />
                <AwardsSection awards={data.awards} />
                <FeaturedPoems poems={data.featuredPoems} />
                <FeaturedSongs songs={data.featuredSongs} />
                <PhotoGalleryPreview images={data.featuredImages} />
                <VideoHighlights videos={data.featuredVideos} />
                <WorksGrid stats={data.stats} latestWorks={data.latestWorks} />
                <TributeSection tributes={data.featuredTributes} />
                <RecentBlog posts={data.recentBlogs} />
            </main>
            <Footer />
        </>
    );
}
