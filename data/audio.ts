export interface Album {
    id: number;
    title: string;
    slug: string;
    artist: string;
    cover: string;
    year: string;
    trackCount: number;
    category: "album";
}

export interface AudioTrack {
    id: number;
    title: string;
    slug: string;
    album: string;
    duration: string;
    category: "song" | "speech" | "recitation";
    featured: boolean;
    embedUrl: string; // YouTube embed URL
    lyrics?: string;
}

// Helper to convert English numbers to Bengali
export const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

// Helper to create slug from Bengali text
export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w\u0980-\u09FF-]+/g, '') // Keep Bengali chars, English chars, numbers, and hyphens
        .replace(/--+/g, '-');
};

export const categories = [
    { value: "all", label: "সবগুলো" },
    { value: "song", label: "গান" },
    { value: "speech", label: "বক্তব্য" },
    { value: "recitation", label: "আবৃত্তি" }
];

export const albums: Album[] = [
    {
        id: 1,
        title: "তোমার সৃষ্টি",
        slug: "tomar-srishti",
        artist: "সাইমুম শিল্পীগোষ্ঠী",
        cover: "https://picsum.photos/seed/album1/300/300",
        year: "২০০৫",
        trackCount: 12,
        category: "album"
    },
    {
        id: 2,
        title: "ইসলামী সংগীত সংকলন",
        slug: "islami-songit-sonkolon",
        artist: "সাইমুম শিল্পীগোষ্ঠী",
        cover: "https://picsum.photos/seed/album2/300/300",
        year: "২০০৬",
        trackCount: 10,
        category: "album"
    },
    {
        id: 3,
        title: "প্রভাতের আলো",
        slug: "provater-alo",
        artist: "সাইমুম শিল্পীগোষ্ঠী",
        cover: "https://picsum.photos/seed/album3/300/300",
        year: "২০০৪",
        trackCount: 8,
        category: "album"
    },
    {
        id: 4,
        title: "নতুন পৃথিবী",
        slug: "notun-prithibi",
        artist: "সাইমুম শিল্পীগোষ্ঠী",
        cover: "https://picsum.photos/seed/album4/300/300",
        year: "২০০৭",
        trackCount: 14,
        category: "album"
    }
];

export const audioTracks: AudioTrack[] = [
    {
        id: 1,
        title: "তোমার সৃষ্টি যদি হয় এতো সুন্দর",
        slug: "tomar-srishti-jodi-hoy-eto-sundor",
        album: "তোমার সৃষ্টি",
        duration: "৫:২৩",
        category: "song",
        featured: true,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder YouTube Video ID
        lyrics: `তোমার সৃষ্টি যদি হয় এতো সুন্দর
না জানি তাহলে তুমি কতো সুন্দর
তোমায় না দেখে ও আমার মন ভরে যায়
সেই অনুভবে দু'নয়ন ঝরে যায়

তোমার সৃষ্টি...`
    },
    {
        id: 2,
        title: "টিকটিকটিক গড়িয়ে যায়",
        slug: "tick-tick-tick-goriye-jay",
        album: "ইসলামী সংগীত সংকলন",
        duration: "৪:৪৫",
        category: "song",
        featured: true,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 3,
        title: "আম্মা বলেন ঘর ছেড়ে তুই",
        slug: "amma-bolen-ghor-chere-tui",
        album: "প্রভাতের আলো",
        duration: "৩:৫৮",
        category: "song",
        featured: true,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 4,
        title: "ইসলাম ও আধুনিক সমাজ - বক্তব্য",
        slug: "islam-o-adhunik-somaj",
        album: "বক্তব্য সংকলন",
        duration: "২৫:১০",
        category: "speech",
        featured: false,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 5,
        title: "সাহিত্য ও সংস্কৃতি - বক্তব্য",
        slug: "sahitya-o-sanskriti",
        album: "বক্তব্য সংকলন",
        duration: "৩২:১৫",
        category: "speech",
        featured: false,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 6,
        title: "কবিতা পাঠ - বাংলা একাডেমি",
        slug: "kobita-path-bangla-academy",
        album: "কবিতা পাঠ",
        duration: "১৮:২০",
        category: "recitation",
        featured: true,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 7,
        title: "প্রবন্ধ পাঠ - ইসলামী সাহিত্য",
        slug: "probondho-path",
        album: "প্রবন্ধ পাঠ",
        duration: "১৫:৪৫",
        category: "recitation",
        featured: false,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 8,
        title: "ও আমার চাঁদ",
        slug: "o-amar-chad",
        album: "নতুন পৃথিবী",
        duration: "৪:১২",
        category: "song",
        featured: false,
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];
