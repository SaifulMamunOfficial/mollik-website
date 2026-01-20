// Home Page Types
import { Prisma } from '@prisma/client';

// Stats for Biography and WorksGrid
export interface HomeStats {
    poemCount: number;
    songCount: number;
    bookCount: number;
    essayCount: number;
}

// Featured Poem from Writing model
export type FeaturedPoem = {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    year: string | null;
    views: number;
};

// Featured Song from Writing model
export type FeaturedSong = {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    year: string | null;
    composer: string | null;
};

// Featured Video
export type FeaturedVideo = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    youtubeId: string;
    thumbnail: string | null;
    duration: string | null;
    views: number;
    category: string | null;
};

// Gallery Image
export type FeaturedGalleryImage = {
    id: string;
    title: string | null;
    description: string | null;
    url: string;
    year: string | null;
};

// Blog Post
export type RecentBlogPost = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    createdAt: Date;
    author: {
        name: string | null;
    };
    category: {
        name: string;
    } | null;
};

// Tribute
export type FeaturedTribute = {
    id: string;
    content: string;
    name: string | null;
    designation: string | null;
    district: string | null;
    displayOption: string;
    createdAt: Date;
    author: {
        name: string | null;
    };
};

// Award from SiteSettings JSON
export interface Award {
    id?: number;
    title: string;
    year: string;
    category: string;
    description: string;
    featured?: boolean;
}

// Works Grid Item
export interface WorkItem {
    name: string;
    description: string;
    slug?: string;
}

// Latest Works for WorksGrid
export interface LatestWorks {
    poems: FeaturedPoem[];
    songs: FeaturedSong[];
    books: {
        id: string;
        slug: string;
        title: string;
        subtitle: string | null;
    }[];
}
