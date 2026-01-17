import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Award, BookOpen, Music, MapPin, Briefcase, Quote, Users } from "lucide-react";
import { getBiographyFromDB } from "@/lib/data";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "জীবনী",
    description: "কবি মতিউর রহমান মল্লিক (১৯৫৪-২০১০) এর বিস্তারিত জীবনী। জন্ম, শিক্ষা, কর্মজীবন, সাহিত্যকর্ম এবং পুরস্কার সম্পর্কে জানুন।",
    openGraph: {
        title: "কবি মতিউর রহমান মল্লিক - জীবনী",
        description: "বাংলাদেশের বিশিষ্ট কবি ও গীতিকার মতিউর রহমান মল্লিকের জীবন ও কর্ম।",
        type: "profile",
    },
};

export default async function BiographyPage() {
    const data = await getBiographyFromDB();

    // Helper to safely render HTML content
    const SafeHTML = ({ content, className = "text-gray-600 dark:text-gray-300" }: { content: string | null | undefined, className?: string }) => {
        if (!content) return null;
        return <div className={`prose dark:prose-invert max-w-none leading-loose ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-cream-50 dark:bg-gray-950 font-bengali">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-primary-900 via-gray-900 to-black text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                    </div>

                    <div className="container-custom relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block px-4 py-1.5 mb-4 bg-gold-500/20 border border-gold-500/30 text-gold-400 rounded-full text-sm font-medium">
                                ১৯৫৪ – ২০১০
                            </span>
                            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                                {data.heroTitle.split(" ").map((word: string, i: number, arr: string[]) => (
                                    <span key={i} className={i === arr.length - 1 ? "text-gold-500" : ""}>{word} </span>
                                ))}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                                {data.heroDescription}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                {data.awards && data.awards.length > 0 && (
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                        <Award className="w-5 h-5 text-gold-400" />
                                        <span>{Array.isArray(data.awards) ? data.awards[0] : 'স্বর্ণপদক'}</span>
                                    </div>
                                )}
                                {data.organizations && data.organizations.length > 0 && (
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                        <Music className="w-5 h-5 text-gold-400" />
                                        <span>{Array.isArray(data.organizations) ? data.organizations[0].name : ''} এর প্রতিষ্ঠাতা</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex justify-center">
                            <div className="relative w-72 h-80 md:w-96 md:h-[450px] border-4 border-white/10 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
                                {/* Poet Image - could be made dynamic later too */}
                                <img
                                    src="/images/poet-mollik.png"
                                    alt={data.heroTitle}
                                    className="w-full h-full object-cover object-top"
                                    style={{ objectPosition: 'center 15%', transform: 'scale(1.1)' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <span className="text-white font-medium">{data.heroTitle}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container-custom py-16">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Quick Info Sidebar */}
                        <aside className="lg:col-span-1 space-y-8">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
                                    এক নজরে
                                </h3>

                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-4 h-4 text-primary-600 dark:text-gold-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">জন্ম</p>
                                            <p className="text-gray-900 dark:text-white font-medium">{data.bornDate}</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-primary-600 dark:text-gold-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">জন্মস্থান</p>
                                            <p className="text-gray-900 dark:text-white font-medium">{data.bornPlace}</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-4 h-4 text-primary-600 dark:text-gold-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">মৃত্যু</p>
                                            <p className="text-gray-900 dark:text-white font-medium">{data.deathDate}</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-4 h-4 text-primary-600 dark:text-gold-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">পেশা</p>
                                            <p className="text-gray-900 dark:text-white font-medium">{data.occupation}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <article className="lg:col-span-2 space-y-12">
                            {/* Early Life */}
                            {data.earlyLife && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                                        জন্ম ও বেড়ে ওঠা
                                    </h2>
                                    <SafeHTML content={data.earlyLife} />
                                </section>
                            )}

                            {/* Education */}
                            {data.education && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-gold-500 rounded-full"></span>
                                        শৈশব ও শিক্ষাজীবন
                                    </h2>
                                    <SafeHTML content={data.education} />
                                </section>
                            )}

                            {/* Literary Culture & Organization */}
                            {data.literaryCulture && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                                        সাহিত্যচর্চা ও সংগঠন
                                    </h2>
                                    <SafeHTML content={data.literaryCulture} />
                                </section>
                            )}

                            {/* Philosophy & Thoughts */}
                            {data.philosophy && (
                                <section className="bg-gradient-to-br from-primary-900 to-gray-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                                    <h2 className="relative z-10 flex items-center gap-3 font-display text-3xl font-bold mb-6">
                                        <span className="w-2 h-8 bg-gold-500 rounded-full"></span>
                                        দর্শন ও সাহিত্যভাবনা
                                    </h2>
                                    <SafeHTML content={data.philosophy} className="text-gray-100/90" />
                                </section>
                            )}

                            {/* Bio Layout Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Career */}
                                {data.career && (
                                    <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                        <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                            <span className="w-2 h-6 bg-gold-500 rounded-full"></span>
                                            কর্মজীবন
                                        </h2>
                                        <SafeHTML content={data.career} />
                                    </section>
                                )}

                                {/* Visual Timeline */}
                                {data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0 && (
                                    <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                        <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                            <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                            পথরেখা
                                        </h2>
                                        <div className="relative pl-6 border-l-2 border-primary-100 dark:border-gray-800 space-y-8">
                                            {data.timeline.map((item: any, index: number) => (
                                                <div key={index} className="relative">
                                                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 bg-primary-500"></div>
                                                    <span className="inline-block px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-gold-400 text-xs font-bold rounded-full mb-1">
                                                        {item.year}
                                                    </span>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Founded Organizations */}
                            {data.organizations && Array.isArray(data.organizations) && data.organizations.length > 0 && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-gold-500 rounded-full"></span>
                                        প্রতিষ্ঠিত সংগঠন
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {data.organizations.map((org: any, index: number) => (
                                            <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors border border-transparent hover:border-primary-100 dark:hover:border-primary-900/30">
                                                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 text-primary-600 dark:text-gold-400">
                                                    {org.icon === 'Music' ? <Music className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{org.name}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        {org.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Quotes Section */}
                            {data.quotes && Array.isArray(data.quotes) && data.quotes.length > 0 && (
                                <section>
                                    <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                                        নির্বাচিত বাণী
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {data.quotes.map((quote: string, index: number) => (
                                            <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gold-400 dark:hover:border-gold-500/50 transition-colors shadow-sm cursor-default group">
                                                <Quote className="w-6 h-6 text-primary-200 dark:text-gray-700 mb-3 group-hover:text-gold-400 transition-colors" />
                                                <p className="font-display text-lg text-gray-800 dark:text-gray-200 leading-relaxed italic">
                                                    "{quote}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Literary Works */}
                            {data.literaryWorks && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                                        সাহিত্যকর্ম
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {data.literaryWorks.poetry && data.literaryWorks.poetry.length > 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <BookOpen className="w-6 h-6 text-primary-600 dark:text-gold-400" />
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">কাব্যগ্রন্থ</h3>
                                                </div>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-2">
                                                    {data.literaryWorks.poetry.map((work: string, i: number) => (
                                                        <li key={i}>{work}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {data.literaryWorks.songs && data.literaryWorks.songs.length > 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Music className="w-6 h-6 text-primary-600 dark:text-gold-400" />
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">গানের বই</h3>
                                                </div>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-2">
                                                    {data.literaryWorks.songs.map((work: string, i: number) => (
                                                        <li key={i}>{work}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Photo Gallery Placeholder */}
                            <section>
                                <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">
                                    স্মৃতির অ্যালবাম
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <div key={item} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 font-medium font-display">
                                                ছবি {item}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Creative Works - Srijon */}
                            {data.creativeWorks && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-gold-500 rounded-full"></span>
                                        সৃজন
                                    </h2>
                                    <SafeHTML content={data.creativeWorks} />
                                </section>
                            )}

                            {/* Other Responsibilities */}
                            {data.otherResponsibilities && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                                        অন্যান্য দায়িত্ব
                                    </h2>
                                    <SafeHTML content={data.otherResponsibilities} />
                                </section>
                            )}

                            {/* Awards */}
                            {data.awards && Array.isArray(data.awards) && data.awards.length > 0 && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-gold-500 rounded-full"></span>
                                        পুরস্কার ও সম্মাননা
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {data.awards.map((award: string, index: number) => (
                                            <div key={index} className="flex items-center gap-3 p-4 bg-gold-5 dark:bg-gold-900/10 rounded-xl border border-gold-100 dark:border-gold-800/30">
                                                <Award className="w-5 h-5 text-gold-500" />
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{award}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Family Life */}
                            {data.familyLife && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                                        সংসার জীবন
                                    </h2>
                                    <SafeHTML content={data.familyLife} />
                                </section>
                            )}

                            {/* Travels */}
                            {data.travels && (
                                <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        <span className="w-2 h-8 bg-gold-500 rounded-full"></span>
                                        ভ্রমণ
                                    </h2>
                                    <SafeHTML content={data.travels} />
                                </section>
                            )}

                            {/* Death */}
                            {data.deathSection && (
                                <section className="bg-gray-50 dark:bg-gray-800/30 p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
                                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        ইন্তেকাল
                                    </h2>
                                    <SafeHTML content={data.deathSection} />
                                </section>
                            )}
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
