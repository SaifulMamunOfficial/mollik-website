import prisma from '@/lib/prisma'

// ============= Database Functions =============

export async function getPoemsFromDB() {
    const writings = await prisma.writing.findMany({
        where: {
            type: 'POEM',
            status: 'PUBLISHED'
        },
        include: {
            category: true,
            book: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return writings.map(w => ({
        id: w.id,
        slug: w.slug,
        title: w.title,
        type: 'কবিতা' as const,
        kind: 'poem' as const,
        content: w.content,
        excerpt: w.excerpt || undefined,
        bookSlug: w.book?.slug,
        readTime: w.readTime || undefined,
        category: w.category?.name,
        categoryId: w.category?.slug,
        year: w.year || undefined,
        views: w.views,
        likes: w.likes,
    }))
}

export async function getSongsFromDB() {
    const writings = await prisma.writing.findMany({
        where: {
            type: 'SONG',
            status: 'PUBLISHED'
        },
        include: {
            category: true,
            book: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return writings.map(w => ({
        id: w.id,
        slug: w.slug,
        title: w.title,
        type: w.category?.name || 'গান',
        kind: 'song' as const,
        content: w.content,
        excerpt: w.excerpt || undefined,
        bookSlug: w.book?.slug,
        readTime: w.readTime || undefined,
        category: w.category?.name,
        categoryId: w.category?.slug,
        year: w.year || undefined,
        views: w.views,
        likes: w.likes,
        composer: w.composer || undefined,
    }))
}

export async function getWritingBySlugFromDB(slug: string) {
    const writing = await prisma.writing.findUnique({
        where: { slug },
        include: {
            category: true,
            book: true
        }
    })

    if (!writing) return null

    return {
        id: writing.id,
        slug: writing.slug,
        title: writing.title,
        type: writing.category?.name || writing.type,
        kind: writing.type.toLowerCase() as 'poem' | 'song' | 'essay' | 'other',
        content: writing.content,
        excerpt: writing.excerpt || undefined,
        bookSlug: writing.book?.slug,
        readTime: writing.readTime || undefined,
        category: writing.category?.name,
        categoryId: writing.category?.slug,
        year: writing.year || undefined,
        views: writing.views,
        likes: writing.likes,
        composer: writing.composer || undefined,
    }
}

export async function getBooksFromDB() {
    const books = await prisma.book.findMany({
        include: {
            _count: {
                select: { writings: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return books.map(b => ({
        id: parseInt(b.id.slice(-4), 16) || 1, // Convert cuid to number for compatibility
        slug: b.slug,
        title: b.title,
        subtitle: b.subtitle || undefined,
        description: b.description || '',
        year: b.year || '',
        publisher: b.publisher || '',
        category: b.categoryId,
        categoryId: b.categoryId,
        coverImage: b.coverImage || undefined,
        totalWritings: b._count.writings,
    }))
}

export async function getBookBySlugFromDB(slug: string) {
    const book = await prisma.book.findUnique({
        where: { slug },
        include: {
            _count: {
                select: { writings: true }
            }
        }
    })

    if (!book) return null

    return {
        id: parseInt(book.id.slice(-4), 16) || 1,
        slug: book.slug,
        title: book.title,
        subtitle: book.subtitle || undefined,
        description: book.description || '',
        year: book.year || '',
        publisher: book.publisher || '',
        category: book.categoryId,
        categoryId: book.categoryId,
        coverImage: book.coverImage || undefined,
        totalWritings: book._count.writings,
    }
}

export async function getWritingsByBookSlugFromDB(slug: string) {
    const book = await prisma.book.findUnique({
        where: { slug },
        select: { id: true }
    })

    if (!book) return []

    const writings = await prisma.writing.findMany({
        where: {
            bookId: book.id,
            status: 'PUBLISHED'
        },
        orderBy: { createdAt: 'asc' } // Usually book chapters/writings are ordered
    })

    return writings.map(w => ({
        id: w.id,
        slug: w.slug,
        title: w.title,
        type: w.type === 'POEM' ? 'কবিতা' : w.type === 'SONG' ? 'গান' : 'প্রবন্ধ',
        kind: w.type.toLowerCase() as 'poem' | 'song' | 'essay',
        content: w.content,
        excerpt: w.excerpt || undefined,
        readTime: w.readTime || undefined,
        views: w.views,
        year: w.year || undefined
    }))
}

export async function getBlogPostsFromDB() {
    const posts = await prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        include: {
            author: true,
            category: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return posts.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage || '',
        author: {
            id: p.author.id,
            name: p.author.name || 'Anonymous',
            avatar: p.author.image || undefined,
            role: p.author.role.toLowerCase() as 'admin' | 'user',
            bio: p.author.bio || undefined
        },
        publishedAt: p.publishedAt?.toISOString() || p.createdAt.toISOString(),
        status: p.status.toLowerCase() as 'published' | 'pending' | 'draft',
        category: p.category?.name || 'General',
        tags: p.tags,
        readTime: p.readTime || '5 মিনিট',
        featured: p.featured,
        views: p.views
    }))
}

export async function getEssaysFromDB() {
    const writings = await prisma.writing.findMany({
        where: {
            type: 'ESSAY',
            status: 'PUBLISHED'
        },
        include: {
            category: true,
            book: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return writings.map(w => ({
        id: w.id,
        slug: w.slug,
        title: w.title,
        type: 'প্রবন্ধ' as const,
        kind: 'essay' as const,
        content: w.content,
        excerpt: w.excerpt || undefined,
        bookSlug: w.book?.slug,
        readTime: w.readTime || undefined,
        category: w.category?.name,
        categoryId: w.category?.slug,
        year: w.year || undefined,
        views: w.views,
        likes: w.likes,
    }))
}

export async function getTributesFromDB() {
    const tributes = await prisma.tribute.findMany({
        where: { status: 'PUBLISHED' },
        include: {
            author: {
                select: { id: true, name: true, email: true, image: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return tributes.map(t => ({
        id: t.id,
        content: t.content,
        district: t.district || null,
        author: t.author, // Return full author object for Admin
        displayName: t.name || t.author.name || t.author.email, // For Public display
        designation: t.designation || undefined,
        displayOption: t.displayOption || 'DISTRICT',
        manualDate: t.manualDate ? t.manualDate.toISOString() : null,
        isFeatured: t.isFeatured,
        authorImage: t.author.image || undefined,
        date: (t.manualDate || t.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: t.createdAt.toISOString()
    }))
}

export async function getGalleryFromDB() {
    const images = await prisma.galleryImage.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' }
    })

    return images.map((img, index) => ({
        id: index + 1,
        src: img.url,
        alt: img.title || 'কবি মতিউর রহমান মল্লিক',
        title: img.title || undefined,
        category: 'portrait',
        year: img.year || undefined,
        location: img.location || undefined,
        description: img.description || undefined,
        featured: img.featured,
        aspectRatio: 'portrait' as const
    }))
}

export async function getAudioFromDB() {
    const audioList = await prisma.audio.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' }
    })

    return audioList.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        artist: a.artist || 'মতিউর রহমান মল্লিক',
        album: a.album || undefined,
        duration: a.duration || '4:00',
        audioUrl: a.audioUrl,
        coverImage: a.coverImage || '/images/audio-cover.jpg',
        views: a.views,
        category: 'hamd'
    }))
}

export async function getVideosFromDB() {
    const videoList = await prisma.video.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' }
    })

    return videoList.map(v => ({
        id: v.id,
        title: v.title,
        slug: v.slug,
        description: v.description || undefined,
        youtubeId: v.youtubeId,
        thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`,
        duration: v.duration || '5:00',
        views: v.views,
        category: v.category || 'gojol',
        featured: v.featured,
        publishedAt: v.createdAt.toISOString()
    }))
}


export async function getBiographyFromDB() {
    const settings = await prisma.siteSettings.findUnique({
        where: { id: "main" }
    });

    // Default static data structure if DB is empty or fields missing
    const defaultTimeline = [
        { year: "১৯৫৪", title: "জন্ম", desc: "১ মার্চ, বাগেরহাটের বারুইপাড়ায়।" },
        { year: "১৯৬৮", title: "সবুজ কাঁচার আসর", desc: "প্রথম শিশু সংগঠন প্রতিষ্ঠা।" },
        { year: "১৯৭৬", title: "এইচএসসি পাস", desc: "বাগেরহাট পিসি কলেজ থেকে।" },
        { year: "১৯৭৮", title: "সাইমুম প্রতিষ্ঠা", desc: "ঢাকায় সাইমুম শিল্পীগোষ্ঠী গড়ে তোলেন।" },
        { year: "১৯৮৫", title: "বিবাহ", desc: "কথাশিল্পী সাবিনা মল্লিকের সাথে বিবাহ।" },
        { year: "১৯৯৮", title: "নির্বাহী পরিচালক", desc: "বাংলাদেশ সংস্কৃতিকেন্দ্রের দায়িত্ব গ্রহণ।" },
        { year: "২০০২", title: "প্যারিস সাহিত্য পুরস্কার", desc: "ফ্রান্স থেকে সম্মাননা।" },
        { year: "২০১০", title: "মহাপ্রয়াণ", desc: "১২ আগস্ট, ঢাকায় ইন্তেকাল।" }
    ];

    const defaultOrganizations = [
        {
            name: "সাইমুম শিল্পীগোষ্ঠী",
            description: "১৯৭৮ সালে প্রতিষ্ঠিত। বাংলাদেশে বাদ্যবিহীন ইসলামী গানের নবযাত্রার সূচনাকারী। এ দেশের মুসলমানের কাছে এ গান ব্যাপকভাবে সমাদৃত হয়ে উঠে এবং কালক্রমে ইসলামী গানের বিশাল ভাণ্ডার গড়ে তোলে।",
            icon: "Music"
        },
        {
            name: "বাংলাদেশ সংস্কৃতি কেন্দ্র",
            description: "১৯৯৮-২০১০ সাল পর্যন্ত নির্বাহী পরিচালক হিসেবে দায়িত্ব পালন করেন। দেশীয় সংস্কৃতির বিকাশ সাধনে তাঁর হাত ধরে দেশে-বিদেশে অসংখ্য সাহিত্য সংস্কৃতি কেন্দ্র গড়ে ওঠে।",
            icon: "Users"
        },
        {
            name: "বিপরীত উচ্চারণ",
            description: "দীর্ঘদিন এই ঐতিহ্যবাহী সাহিত্য সংগঠনের সভাপতির দায়িত্ব পালন করেন এবং সাহিত্য সংকলন সম্পাদনা করেন।",
            icon: "BookOpen"
        },
        {
            name: "ঐতিহ্য সংসদ",
            description: "এই সংগঠনের প্রতিষ্ঠাতা পরিচালক হিসেবে সাহিত্য-সাংস্কৃতিক কর্মকাণ্ডকে বেগবান করেন।",
            icon: "Users"
        }
    ];

    const defaultQuotes = [
        "মানুষ তো মরে না, শুধু দেহ ত্যাগ করে। কর্মের মাঝেই মানুষ বেঁচে থাকে অনন্তকাল।",
        "কবিতা হলো হৃদয়ের রক্তক্ষরণ, যা শব্দে শব্দে গেঁথে দিতে হয় অমরত্বের মালা।",
        "যে জাতি তার সংস্কৃতিকে ধরে রাখতে পারে না, সে জাতি তার অস্তিত্বকেও টিকিয়ে রাখতে পারে না।",
        "সত্যের পথে চলাই হলো সবচেয়ে বড় বিপ্লব।"
    ];

    const defaultAwards = [
        "জাতীয় সাহিত্য পরিষদ স্বর্ণপদক",
        "কলমসেনা সাহিত্য পুরস্কার",
        "প্যারিস সাহিত্য পুরস্কার (ফ্রান্স)",
        "বায়তুশ শরফ সাহিত্য পুরস্কার",
        "কিশোরকণ্ঠ সাহিত্য পুরস্কার",
        "বাংলা সাহিত্য পরিষদ পুরস্কার",
        "সাহিত্য-সংস্কৃতি পরিষদ সাহিত্য পদক",
        "ইসলামী সমাজ কল্যাণ পরিষদ সংস্কৃতি পুরস্কার"
    ];

    const defaultLiteraryWorks = {
        poetry: [
            "আবর্তিত তৃণলতা",
            "অনবরত বৃক্ষের গান",
            "তোমার ভাষায় তীক্ষ্ণ ছোরা",
            "চিত্রল প্রজাপতি",
            "নিষণ্ণ পাখির নীড়ে"
        ],
        songs: [
            "ঝংকার (১৯৭৮)",
            "যত গান গেয়েছি",
            "প্রাণের ভেতরে প্রাণ"
        ],
        others: [
            "পাহাড়ি এক লড়াকু (অনূদিত উপন্যাস)",
            "রঙিন মেঘের পালকি (ছড়ার বই)",
            "নির্বাচিত প্রবন্ধ",
            "প্রতীতি-১ (গানের অ্যালবাম)",
            "প্রতীতি-২ (গানের অ্যালবাম)"
        ]
    };

    if (!settings) return {
        heroTitle: "মতিউর রহমান মল্লিক",
        heroDescription: "বাংলাদেশের ইসলামী সাহিত্য ও সাংস্কৃতিক অঙ্গনের এক উজ্জ্বল নক্ষত্র। ঐতিহ্যের ধারায় সাহিত্য-সংস্কৃতি চর্চার নতুন প্ল্যাটফর্মের নির্মাতা। শিল্প-সাহিত্য-সংস্কৃতির অঙ্গনে বিশেষত কবিতা ও গানের ক্ষেত্রে তিনি জাতীয় কবি কাজী নজরুল ইসলাম এবং জাগরণের কবি ফররুখ আহমদের ধারাকে আরো বেগবান এবং পরিপুষ্ট করে গেছেন।",
        bornDate: "১ মার্চ ১৯৫৪",
        bornPlace: "বারুইপাড়া, ফকিরহাট, বাগেরহাট",
        deathDate: "১২ আগস্ট ২০১০",
        occupation: "কবি, গীতিকার, সুরকার, সংগঠক, সম্পাদক",

        // শিল্পময় জীবন - Introduction
        introduction: `<p>মতিউর রহমান মল্লিক বাংলাদেশের ইসলামী সাহিত্য ও সাংস্কৃতিক অঙ্গনের এক উজ্জ্বল নক্ষত্র। ঐতিহ্যের ধারায় সাহিত্য-সংস্কৃতি চর্চার নতুন প্ল্যাটফর্মের নির্মাতা। শিল্প-সাহিত্য-সংস্কৃতির অঙ্গনে বিশেষত কবিতা ও গানের ক্ষেত্রে তিনি জাতীয় কবি কাজী নজরুল ইসলাম এবং জাগরণের কবি ফররুখ আহমদের ধারাকে আরো বেগবান এবং পরিপুষ্ট করে গেছেন।</p>
<p>তিনি সাংগঠনিক ও প্রাতিষ্ঠানিক ক্ষেত্রেও রেখে গেছেন অমূল্য অবদান। একাধারে কবি, প্রাবন্ধিক, গীতিকার, সুরকার, সংস্কৃতিচিন্তক, সংগঠক, সম্পাদক এবং সাংস্কৃতিক আন্দোলনের অগ্রসেনানী কবি মতিউর রহমান মল্লিকের চিন্তা ও কর্ম এখন কালের সাক্ষী হিসেবে বিশ্বাসী হৃদয়ে স্থান করে নিয়েছে।</p>`,

        // জন্ম ও বেড়ে ওঠা
        earlyLife: `<p>কবি মতিউর রহমান মল্লিক ১৯৫৪ সালের ১ মার্চ বাগেরহাট জেলার ফকিরহাটের বারুইপাড়া গ্রামের এক ঐতিহ্যবাহী সাংস্কৃতিক পরিবারে জন্মগ্রহণ করেন। হযরত খানজাহান আলী (র.) এর স্মৃতিবিজড়িত ষাট গম্বুজ মসজিদ থেকে অনতিদূরে অবস্থিত এ গ্রামটি।</p>
<p>তিনি মরহুম মুন্সি কায়েম উদ্দিন মল্লিক ও আছিয়া খাতুন এর সর্বকনিষ্ঠ সন্তান। চৌদ্দ ভাই-বোনের মধ্যে মল্লিক ছিলেন সবার ছোট। পিতা ছিলেন পালাগানের রচয়িতা ও গায়ক। বড় ভাই আহমদ আলী মল্লিক এলাকায় কবি হিসাবেই পরিচিত। তিনি অত্যন্ত ছন্দ সচেতন কবি। ইতোমধ্যে বিশুদ্ধ উচ্চারণ, ছন্দ ও শব্দখেলার অভিজ্ঞতা অর্জন করেছেন।</p>
<p>সাথে সাথে মায়ের ছড়াকাটা, অন্ত্যমিল দিয়ে কথা বলা এবং বাপ-চাচাদের জারীগান তাঁকে সংস্কৃতিচর্চার প্রতি আকৃষ্ট করে তুলেছে। আসলে তাঁর জন্মই হয়েছিল এক সৃজনশীল সাহিত্যিক পরিবারে। পারিবারিক ঐতিহ্যসূত্রেই পেয়েছিলেন লেখার প্রতিভা। পরিবারে ছিল ইসলামী পরিবেশ। ইসলাম ও সৃজনশীলতা দুটোকে নিয়েই তাঁর জীবন, তাঁর সৃজন ভুবন।</p>`,

        // শৈশব ও শিক্ষাজীবন
        education: `<p>আর দশ জনের মতই পারিবারিক পরিবেশে তাঁর লেখাপড়ার শুভ সূচনা ঘটে। এরপর যান পাড়ার মক্তবে। মক্তবের পড়া শেষ হলে পিতা তাঁকে ভর্তি করে দেন বাড়ুইপাড়া মাদরাসায়। তারপর তিনি যশোরের লাউড়ি মাদরাসা ও খুলনা আলিয়ায় পড়া লেখা করেন। মেধাবী ছাত্র হিসাবে তিনি ছিলেন শিক্ষকদের প্রিয়ভাজন, সকলের প্রিয়। তিনি কৃতিত্বের সাথে পাস করেন দাখিল, আলিম ও ফাজিল। এভাবেই তিনি ইসলামী জ্ঞানে পারদর্শী হয়ে ওঠেন। তরুণ আলেম হিসেবে এলাকায় পরিচিতি পান।</p>
<p>ফাজিল পাস করার পর তিনি জেনারেল এডুকেশনের দিকে মন দেন। ভর্তি হন বাগেরহাট সরকারী পি. সি. কলেজ (প্রফুল্লচন্দ্র মহাবিদ্যালয়)। ১৯৭৬ সালে এখান থেকেই মানবিক শাখায় এইচ এস সি (উচ্চ মাধ্যমিক সার্টিফিকেট পরীক্ষা) পাস করেন।</p>
<p>লেখাপড়ার পাশাপাশি খেলাধুলার প্রতিও তাঁর ঝোঁক ছিল প্রচুর। শৈশব কাটে তাঁর উদার প্রকৃতির কোলে। সেখান থেকেই তিনি নেন উদারতার সবক। শুনে শুনে গান কণ্ঠে তুলে নেয়ার অভ্যাসও শৈশবেই রপ্ত করেন তিনি। তারপর শুরু হয় মুখে মুখে গান বানানো। বন্ধুদের সে গান শোনানো। বন্ধুরা চমৎকৃত হন। এভাবে স্কুলে থাকতেই লেখার জগতে প্রবেশ করেন তিনি।</p>
<p>ছোটবেলায়ই তাঁর পিতা মারা যান। বড় ভাই আহামদ আলী মল্লিক নেন তাঁর অভিভাবকত্বের দায়িত্ব। শিক্ষক মানুষ, একটু কড়া মেজাজি। কবি হওয়ার উন্মাদনায় লেখাপড়ায় ঘাটতি দেখা দিলে স্বাভাবিকভাবেই ক্ষেপে যান তিনি। শাসনের নিগড়ে বন্দী হন কবি। কচি কবি মন মানে না শাসন, মানে না বারণ। দুই ভাইয়ে শুরু হয় স্নায়ুযুদ্ধ। ভাবী এসে পাশে দাঁড়ান কবির। স্নেহ-মমতায় সারিয়ে তুলতে চান কচি মনের ক্ষত।</p>
<p>স্কুলে থাকতেই ইসলামী আন্দোলনের দাওয়াত পান। এ আন্দোলন তাঁর মনে জাগিয়ে তোলে নতুন সাড়া, নতুন স্বপ্ন। তিনি গান লেখেন আন্দোলনের জন্য, ইসলামের বিজয়ের জন্য। দেহ-মন-প্রাণ সবটা জুড়েই আন্দোলন, সবটা জুড়েই গান। এ গানের শ্রোতা এখন আর কেবল বন্ধুরা নয়, নানা অনুষ্ঠান আয়োজনে ডাক পড়ে গান গাওয়ার। গ্রামের সীমানা ছেড়ে তাঁর নাম ছড়িয়ে পড়ে মহকুমায়, জেলায়।</p>
<p>একসময় বাগেরহাট জেলা ছাত্র আন্দোলনের দায়িত্ব আসে তাঁর ওপর। এ সময় কেন্দ্রীয় সভাপতি মীর কাসেম আলী যান বাগেরহাট সফরে। মতিউর রহমান মল্লিকের নতুন ধারার গান শুনে আপ্লুত হন তিনি। বুঝতে পারেন, এ রত্ন গ্রামে পড়ে থাকার জন্য সৃষ্টি হয়নি। তিনি তাঁকে ঢাকায় নিয়ে আসেন। মল্লিকের চোখে ভাসে নতুন আশার স্বপন। সৃষ্টিতে আসে উদ্দাম গতিবেগ।</p>
<p>তারপর আন্দোলনের প্রয়োজনে তাঁকে ঢাকায় চলে আসতে হয়। লেখালেখির কথা বিবেচনা করেই ভর্তি হন বাংলা অনার্সে, জগন্নাথ বিশ্ববিদ্যালয়ে। তিনি নাট্যকার মমতাজ উদ্দিন আহমদ, প্রখ্যাত কথাশিল্পী শওকত আলী, কবি আবুবকর সিদ্দিক ও কবি আবদুল মান্নান সৈয়দকে শিক্ষক হিসেবে পেয়েছিলেন। এদের মধ্যে কবি ও গবেষক আবদুল মান্নান সৈয়দের খুবই প্রিয়পাত্র হয়ে উঠেছিলেন কবি মতিউর রহমান মল্লিক। কিন্তু তিনি আন্দোলন ও গানে এতোটাই মেতে ওঠেন যে, অনার্স পরীক্ষা দেয়ার অবসর আর তাঁর হয়ে ওঠেনি।</p>`,

        // সাহিত্যচর্চা ও সংগঠন
        literaryCulture: `<p>কবি মতিউর রহমান মল্লিক শৈশবকাল থেকেই সাহিত্যচর্চা করে আসছেন। সাহিত্যচর্চাকে বেগবান করার জন্যই তিনি বিভিন্ন সামাজিক-সাংস্কৃতিক সংগঠন ও সংস্থা প্রতিষ্ঠা করেন। শৈশব থেকেই বিভিন্ন ধরনের সংগঠন গড়ে তুলেছেন।</p>
<p>১৯৬৮ সালে বাগেরহাটের বারুইপাড়ায় "সবুজ কাঁচার আসর' নামে একটি শিশু সংগঠন গড়ে তোলার ভেতর দিয়ে তাঁর সাংগঠনিক জীবনের যাত্রা শুরু। বারুইপাড়া স্পোর্টিং ক্লাব, সবুজ মিতালী সংঘ এবং আল-আমিন যুব সংঘ প্রতিষ্ঠার পেছনে অগ্রণী ভূমিকা ছিল তাঁরই। সেই শৈশবেই তিনি দুঃসাহসী নামে একটি হাতে লেখা পত্রিকা প্রকাশের ঝুঁকি নিয়েছিলেন।</p>
<p>ঢাকায় এসে তিনি ১৯৭৮ সালে সমমনা সংস্কৃতিকর্মীদের নিয়ে গড়ে তোলেন ঐতিহ্যবাহী সাংস্কৃতিক সংগঠন সাইমুম শিল্পীগোষ্ঠী। সাইমুম শিল্পীগোষ্ঠী প্রতিষ্ঠার পর একাধারে দুই বছর সভাপতির দায়িত্ব পালন করেন কবি মতিউর রহমান মল্লিক। সাইমুম এ দেশে বাদ্যবিহীন ইসলামী গানের নবযাত্রার সূচনা করে। অল্প সময়ের ব্যবধানে এ দেশের মুসলমানের কাছে এ গান ব্যাপকভাবে সমাদৃত হয়ে ওঠে এবং কালক্রমে ইসলামী গানের বিশাল ভাণ্ডার গড়ে তোলে সাইমুম শিল্পীগোষ্ঠী।</p>
<p>তারপর একে একে তাঁর অনুপ্রেরণায় বাংলাদেশের শহর, নগর, গ্রাম-গঞ্জ, স্কুল, কলেজ, মাদরাসা, ও বিশ্ববিদ্যালয়ে গড়ে ওঠে একই ধারার অসংখ্য সাংস্কৃতিক সংগঠন। শুধু তাই নয়, পশ্চিমবঙ্গ, আসামসহ বিশ্বের যেখানেই বাংলা ভাষাভাষী মুসলমান রয়েছে সেখানেই গড়ে উঠেছে একই ধারার বহু সাংস্কৃতিক সংগঠন।</p>
<p>এ ছাড়াও তিনি দীর্ঘদিন ঐতিহ্যবাহী সাহিত্য সংগঠন বিপরীত উচ্চারণের সভাপতির দায়িত্ব পালন করেন। "বিপরীত উচ্চারণ" সাহিত্য সংকলনও সম্পাদনা করেছেন তিনি। সেই সাথে ঐতিহ্য সংসদের প্রতিষ্ঠাতা পরিচালক, কবিতা বাংলাদেশ'র প্রতিষ্ঠাতা সদস্য সচিব, জাতীয় সাংস্কৃতিক পরিষদের প্রতিষ্ঠাতা সদস্য সচিবসহ বিভিন্ন সংগঠন প্রতিষ্ঠার মধ্য দিয়ে সাহিত্য-সাংস্কৃতিক কর্মকাণ্ডকে বেগবান করেছেন।</p>`,

        // সংসার ও কর্মজীবন
        familyLife: `<p>কবি মতিউর রহমান মল্লিক ১৯৮৫ সালের ১৫ ফেব্রুয়ারি বিয়ে করেন কথাশিল্পী সাবিনা মল্লিককে (সাবিনা ইয়াসমিন)। সাবিনা মল্লিক একজন কবি, সম্পাদক, ও ব্যাংকার। সমাজ বিজ্ঞানে মাস্টার্স করা এ মানুষটি এসএসসি পাশ করেই এসেছিলেন কবি মল্লিকের জীবন সঙ্গিনী হিসেবে। ছন্নছাড়া মল্লিকের সংস্পর্শে থেকে পুরো সংসারধর্ম সূচারুরূপে পালন করে তিনি অর্জন করেছেন বি.এ অনার্সসহ এমএসএস ডিগ্রী। মতিউর রহমান মল্লিকের ছন্নছাড়া জীবনেও তিনি এনে দিয়েছিলেন প্রশান্তি। তাঁদের ঘর আলো করে দুই মেয়ে জুম্মি নাহদিয়া ও নাজমী নাতিয়া এবং একমাত্র পুত্রসন্তান হাসসান মুনহামান্না।</p>`,

        // কর্মজীবন
        career: `<p>কর্মজীবনে কবি মতিউর রহমান মল্লিক বিভিন্ন সময় বিভিন্ন কর্মে নিয়োজিত ছিলেন। নারায়ণগঞ্জ আদর্শ স্কুলে গানের শিক্ষক হিসেবে কর্মজীবন শুরু করলেও বিভিন্ন পেশার সাথে জড়িত ছিলেন তিনি। তাঁর হাতেই দীর্ঘ একযুগ ধরে সম্পাদিত হয়েছে মাসিক সাহিত্য পত্রিকা 'কলম'।</p>
<p>তিনি ১৯৮৩-১৯৮৫ সাল পর্যন্ত 'সাপ্তাহিক সোনার বাংলা'র সাহিত্য সম্পাদক হিসেবে দায়িত্ব পালন করেন। তিনি ১৯৮৫-১৯৯৬ সাল পর্যন্ত বাংলাদেশ ইসলামিক সেন্টার এর মাসিক কলম সাহিত্য পত্রিকার সহকারী সম্পাদক, ভারপ্রাপ্ত সম্পাদক এবং নতুন কলম সাহিত্য সংকলনের সম্পাদক ছিলেন। ১৯৯৬-১৯৯৮ সাল পর্যন্ত ইবনে সিনা ট্রাস্টের সমন্বয় কর্মকর্তা হিসেবে দায়িত্ব পালন করেন। সর্বশেষে তিনি বাংলাদেশ সংস্কৃতিকেন্দ্রের নির্বাহী পরিচালক হিসেবে ১৯৯৮-২০১০ সাল পর্যন্ত দায়িত্ব পালন করেন। দেশীয় সংস্কৃতির বিকাশ সাধনে তাঁর হাত ধরে দেশে-বিদেশে এরই মধ্যে গড়ে উঠেছে অসংখ্য সাহিত্য সংস্কৃতি কেন্দ্র।</p>`,

        // অন্যান্য দায়িত্ব
        otherResponsibilities: `<p>সংগঠক হিসেবে মতিউর রহমান মল্লিক যেমন সফল তেমনি প্রাতিষ্ঠানিক দায়িত্ব পালনেও অত্যন্ত সুনাম অর্জন করেছেন। জীবনের শেষ দিন পর্যন্ত তিনি বিভিন্ন দায়িত্ব পালন করে গেছেন।</p>
<p>'নতুন কলম'র উপদেষ্টা সম্পাদক, 'কারেন্ট নিউজ'র উপদেষ্টা, ত্রৈমাসিক সাহিত্য পত্রিকা 'প্রেক্ষণ, আত্তাহযীব ইন্টারন্যাশনাল ক্যাডেট মাদরাসা-ঢাকা'র উপদেষ্টা, উপদেষ্টা পরিচালকের দায়িত্ব পালন করেন সাইমুম শিল্পীগোষ্ঠী-ঢাকা, ঐতিহ্য সংসদের। সভাপতির দায়িত্ব পালন করেন বাগেরহাট ফোরামের।</p>
<p>চেয়ারম্যান "সাউতুল মাদীনা ক্যাডেট মাদরাসা, প্রতিষ্ঠাতা সাধারণ সম্পাদক- সবুজ মিতালী সংঘ, বারুইপাড়া-বাগেরহাট, নির্বাহী সদস্য- বাংলা সাহিত্য পরিষদ; সদস্য বাংলাদেশ মসজিদ মিশন, আজীবন সদস্য কেন্দ্রীয় মুসলিম সাহিত্য পরিষদ সিলেট, তত্ত্বাবধায়ক বিপরীত উচ্চারণ সাহিত্য সংস্কৃতি সংসদ প্রভৃতি।</p>`,

        // সৃজন
        creativeWorks: `<p>আপাদমস্তক কবি এবং সংস্কৃতিচিন্তক হিসেবে মতিউর রহমান মল্লিকের কর্মপরিধি থাকলেও প্রকাশনার ক্ষেত্রে বেশ খানিকটা পিছিয়ে ছিলেন তিনি। ১৯৭৮ সালে প্রথম গীতিকবিতা সংকলন 'ঝংকার' প্রকাশিত হয়।</p>
<p>তারপর একে একে প্রকাশ পায় তাঁর কাব্যগ্রন্থ- আবর্তিত তৃণলতা, অনবরত বৃক্ষের গান, তোমার ভাষায় তীক্ষ্ণ ছোরা, চিত্রল প্রজাপতি ও নিষণ্ণ পাখির নীড়ে। গানের বই- যত গান গেয়েছি, প্রাণের ভেতরে প্রাণ, অনূদিত উপন্যাস- পাহাড়ি এক লড়াকু, ছোটদের ছড়ার বই- রঙিন মেঘের পালকি, প্রবন্ধের বই- নির্বাচিত প্রবন্ধ ইত্যাদি।</p>
<p>আশির দশকে প্রকাশ পায় তাঁর কথা, সুর ও স্বকণ্ঠে পরিবেশিত গানের ক্যাসেট প্রতীতি এক ও দুই। ইসলামী গানের শ্রোতাদের নিকট অ্যালবাম দুটি এখনও সমান জনপ্রিয়। অনুবাদক হিসেবেও তাঁর সফলতা ঈর্ষণীয়। পাহাড়ি এক লড়াকু ও মহানায়ক তাঁর অনূদিত উপন্যাস। হযরত আলী (রা.) ও আল্লামা ইকবালের মতো বিশ্বখ্যাত মুসলিম কবিদের কবিতাও অনুবাদ করেছেন তিনি।</p>
<p><strong>অগ্রন্থিত পাণ্ডুলিপি:</strong> কবিতার বই-আরেক আকাশ, কবিতার মজনু, নন্দিত নদী, কোকিল জ্যোতি, ছড়ার বই- নতুন চাঁদের আলো, আসলো একুশ আসবে একুশ, মুন্ডার পান্ডা, ঘোর কাটুক, লাল ফিতা, ভেজাল সমাচার, পঙ্গপাল গীতিকা। গানের বই-চিরকালের গান, গানের খাতা, হৃদয়ে হৃদয় রাখি, শপথের শ্বেত পতাকা, অশেষ সম্ভাবনার কুসুম, ধৈর্যের গান, মোদের যাত্রা আল্লাহর পানে, সূর্য ওঠার আগে। গল্পের বই- এক পেয়ালা অশ্রু, গল্প দাদুর আসর।</p>
<p><strong>প্রবন্ধের বই:</strong> মহানবী (সা.) ও মানবতাবাদ, কুরআন ও হাদীসের আলোকে কবি ও কবিতা, ইসলামী সাংস্কৃতিক আন্দোলনের রূপরেখা, সংস্কৃতি, উলুঘ খানজাহান ও তাঁর খলিফাতাবাদ, প্রিন্সিপাল ইবরাহীম খাঁ: এক সর্বস্পর্শী প্রেরণা, ঘ্রাণ ও গৌরব, বাংলা সন: আমাদের ঐতিহ্য। সাক্ষাৎকার: মতিউর রহমান মল্লিকের সাক্ষাৎকার। স্মৃতিকথা: স্মৃতির মানিক। এছাড়া রয়েছে অভিভাষণ, ফ্ল্যাপ, গ্রন্থালোচনা, চিঠি ইত্যাদি।</p>`,

        // দর্শন ও সাহিত্যভাবনা
        philosophy: `<p>শিল্প-সাহিত্য-সংস্কৃতির অঙ্গনে বিশেষত কবিতা ও গানের ক্ষেত্রে তিনি জাতীয় কবি কাজী নজরুল ইসলাম এবং জাগরণের কবি ফররুখ আহমদের ধারাকে আরো বেগবান এবং পরিপুষ্ট করে গেছেন।</p>
<p>একাধারে কবি, প্রাবন্ধিক, গীতিকার, সুরকার, সংস্কৃতিচিন্তক, সংগঠক, সম্পাদক এবং সাংস্কৃতিক আন্দোলনের অগ্রসেনানী কবি মতিউর রহমান মল্লিকের চিন্তা ও কর্ম এখন কালের সাক্ষী হিসেবে বিশ্বাসী হৃদয়ে স্থান করে নিয়েছে।</p>
<p>তাঁর স্ব-কণ্ঠে ধারণকৃত অ্যালবাম প্রতীতি-১ এবং প্রতীতি-২ এখনো বিশ্বাসী হৃদয়ে ঝড় তোলে। খ্যাতিমান শিল্পী খালিদ হোসেনসহ জাতীয় পর্যায়ের দেশ সেরা শিল্পীর কণ্ঠে উঠে এসেছে তাঁর গান। সেই সাথে তাঁর অনেক কবিতা ইংরেজি, আরবি ও উর্দুভাষায় অনূদিত হয়েছে। বাংলাদেশ টেলিভিশনে জীবনের আলো অনুষ্ঠানে আলোচনা রেখে এবং দিগন্ত টেলিভিশনের অনুষ্ঠান প্রিভিউ কমিটির সদস্য হিসেবে সুনাম অর্জন করেছেন তিনি।</p>`,

        // ভ্রমণ
        travels: `<p>কবি মতিউর রহমান মল্লিক সাহিত্য সংস্কৃতিকে বিশ্বব্যাপী ছড়িয়ে দেয়ার লক্ষ্যে বিভিন্ন দেশে ভ্রমণ করেছেন।</p>
<p>তিনি ইয়ং মুসলিম অর্গানাইজেশন ইউরোপ এর আমন্ত্রণে ১৯৮৫ সালে বৃটেন ভ্রমণ করেন। স্টুডেন্টস ইসলামিক মুভমেন্ট অফ ইন্ডিয়া- এর বার্ষিক সম্মেলন ১৯৯২ সালে এবং ইকবাল পরিষদ- আয়োজিত সেমিনারে ২০০০ ও ২০০১ সালে ভারত ভ্রমণ করেন।</p>
<p>বাংলা সাহিত্য ও সংস্কৃতি পরিষদ- ফ্রান্স এর আমন্ত্রণে ২০০২ সালে ফ্রান্স ভ্রমণ করেন এবং রিয়াদ সংস্কৃতিকেন্দ্রের আমন্ত্রণে হজ্জ করতে এবং সাংস্কৃতিক কার্যক্রমকে গতিশীল করতে ২০০৩ সালে সৌদি আরব ভ্রমণ করেন।</p>`,

        // ইন্তেকাল
        deathSection: `<p>বিশিষ্ট কবি, গীতিকার, সুরকার, শিল্পী, সাহিত্যিক, সম্পাদক ও সাংস্কৃতিক সংগঠক কবি মতিউর রহমান মল্লিক ২০১০ সালে ১২ আগস্ট, ১ রমজান, বুধবার দিবাগত রাত ১২.৪৫ মিনিটে রাজধানীর স্কয়ার হাসপাতালে ইন্তেকাল করেন।</p>
<p>কবি দীর্ঘ প্রায় দুই বছর ধরে কিডনীসহ নানা জটিল রোগে ভুগছিলেন। এসময় তিনি ইবনে সিনা হাসপাতালে চিকিৎসাধীন ছিলেন। কিডনী প্রতিস্থাপনের জন্য তাঁকে ব্যাংকক নেয়া হয় কিন্তু সেখানে গিয়ে তাঁর চিকিৎসকরা তাঁকে এক বছর পর কিডনী প্রতিস্থাপনের জন্য আবার ব্যাংকক যাওয়ার পরামর্শ দেন কিন্তু তাঁর আগেই তিনি তাঁর প্রিয় প্রভুর সান্নিধ্যে চলে যান।</p>
<p>পরিশেষে বলা যায়, মতিউর রহমান মল্লিক ছিলেন বহুগুণের আধার এক অনন্য মানুষ। শুধুমাত্র কবি হিসেবেই নয়, গীতিকার হিসেবে তিনি যেমন খ্যাতির শীর্ষে উঠেছেন তেমনি সুরকার এবং শিল্পী হিসেবেও দেশ-বিদেশের লাখো মানুষের হৃদয় জয় করেছেন। মহান আল্লাহ তাঁকে জান্নাতুল ফেরদৌস দান করুন। আমিন।</p>`,

        timeline: defaultTimeline,
        organizations: defaultOrganizations,
        quotes: defaultQuotes,
        awards: defaultAwards,
        literaryWorks: defaultLiteraryWorks,
        // Legacy fallback
        biography: null
    };

    return {
        // Prefer new fields, fall back to defaults or legacy content if needed
        heroTitle: settings.heroTitle || "মতিউর রহমান মল্লিক",
        heroDescription: settings.heroDescription || "সবুজ জমিনের কবি, মানবতার কবি এবং বাংলাদেশের ইসলামী রেনেসাঁস আন্দোলনের অন্যতম পুরোধা।",
        bornDate: settings.bornDate || "১ মার্চ ১৯৫৪",
        bornPlace: settings.bornPlace || "বারুইপাড়া, বাগেরহাট",
        deathDate: settings.deathDate || "১২ আগস্ট ২০১০",
        occupation: settings.occupation || "কবি, সাহিত্যিক, গীতিকার",

        earlyLife: settings.earlyLife || "মতিউর রহমান মল্লিক ১৯৫৪ সালের ১ মার্চ...", // simplified fallback
        philosophy: settings.philosophy || "মতিউর রহমান মল্লিক ছিলেন মানবতার কবি...",
        career: settings.career || "কর্মজীবনে তিনি...",
        deathSection: settings.deathSection || "তিনি দীর্ঘদিন ধরে...",

        timeline: settings.timeline ? JSON.parse(JSON.stringify(settings.timeline)) : defaultTimeline,
        organizations: settings.organizations ? JSON.parse(JSON.stringify(settings.organizations)) : defaultOrganizations,
        quotes: settings.quotes ? JSON.parse(JSON.stringify(settings.quotes)) : defaultQuotes,
        awards: settings.awards ? JSON.parse(JSON.stringify(settings.awards)) : defaultAwards,
        literaryWorks: settings.literaryWorks ? JSON.parse(JSON.stringify(settings.literaryWorks)) : defaultLiteraryWorks,

        // Legacy
        biography: settings.biography,
        biographyShort: settings.biographyShort
    };
}

export async function submitContact(data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}) {
    return prisma.contactSubmission.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            status: 'UNREAD'
        }
    })
}

// ============= Static Data (Fallback) =============

export interface Writing {
    id: string;
    slug: string;
    title: string;
    type: 'poem' | 'song' | 'essay' | 'rhyme' | 'article' | 'other' | 'কবিতা' | 'হামদ' | 'নাত' | 'দেশাত্মবোধক' | 'গজল' | 'প্রবন্ধ' | string;
    kind: 'poem' | 'song' | 'essay' | 'other';
    content?: string;
    excerpt?: string;
    bookSlug?: string;
    readTime?: string;
    category?: string;
    categoryId?: string;
    year?: string;
    views?: number;
    likes?: number;
    composer?: string;
}

export interface Author {
    id: string;
    name: string;
    avatar?: string;
    role: 'admin' | 'user';
    bio?: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: Author;
    publishedAt: string;
    status: 'published' | 'pending' | 'draft';
    category: string;
    tags?: string[];
    readTime: string;
    featured?: boolean;
    views?: number;
}

export interface Book {
    id: number;
    slug: string;
    title: string;
    subtitle?: string;
    description: string;
    year: string;
    publisher: string;
    category: string;
    categoryId: string;
    coverImage?: string;
    totalWritings: number;
}

// ============= Legacy Static Functions =============
// These are kept for backward compatibility. Remove once fully migrated.

export const authors: Author[] = [
    {
        id: "1",
        name: "মতিউর রহমান মল্লিক",
        role: "admin",
        avatar: "https://i.ibb.co/30nN1Wk/mollik-avatar.png",
        bio: "বিশিষ্ট কবি, সাহিত্যিক ও চিন্তাবিদ।"
    },
];

export const allBooks: Book[] = [];
export const allWritings: Writing[] = [];
export const blogPosts: BlogPost[] = [];

export const getBookBySlug = (slug: string) => {
    return allBooks.find(b => b.slug === slug);
};

export const getWritingsByBookSlug = (slug: string) => {
    return allWritings.filter(w => w.bookSlug === slug);
};

export const getWritingBySlug = (slug: string) => {
    return allWritings.find(w => w.slug === slug);
};

export const getPoems = () => {
    return allWritings.filter(w => w.kind === 'poem');
};

export const getSongs = () => {
    return allWritings.filter(w => w.kind === 'song');
};

export const getEssays = () => {
    return allWritings.filter(w => w.kind === 'essay');
};

export const getBlogPosts = () => {
    return blogPosts;
}

export const getBlogPostBySlug = (slug: string) => {
    return blogPosts.find((post: BlogPost) => post.slug === slug);
}
