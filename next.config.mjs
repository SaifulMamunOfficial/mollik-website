/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'motiurrahmanmollik.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'i.ibb.co',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                hostname: 'img.youtube.com',
            },
            {
                protocol: 'https',
                hostname: 'www.somodhara.com',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        // Image optimization settings
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },
    // Enable compression
    compress: true,
    // Optimize packages
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    // Headers for caching and security
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
