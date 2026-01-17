import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://motiurrahmanmollik.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/profile/',
                    '/profile/settings/',
                    '/_next/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
