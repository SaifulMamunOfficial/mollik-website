import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search, BookOpen } from 'lucide-react'
import prisma from '@/lib/prisma'

async function getBooks() {
    return prisma.book.findMany({
        include: {
            _count: {
                select: { writings: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function BooksPage() {
    const books = await getBooks()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">বই পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">{books.length}টি বই</p>
                </div>
                <Link
                    href="/admin/books/new"
                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>নতুন বই</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="বই খুঁজুন..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">কোনো বই পাওয়া যায়নি</p>
                        <Link
                            href="/admin/books/new"
                            className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                        >
                            <Plus size={20} />
                            <span>প্রথম বই যোগ করুন</span>
                        </Link>
                    </div>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-amber-500" />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 text-lg">{book.title}</h3>
                                {book.subtitle && (
                                    <p className="text-sm text-gray-500 mt-1">{book.subtitle}</p>
                                )}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">{book._count.writings}</span> টি রচনা
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/books/${book.slug}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="দেখুন"
                                            target="_blank"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            href={`/admin/books/${book.id}`}
                                            className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                                            title="সম্পাদনা"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="মুছুন"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
