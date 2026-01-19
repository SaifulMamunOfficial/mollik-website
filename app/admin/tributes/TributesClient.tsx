'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X, Clock, Heart, Trash2, Quote, Sparkles, Search, Eye, Calendar, MoreHorizontal, Plus, Save, User, MapPin, Pencil } from 'lucide-react'

interface Tribute {
    id: string
    content: string
    status: string
    createdAt: string
    author: { name: string | null; email: string }
    designation?: string
    district?: string | null
    manualDate?: string | null
    isFeatured: boolean
    displayOption?: string
}

interface NewTributeForm {
    content: string
    name: string
    designation: string
    district: string
    displayOption: 'DISTRICT' | 'DESIGNATION'
    manualDate?: string
    isFeatured: boolean
}

interface Props {
    tributes: Tribute[]
}

type TabType = 'pending' | 'published' | 'all' | 'archived'

const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export default function TributesClient({ tributes }: Props) {
    const [items, setItems] = useState(tributes)
    const [activeTab, setActiveTab] = useState<TabType>('pending') // Default to pending
    const [searchQuery, setSearchQuery] = useState('')
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    // Modals
    const [viewTribute, setViewTribute] = useState<Tribute | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)

    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown && !(event.target as Element).closest(`#dropdown-${openDropdown}`)) {
                setOpenDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [openDropdown])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [newTribute, setNewTribute] = useState<NewTributeForm>({
        content: '',
        name: '',
        designation: '',
        district: '',
        displayOption: 'DISTRICT',
        manualDate: '',
        isFeatured: false
    })

    const districts = [
        "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ",
        "কুমিল্লা", "ফেনী", "ব্রাহ্মণবাড়িয়া", "রাঙ্গামাটি", "নোয়াখালী", "চাঁদপুর",
        "লক্ষ্মীপুর", "কক্সবাজার", "গাজীপুর", "নারায়ণগঞ্জ", "নরসিংদী", "ফরিদপুর", "গোপালগঞ্জ", "মাদারীপুর"
    ]

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const url = editingId ? `/api/admin/tributes/${editingId}` : '/api/admin/tributes/create'
            const method = editingId ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTribute)
            })

            const data = await res.json()

            if (res.ok) {
                if (editingId) {
                    setItems(items.map(t => t.id === editingId ? data.tribute : t))
                } else {
                    setItems([data.tribute, ...items])
                }
                setIsModalOpen(false)
                setEditingId(null)
                setNewTribute({ content: '', name: '', designation: '', district: '', displayOption: 'DISTRICT', manualDate: '', isFeatured: false })
                // Switch to 'published' or 'all' tab to see it
                if (!editingId && activeTab === 'pending') setActiveTab('all')
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setNewTribute({ content: '', name: '', designation: '', district: '', displayOption: 'DISTRICT', manualDate: '', isFeatured: false })
    }

    const handleEdit = (tribute: Tribute) => {
        setEditingId(tribute.id)
        // Ensure manualDate is a string (ISO) or empty
        const dateStr = tribute.manualDate ? new Date(tribute.manualDate).toISOString().split('T')[0] : ''

        setNewTribute({
            content: tribute.content,
            name: tribute.author.name || '',
            designation: tribute.designation || '',
            district: tribute.district || '',
            displayOption: (tribute.displayOption as 'DISTRICT' | 'DESIGNATION') || 'DISTRICT',
            manualDate: dateStr,
            isFeatured: tribute.isFeatured
        })
        setOpenDropdown(null)
        setIsModalOpen(true)
    }

    const pendingTributes = items.filter(t => t.status === 'PENDING')
    const publishedTributes = items.filter(t => t.status === 'PUBLISHED')
    const archivedTributes = items.filter(t => t.status === 'ARCHIVED')
    const activeTributes = items.filter(t => t.status !== 'ARCHIVED')

    const filteredItems = () => {
        let filtered = items // Show everything for 'all' tab as requested

        if (activeTab === 'pending') filtered = pendingTributes
        else if (activeTab === 'published') filtered = publishedTributes
        else if (activeTab === 'archived') filtered = archivedTributes

        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.author.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.author.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        return filtered
    }

    const handleApprove = async (id: string) => {
        setLoadingId(id)
        try {
            const res = await fetch(`/api/admin/tributes/${id}/approve`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(t =>
                    t.id === id ? { ...t, status: 'PUBLISHED' } : t
                ))
            }
        } catch (error) {
            console.error('Approve error:', error)
        } finally {
            setLoadingId(null)
        }
    }

    const handleReject = async (id: string) => {
        setLoadingId(id)
        try {
            const res = await fetch(`/api/admin/tributes/${id}/reject`, { method: 'POST' })
            if (res.ok) {
                setItems(items.map(t =>
                    t.id === id ? { ...t, status: 'ARCHIVED' } : t
                ))
            }
        } catch (error) {
            console.error('Reject error:', error)
        } finally {
            setLoadingId(null)
        }
    }

    const tabs = [
        { id: 'pending' as TabType, label: 'অপেক্ষমাণ', count: pendingTributes.length, color: 'amber' },
        { id: 'published' as TabType, label: 'প্রকাশিত', count: publishedTributes.length, color: 'emerald' },
        { id: 'all' as TabType, label: 'সব', count: items.length, color: 'blue' },
        { id: 'archived' as TabType, label: 'বাতিল', count: archivedTributes.length, color: 'red' },
    ]

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const months = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"]
        const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
        const day = date.getDate().toString().split("").map(d => bengaliNumerals[parseInt(d)]).join("")
        return `${day} ${months[date.getMonth()]}`
    }

    return (
        <div className="space-y-6">
            {/* Modern Header with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                                <Heart className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">শোকবার্তা পরিচালনা</h1>
                                <p className="text-emerald-200 text-sm">কবির প্রতি শ্রদ্ধাঞ্জলি সমূহ</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">নতুন যোগ করুন</span>
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors group cursor-default">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-300" />
                                <span className="text-xs text-emerald-200">অপেক্ষমাণ</span>
                            </div>
                            <p className="text-3xl font-bold mt-1 group-hover:scale-105 transition-transform">{pendingTributes.length}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors group cursor-default">
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-emerald-300" />
                                <span className="text-xs text-emerald-200">প্রকাশিত</span>
                            </div>
                            <p className="text-3xl font-bold mt-1 group-hover:scale-105 transition-transform">{publishedTributes.length}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors group cursor-default">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-300" />
                                <span className="text-xs text-emerald-200">মোট</span>
                            </div>
                            <p className="text-3xl font-bold mt-1 group-hover:scale-105 transition-transform">{items.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Pill Tabs */}
                <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id
                                ? tab.id === 'pending' ? 'bg-amber-100 text-amber-700'
                                    : tab.id === 'published' ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-rose-100 text-rose-700'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 w-full md:w-64"
                    />
                </div>
            </div>

            {/* Tributes Grid */}
            {filteredItems().length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center">
                        <Heart className="w-10 h-10 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        কোনো শোকবার্তা নেই
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {activeTab === 'pending' ? 'অনুমোদনের অপেক্ষায় কোনো শোকবার্তা নেই' : 'এই ক্যাটাগরিতে কোনো শোকবার্তা নেই'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItems().map((tribute, index) => (
                        <div
                            key={tribute.id}
                            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-rose-500/30">
                                        {tribute.author.name?.charAt(0) || tribute.author.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                            {tribute.author.name || tribute.author.email.split('@')[0]}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {formatFullDate(tribute.manualDate || tribute.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                {tribute.isFeatured && (
                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 mr-2">
                                        বিশিষ্ট
                                    </span>
                                )}
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${tribute.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    : tribute.status === 'PUBLISHED'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {tribute.status === 'PENDING' ? 'অপেক্ষমাণ' : tribute.status === 'PUBLISHED' ? 'প্রকাশিত' : 'বাতিল'}
                                </span>
                            </div>

                            {/* Quote Content */}
                            <div className="p-5 relative">
                                <Quote className="absolute top-3 left-3 w-8 h-8 text-rose-100 dark:text-rose-900/50" />
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-6 line-clamp-4 text-sm">
                                    {tribute.content}
                                </p>
                            </div>

                            {/* Card Actions - Dropdown Menu */}
                            <div className="flex items-center justify-end p-4 pt-0" id={`dropdown-${tribute.id}`}>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === tribute.id ? null : tribute.id)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openDropdown === tribute.id && (
                                        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
                                            {tribute.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            handleApprove(tribute.id)
                                                            setOpenDropdown(null)
                                                        }}
                                                        disabled={loadingId === tribute.id}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
                                                    >
                                                        {loadingId === tribute.id ? (
                                                            <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4 text-emerald-500" />
                                                        )}
                                                        অনুমোদন করুন
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleReject(tribute.id)
                                                            setOpenDropdown(null)
                                                        }}
                                                        disabled={loadingId === tribute.id}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                                    >
                                                        <X className="w-4 h-4 text-red-500" />
                                                        বাতিল করুন
                                                    </button>
                                                </>
                                            )}
                                            {tribute.status === 'PUBLISHED' && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setViewTribute(tribute)
                                                            setOpenDropdown(null)
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                        বিস্তারিত দেখুন
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(tribute)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4 text-gray-500" />
                                                        সম্পাদনা করুন
                                                    </button>
                                                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(tribute.id)
                                                            setOpenDropdown(null)
                                                        }}
                                                        disabled={loadingId === tribute.id}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        মুছে ফেলুন
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingId ? 'শোকবার্তা সম্পাদনা করুন' : 'নতুন শোকবার্তা যোগ করুন'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">নাম</label>
                                    <input
                                        required
                                        type="text"
                                        value={newTribute.name}
                                        onChange={e => setNewTribute({ ...newTribute, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="মেহমানের নাম"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">পদবী (ঐচ্ছিক)</label>
                                    <input
                                        type="text"
                                        value={newTribute.designation}
                                        onChange={e => setNewTribute({ ...newTribute, designation: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="যেমন: কবি / লেখক"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">নামের নিচে কী দেখাবে?</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="displayOption"
                                            value="DISTRICT"
                                            checked={newTribute.displayOption === 'DISTRICT'}
                                            onChange={() => setNewTribute({ ...newTribute, displayOption: 'DISTRICT' })}
                                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">জেলা (District)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="displayOption"
                                            value="DESIGNATION"
                                            checked={newTribute.displayOption === 'DESIGNATION'}
                                            onChange={() => setNewTribute({ ...newTribute, displayOption: 'DESIGNATION' })}
                                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">পদবী (Designation)</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">জেলা</label>
                                <select
                                    required
                                    value={newTribute.district}
                                    onChange={e => setNewTribute({ ...newTribute, district: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                >
                                    <option value="">জেলা নির্বাচন করুন</option>
                                    {districts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">তারিখ (ঐচ্ছিক)</label>
                                <input
                                    type="date"
                                    value={newTribute.manualDate || ''}
                                    onChange={e => setNewTribute({ ...newTribute, manualDate: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                <label className="flex items-center gap-3 cursor-pointer w-full">
                                    <input
                                        type="checkbox"
                                        checked={newTribute.isFeatured}
                                        onChange={e => setNewTribute({ ...newTribute, isFeatured: e.target.checked })}
                                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-gray-300"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">বিশিষ্টজন (Featured)</span>
                                        <span className="text-xs text-gray-500">নির্বাচিত হলে এটি উপরের সেকশনে দেখাবে</span>
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">শোকবার্তা</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newTribute.content}
                                    onChange={e => setNewTribute({ ...newTribute, content: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                    placeholder="আপনার শোকবার্তা লিখুন..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            সংরক্ষণ হচ্ছে...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {editingId ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Tribute Modal */}
            {viewTribute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">বিস্তারিত তথ্য</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">শোকবার্তা টি সম্পর্কে বিস্তারিত</p>
                            </div>
                            <button onClick={() => setViewTribute(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{viewTribute.author.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{viewTribute.author.email}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {viewTribute.designation && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                                {viewTribute.designation}
                                            </span>
                                        )}
                                        {viewTribute.district && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {viewTribute.district}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {formatFullDate(viewTribute.manualDate || viewTribute.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 relative">
                                <Quote className="absolute top-2 left-2 w-6 h-6 text-gray-200 dark:text-gray-700" />
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-4 pt-2 whitespace-pre-wrap">
                                    {viewTribute.content}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
                            <button
                                onClick={() => setViewTribute(null)}
                                className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                বন্ধ করুন
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">আপনি কি নিশ্চিত?</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                আপনি কি সত্যিই এই শোকবার্তাটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-6 py-4 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-r border-gray-100 dark:border-gray-700"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={() => {
                                    handleReject(deleteId)
                                    setDeleteId(null)
                                }}
                                className="flex-1 px-6 py-4 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            >
                                হ্যাঁ, মুছে ফেলুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
