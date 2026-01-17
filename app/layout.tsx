import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Serif_Bengali, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";

// Bengali reading font
const hindSiliguri = Hind_Siliguri({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['bengali', 'latin'],
    display: 'swap',
    variable: '--font-bengali',
});

// Bengali display/serif font
const notoSerifBengali = Noto_Serif_Bengali({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['bengali', 'latin'],
    display: 'swap',
    variable: '--font-bengali-serif',
});

// English display font
const playfairDisplay = Playfair_Display({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-display',
});

export const metadata: Metadata = {
    title: {
        default: "কবি মতিউর রহমান মল্লিক",
        template: "%s | কবি মতিউর রহমান মল্লিক"
    },
    description: "কবি মতিউর রহমান মল্লিক (১৯৫০-২০১০) এর সাহিত্যিক ঐতিহ্য সংরক্ষণের জন্য নিবেদিত স্মারক ওয়েবসাইট। কবিতা, গান, গ্রন্থ ও জীবনী।",
    keywords: ["মতিউর রহমান মল্লিক", "কবি", "স্মারক", "সাহিত্য", "কবিতা", "বই", "গদ্য", "ঐতিহ্য", "বাংলা কবিতা"],
    authors: [{ name: "মতিউর রহমান মল্লিক" }],
    creator: "Mollik Memorial Foundation",
    openGraph: {
        type: "website",
        locale: "bn_BD",
        url: "https://motiurrahmanmollik.com",
        siteName: "কবি মতিউর রহমান মল্লিক",
        title: "কবি মতিউর রহমান মল্লিক - সাহিত্যিক স্মারক",
        description: "ভবিষ্যৎ প্রজন্মের জন্য সংরক্ষিত সাহিত্যিক ঐতিহ্য",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "কবি মতিউর রহমান মল্লিক",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "কবি মতিউর রহমান মল্লিক",
        description: "ভবিষ্যৎ প্রজন্মের জন্য সংরক্ষিত সাহিত্যিক ঐতিহ্য",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="bn" suppressHydrationWarning className={`${hindSiliguri.variable} ${notoSerifBengali.variable} ${playfairDisplay.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#059669" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />

                {/* Preconnect to external domains for performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Person",
                            "name": "মতিউর রহমান মল্লিক",
                            "alternateName": "Motiur Rahman Mollik",
                            "birthDate": "1950-08-12",
                            "deathDate": "2010-08-12",
                            "nationality": "Bangladeshi",
                            "jobTitle": "Poet, Lyricist, Writer",
                            "description": "কবি মতিউর রহমান মল্লিক (১৯৫০-২০১০) বাংলাদেশের একজন বিশিষ্ট কবি, গীতিকার ও লেখক।",
                            "sameAs": [
                                "https://www.facebook.com/MM12082010",
                                "https://en.wikipedia.org/wiki/Motiur_Rahman_Mollik"
                            ],
                            "url": "https://motiurrahmanmollik.com"
                        })
                    }}
                />
            </head>
            <body className="min-h-screen flex flex-col font-bengali">
                {/* Skip to main content - Accessibility */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[rgb(var(--primary))] focus:text-white focus:rounded-lg"
                >
                    প্রধান বিষয়বস্তুতে যান
                </a>

                <AuthSessionProvider>
                    {children}
                </AuthSessionProvider>
            </body>
        </html>
    );
}

