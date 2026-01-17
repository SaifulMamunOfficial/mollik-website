'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Search, BookOpen, AlertTriangle } from 'lucide-react'

interface Book {
    id: string
    title: string
    slug: string
    subtitle?: string | null
    author?: string | null
    coverImage?: string | null
    _count: {
        writings: number
    }
}

interface BooksTableProps {
    books: Book[]
}

export default function BooksTable({ books: initialBooks }: BooksTableProps) {
    const router = useRouter()
    const [books, setBooks] = useState(initialBooks)
    const [searchQuery, setSearchQuery] = useState('')
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/books/${deleteId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setBooks(books.filter(b => b.id !== deleteId))
                router.refresh()
            } else {
                alert('বইটি ডিলিট করতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('কিছু সমস্যা হয়েছে')
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="বই খুঁজুন..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.length === 0 ? (
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
                    filteredBooks.map((book) => (
                        <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                            {book.coverImage ? (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-amber-500" />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1" title={book.title}>{book.title}</h3>
                                {book.subtitle && (
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{book.subtitle}</p>
                                )}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium text-amber-600">{book._count.writings}</span> টি রচনা
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/books/${book.slug}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="দেখুন"
                                            target="_blank"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            href={`/admin/books/${book.id}`}
                                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                            title="সম্পাদনা"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(book.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">আপনি কি নিশ্চিত?</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    ‘{books.find(b => b.id === deleteId)?.title}’ বইটি মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
