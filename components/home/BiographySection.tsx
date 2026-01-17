import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function BiographySection() {
    return (
        <section className="section bg-cream-50 dark:bg-gray-900">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            সংক্ষিপ্ত জীবনী
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            কবির জীবন ও কর্ম
                        </p>
                    </div>
                    <Link
                        href="/biography"
                        className="inline-flex items-center gap-2 mt-4 md:mt-0 text-primary-600 dark:text-gold-400 hover:text-primary-700 dark:hover:text-gold-300 font-medium transition-colors"
                    >
                        বিস্তারিত জীবনী
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Biography Card - Glass Effect */}
                <div className="glass rounded-3xl overflow-hidden">
                    <div className="grid md:grid-cols-3 gap-8 p-8 md:p-12">
                        {/* Image Column */}
                        <div className="md:col-span-1 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-48 h-56 md:w-56 md:h-64 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-700">
                                    {/* Poet Image */}
                                    <Image
                                        src="/images/poet-mollik.png"
                                        alt="কবি মতিউর রহমান মল্লিক"
                                        width={224}
                                        height={300}
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: 'center 15%', transform: 'scale(1.15)' }}
                                    />
                                </div>
                                {/* Decorative Ring */}
                                <div className="absolute -inset-3 border-2 border-gold-400/30 rounded-2xl -z-10" />
                            </div>
                            {/* Caption */}
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold-400/60" />
                                <p className="text-center text-gold-600 dark:text-gold-400 font-medium text-sm tracking-wide">
                                    ✦ কবি, গীতিকার ও সাহিত্যিক ✦
                                </p>
                                <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold-400/60" />
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="md:col-span-2">
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        মতিউর রহমান মল্লিক
                                    </h3>
                                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 text-sm font-medium">
                                        ১৯৫০ - ২০১০
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    মতিউর রহমান মল্লিক (১ মার্চ ১৯৫০ - ১২ আগস্ট ২০১০) একজন বাংলাদেশী কবি, সাহিত্যিক, সংগীত শিল্পী, সুরকার ও গীতিকার। তিনি বাংলাদেশ সংস্কৃতি কেন্দ্রের নিবাসী পরিচালক ছিলেন।
                                </p>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    বাগেরহাট জেলার সদর উপজেলার বুরকুণ্ডা গ্রামে জন্মগ্রহণ করেন। জগন্নাথ কলেজ থেকে বাংলা ভাষা ও সাহিত্যে স্নাতকোত্তর সম্পন্ন করেন। তাকে অনেকেই সুবুদ্ধ জাতীয়তাবাদী কবি ও মানবতার কবি বলে থাকেন।
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                                        <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-gold-400 font-display">
                                            ২০০+
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            কবিতা
                                        </div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-gold-50 dark:bg-gold-900/20">
                                        <div className="text-2xl md:text-3xl font-bold text-gold-600 dark:text-gold-400 font-display">
                                            ১০০+
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            গান
                                        </div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                                        <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-gold-400 font-display">
                                            ১৫+
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            গ্রন্থ
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
