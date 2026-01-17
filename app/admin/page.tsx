import {
    FileText,
    Music,
    BookOpen,
    Newspaper,
    Users,
    Eye,
    Clock,
    TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'

async function getStats() {
    const [
        poemsCount,
        songsCount,
        essaysCount,
        booksCount,
        blogPostsCount,
        pendingBlogPosts,
        usersCount,
    ] = await Promise.all([
        prisma.writing.count({ where: { type: 'POEM', status: 'PUBLISHED' } }),
        prisma.writing.count({ where: { type: 'SONG', status: 'PUBLISHED' } }),
        prisma.writing.count({ where: { type: 'ESSAY', status: 'PUBLISHED' } }),
        prisma.book.count(),
        prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
        prisma.blogPost.count({ where: { status: 'PENDING' } }),
        prisma.user.count(),
    ])

    return {
        poemsCount,
        songsCount,
        essaysCount,
        booksCount,
        blogPostsCount,
        pendingBlogPosts,
        usersCount,
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    const statCards = [
        {
            title: 'কবিতা',
            count: stats.poemsCount,
            icon: FileText,
            href: '/admin/poems',
            color: 'bg-blue-500'
        },
        {
            title: 'গান',
            count: stats.songsCount,
            icon: Music,
            href: '/admin/songs',
            color: 'bg-purple-500'
        },
        {
            title: 'বই',
            count: stats.booksCount,
            icon: BookOpen,
            href: '/admin/books',
            color: 'bg-amber-500'
        },
        {
            title: 'ব্লগ পোস্ট',
            count: stats.blogPostsCount,
            icon: Newspaper,
            href: '/admin/blog',
            color: 'bg-green-500'
        },
        {
            title: 'ব্যবহারকারী',
            count: stats.usersCount,
            icon: Users,
            href: '/admin/users',
            color: 'bg-indigo-500'
        },
    ]

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
                <p className="text-gray-600 mt-1">আপনার সাইটের সামগ্রিক অবস্থা</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((stat) => (
                    <Link
                        key={stat.title}
                        href={stat.href}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.count}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pending Items Alert */}
            {stats.pendingBlogPosts > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 p-3 rounded-lg text-white">
                            <Clock size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-amber-800">
                                অনুমোদনের অপেক্ষায়
                            </h3>
                            <p className="text-amber-700">
                                {stats.pendingBlogPosts}টি ব্লগ পোস্ট অনুমোদনের জন্য অপেক্ষা করছে
                            </p>
                        </div>
                        <Link
                            href="/admin/blog?status=pending"
                            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            দেখুন
                        </Link>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">দ্রুত অ্যাকশন</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/poems/new"
                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                        <FileText size={20} />
                        <span>নতুন কবিতা</span>
                    </Link>
                    <Link
                        href="/admin/songs/new"
                        className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
                    >
                        <Music size={20} />
                        <span>নতুন গান</span>
                    </Link>
                    <Link
                        href="/admin/books/new"
                        className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                        <BookOpen size={20} />
                        <span>নতুন বই</span>
                    </Link>
                    <Link
                        href="/admin/blog"
                        className="flex items-center gap-3 p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
                    >
                        <Newspaper size={20} />
                        <span>ব্লগ পরিচালনা</span>
                    </Link>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-500 p-2 rounded-lg text-white">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">কন্টেন্ট সারসংক্ষেপ</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">মোট কবিতা</span>
                            <span className="font-semibold">{stats.poemsCount}টি</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">মোট গান</span>
                            <span className="font-semibold">{stats.songsCount}টি</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">মোট প্রবন্ধ</span>
                            <span className="font-semibold">{stats.essaysCount}টি</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">মোট বই</span>
                            <span className="font-semibold">{stats.booksCount}টি</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-500 p-2 rounded-lg text-white">
                            <Eye size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">সাম্প্রতিক আপডেট</h3>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                        <p>ডাটাবেস সেটআপ সম্পন্ন হয়েছে</p>
                        <p className="text-sm mt-2">কন্টেন্ট যোগ করা শুরু করুন</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
