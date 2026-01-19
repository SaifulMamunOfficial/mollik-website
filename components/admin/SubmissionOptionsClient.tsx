"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle,
    User,
    Building2,
    FileText,
    PenTool,
    Camera,
    Mic,
    Video,
    Save,
    X,
    MoreVertical,
    Check,
    AlertCircle
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface SubmissionOption {
    id: string;
    type: string;
    name: string;
    icon: string | null;
    order: number;
    isActive: boolean;
}

const optionTypes = [
    { id: "DESIGNATION", name: "পরিচয়", icon: User, color: "rose" },
    { id: "ORGANIZATION_TYPE", name: "প্রতিষ্ঠানের ধরন", icon: Building2, color: "blue" },
    { id: "BLOG_CATEGORY", name: "ব্লগ ক্যাটাগরি", icon: FileText, color: "indigo" },
    { id: "POEM_CATEGORY", name: "কবিতা ক্যাটাগরি", icon: PenTool, color: "violet" },
    { id: "PHOTO_CATEGORY", name: "ছবিঘর ক্যাটাগরি", icon: Camera, color: "emerald" },
    { id: "AUDIO_CATEGORY", name: "অডিও ক্যাটাগরি", icon: Mic, color: "orange" },
    { id: "VIDEO_CATEGORY", name: "ভিডিও ক্যাটাগরি", icon: Video, color: "red" },
];

interface SubmissionOptionsClientProps {
    initialOptions: SubmissionOption[];
}

export default function SubmissionOptionsClient({ initialOptions }: SubmissionOptionsClientProps) {
    const router = useRouter();
    const [options, setOptions] = useState<SubmissionOption[]>(initialOptions);
    const [activeTab, setActiveTab] = useState("DESIGNATION");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", icon: "" });
    const [isSaving, setIsSaving] = useState(false);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filtered Data
    const filteredOptions = useMemo(() => {
        return options
            .filter(opt => opt.type === activeTab)
            .filter(opt => opt.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.order - b.order);
    }, [options, activeTab, searchQuery]);

    const activeTypeInfo = optionTypes.find(t => t.id === activeTab);

    // Dynamic Icon Renderer
    const renderIcon = (iconName: string | null) => {
        if (!iconName) return null;
        // @ts-ignore
        const Icon = LucideIcons[iconName];
        return Icon ? <Icon size={16} /> : null;
    };

    // Actions
    const handleSave = async () => {
        if (!formData.name.trim()) return;
        setIsSaving(true);

        try {
            const url = editingId
                ? `/api/admin/submission-options/${editingId}`
                : '/api/admin/submission-options';

            const method = editingId ? 'PUT' : 'POST';

            const body = {
                name: formData.name,
                icon: formData.icon || null,
                ...(!editingId && { type: activeTab, order: filteredOptions.length })
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Failed to save');

            const savedOption = await res.json();

            if (editingId) {
                setOptions(opts => opts.map(o => o.id === editingId ? savedOption : o));
            } else {
                setOptions(opts => [...opts, savedOption]);
            }

            closeModal();
            router.refresh();
        } catch (error) {
            console.error('Save failed:', error);
            alert('সংরক্ষণ করতে সমস্যা হয়েছে');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await fetch(`/api/admin/submission-options/${deleteId}`, { method: 'DELETE' });
            setOptions(opts => opts.filter(o => o.id !== deleteId));
            setDeleteId(null);
            router.refresh();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('মুছতে সমস্যা হয়েছে');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setOptions(opts => opts.map(o => o.id === id ? { ...o, isActive: !currentStatus } : o));

        try {
            await fetch(`/api/admin/submission-options/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            router.refresh();
        } catch (error) {
            console.error('Status update failed:', error);
            // Revert on failure
            setOptions(opts => opts.map(o => o.id === id ? { ...o, isActive: currentStatus } : o));
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: "", icon: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (opt: SubmissionOption) => {
        setEditingId(opt.id);
        setFormData({ name: opt.name, icon: opt.icon || "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: "", icon: "" });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">সাবমিশন অপশন</h1>
                <p className="text-gray-600 mt-1">ক্যাটাগরি এবং ড্রপডাউন অপশন ম্যানেজ করুন</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max p-1">
                    {optionTypes.map((type) => {
                        const Icon = type.icon;
                        const isActive = activeTab === type.id;
                        const count = options.filter(o => o.type === type.id).length;

                        return (
                            <button
                                key={type.id}
                                onClick={() => setActiveTab(type.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border
                                    ${isActive
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                        : 'bg-white text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-200'
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{type.name}</span>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="অপশন খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 w-full md:w-auto justify-center"
                    >
                        <Plus size={18} />
                        <span>নতুন অপশন</span>
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredOptions.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">কোনো অপশন পাওয়া যায়নি</p>
                        <p className="text-sm mt-1">নতুন অপশন যোগ করতে উপরের বাটনে ক্লিক করুন</p>
                    </div>
                ) : (
                    filteredOptions.map((option) => (
                        <div key={option.id} className="group bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {renderIcon(option.icon) || (activeTypeInfo ? <activeTypeInfo.icon size={20} /> : <User size={20} />)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 line-clamp-1" title={option.name}>{option.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5 font-mono">{option.icon || 'No Icon'}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(option)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <button
                                    onClick={() => handleToggleStatus(option.id, option.isActive)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border
                                        ${option.isActive
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}
                                    `}
                                >
                                    {option.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {option.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                </button>

                                <button
                                    onClick={() => setDeleteId(option.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="মুছে ফেলুন"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingId ? "অপশন সম্পাদনা" : "নতুন অপশন"}
                            </h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="অপশনের নাম লিখুন..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all focus:bg-white"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    আইকন (Lucide Icon Name)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="যেমন: Heart, Star, User..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all focus:bg-white"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        {formData.icon && renderIcon(formData.icon) ? renderIcon(formData.icon) : <Search size={16} />}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    <span>Lucide Icons লাইব্রেরির যেকোনো আইকনের নাম ব্যবহার করতে পারেন।</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !formData.name.trim()}
                                className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                সংরক্ষণ করুন
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">আপনি কি নিশ্চিত?</h3>
                        <p className="text-gray-500 mb-6">এটি পাকাপাকিভাবে মুছে ফেলা হবে এবং আর ফিরিয়ে আনা যাবে না।</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                না, বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                হ্যাঁ, মুছে ফেলুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
