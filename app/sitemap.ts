import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://motiurrahmanmollik.com';

    // Static pages
    const staticPages = [
        '',
        '/biography',
        '/poems',
        '/prose',
        '/songs',
        '/books',
        '/gallery',
        '/audio',
        '/videos',
        '/tributes',
        '/blog',
        '/blog/new',
        '/contact',
        '/login',
        '/register',
    ];

    const staticEntries = staticPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1 : route === '/biography' ? 0.9 : 0.8,
    }));

    // You can add dynamic pages here by fetching from your data
    // For example: poems, books, blog posts, etc.
    // const poems = await getPoems();
    // const poemEntries = poems.map((poem) => ({
    //     url: `${baseUrl}/poems/${poem.slug}`,
    //     lastModified: poem.updatedAt,
    //     changeFrequency: 'monthly' as const,
    //     priority: 0.7,
    // }));

    return [
        ...staticEntries,
        // ...poemEntries,
    ];
}
