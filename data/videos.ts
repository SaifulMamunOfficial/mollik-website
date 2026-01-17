export interface Video {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    youtubeId: string;
    category: string;
    duration: string;
    views: number;
    year: string;
    featured: boolean;
    slug: string;
}

// Helper to convert English numbers to Bengali
export const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

// Helper to slugify Bengali text
export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w\u0980-\u09FF-]+/g, '') // Keep Bengali chars, English chars, numbers, and dashes
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export const videos: Video[] = [
    {
        id: 1,
        title: "তোমার সৃষ্টি যদি হয় এতো সুন্দর",
        description: "কবি মতিউর রহমান মল্লিকের বিখ্যাত হামদ - সাইমুম শিল্পীগোষ্ঠীর পরিবেশনায়",
        thumbnail: "https://picsum.photos/seed/video1/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "hamd",
        duration: "৫:২৩",
        views: 125000,
        year: "২০০৫",
        featured: true,
        slug: "tomar-srishti-jodi-hoy-eto-sundor"
    },
    {
        id: 2,
        title: "টিকটিকটিক গড়িয়ে যায়",
        description: "সময়ের মূল্য নিয়ে কবির অমর গান",
        thumbnail: "https://picsum.photos/seed/video2/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "islamic",
        duration: "৪:৪৫",
        views: 89000,
        year: "২০০৬",
        featured: true,
        slug: "tik-tik-tik-goriye-jay"
    },
    {
        id: 3,
        title: "কবি মতিউর রহমান মল্লিকের সাক্ষাৎকার",
        description: "বাংলাদেশ টেলিভিশনে কবির বিশেষ সাক্ষাৎকার",
        thumbnail: "https://picsum.photos/seed/video3/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "interview",
        duration: "২৫:১০",
        views: 45000,
        year: "২০০৮",
        featured: false,
        slug: "kobi-motiur-rahman-mallik-interview"
    },
    {
        id: 4,
        title: "সাইমুম শিল্পীগোষ্ঠীর সাংস্কৃতিক সন্ধ্যা",
        description: "জাতীয় জাদুঘরে আয়োজিত বার্ষিক অনুষ্ঠানের ভিডিও",
        thumbnail: "https://picsum.photos/seed/video4/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "event",
        duration: "১:০২:৩০",
        views: 32000,
        year: "২০০৭",
        featured: false,
        slug: "saimum-cultural-evening"
    },
    {
        id: 5,
        title: "আম্মা বলেন ঘর ছেড়ে তুই",
        description: "শিশুদের প্রিয় গান - শিক্ষার প্রতি অনুপ্রেরণামূলক",
        thumbnail: "https://picsum.photos/seed/video5/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "islamic",
        duration: "৩:৫৮",
        views: 210000,
        year: "২০০৪",
        featured: true,
        slug: "amma-bolen-ghor-chere-tui"
    },
    {
        id: 6,
        title: "কবিতা পাঠ - বাংলা একাডেমি",
        description: "বাংলা একাডেমিতে কবির কবিতা পাঠের দুর্লভ ভিডিও",
        thumbnail: "https://picsum.photos/seed/video6/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "recitation",
        duration: "১৮:২০",
        views: 28000,
        year: "২০০৯",
        featured: false,
        slug: "kobita-path-bangla-academy"
    },
    {
        id: 7,
        title: "স্মরণসভা ২০১১",
        description: "কবির প্রথম মৃত্যুবার্ষিকীতে আয়োজিত স্মরণসভা",
        thumbnail: "https://picsum.photos/seed/video7/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "memorial",
        duration: "৪৫:১০",
        views: 15000,
        year: "২০১১",
        featured: false,
        slug: "smaron-sova-2011"
    },
    {
        id: 8,
        title: "ইসলামী সংগীত সংকলন",
        description: "কবির জনপ্রিয় ইসলামী সংগীতের সংকলন",
        thumbnail: "https://picsum.photos/seed/video8/640/360",
        youtubeId: "dQw4w9WgXcQ",
        category: "islamic",
        duration: "৩২:১৫",
        views: 67000,
        year: "২০০৬",
        featured: false,
        slug: "islamic-song-collection"
    }
];

export const categories = [
    { value: "all", label: "সবগুলো" },
    { value: "hamd", label: "হামদ-নাত" },
    { value: "islamic", label: "ইসলামী সংগীত" },
    { value: "interview", label: "সাক্ষাৎকার" },
    { value: "event", label: "অনুষ্ঠান" },
    { value: "recitation", label: "কবিতা পাঠ" },
    { value: "memorial", label: "স্মরণসভা" }
];
