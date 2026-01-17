'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Eye, AlertTriangle, Music } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Song {
    id: string
    title: string
    slug: string
    status: string
    views: number
    composer?: string | null
    category: { name: string } | null
    book: { title: string } | null
}

interface SongsTableProps {
    songs: Song[]
}

export default function SongsTable({ songs }: SongsTableProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!deleteId) return
        setLoading(deleteId)

        try {
            const response = await fetch(`/api/admin/songs/${deleteId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.refresh()
            } else {
                alert('ডিলিট করতে সমস্যা হয়েছে')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('ডিলিট করতে সমস্যা হয়েছে')
        } finally {
            setLoading(null)
            setDeleteId(null)
        }
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {songs.length === 0 ? (
                    <div className="text-center py-12">
                        <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">কোনো গান পাওয়া যায়নি</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">শিরোনাম</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">সুরকার</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ক্যাটাগরি</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">বই</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">স্ট্যাটাস</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ভিউ</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {songs.map((song) => (
                                <tr key={song.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{song.title}</div>
                                        <div className="text-sm text-gray-500">{song.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {song.composer || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {song.category?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {song.book?.title || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${song.status === 'PUBLISHED'
                                                ? 'bg-purple-100 text-purple-700'
                                                : song.status === 'DRAFT'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }
                    `}>
                                            {song.status === 'PUBLISHED' ? 'প্রকাশিত' :
                                                song.status === 'DRAFT' ? 'ড্রাফট' : 'পেন্ডিং'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {song.views}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/songs/${song.slug}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="দেখুন"
                                                target="_blank"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/songs/${song.id}`}
                                                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                                title="সম্পাদনা"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(song.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="মুছুন"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                    এই গানটি মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={loading === deleteId}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading === deleteId}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {loading === deleteId ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
