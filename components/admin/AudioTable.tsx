'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Play, AlertTriangle, Mic, Music } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Audio {
    id: string
    title: string
    slug: string
    status: string
    views: number
    artist?: string | null
    album?: string | null
    duration?: string | null
    coverImage?: string | null
    audioUrl?: string
}

interface AudioTableProps {
    audios: Audio[]
}

export default function AudioTable({ audios }: AudioTableProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!deleteId) return
        setLoading(deleteId)

        try {
            const response = await fetch(`/api/admin/audio/${deleteId}`, {
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
                {audios.length === 0 ? (
                    <div className="text-center py-12">
                        <Mic className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">কোনো অডিও পাওয়া যায়নি</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">অডিও</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">শিল্পী</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">অ্যালবাম</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">সময়কাল</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Views</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {audios.map((audio) => (
                                <tr key={audio.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden">
                                                {audio.coverImage ? (
                                                    <img
                                                        src={audio.coverImage}
                                                        alt={audio.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder.png';
                                                            (e.target as HTMLImageElement).parentElement?.classList.remove('overflow-hidden');
                                                            (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                            // Fallback to icon if needed, but here simple hidden is fine or handling state
                                                        }}
                                                    />
                                                ) : (
                                                    <Music className="text-orange-500" size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{audio.title}</div>
                                                <div className="text-sm text-gray-500">{audio.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {audio.artist || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {audio.album || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {audio.duration || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {audio.views}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={audio.audioUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                title="প্লে"
                                            >
                                                <Play size={18} />
                                            </a>
                                            <Link
                                                href={`/admin/audio/${audio.id}`}
                                                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                                                title="সম্পাদনা"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(audio.id)}
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
                                    এই অডিওটি মুছে ফেলা হবে। এই অ্যাকশনটি ফিরিয়ে নেওয়া যাবে না।
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
