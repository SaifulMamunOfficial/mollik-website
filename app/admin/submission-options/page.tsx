"use client";

import { useState, useEffect } from "react";
import {
    Settings2,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Check,
    X,
    GripVertical,
    User,
    Building2,
    FileText,
    PenTool,
    Camera,
    Mic,
    Video,
    Save,
    AlertTriangle,
} from "lucide-react";

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

export default function SubmissionOptionsPage() {
    const [options, setOptions] = useState<SubmissionOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("DESIGNATION");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingOption, setEditingOption] = useState<SubmissionOption | null>(null);
    const [newOptionName, setNewOptionName] = useState("");
    const [newOptionIcon, setNewOptionIcon] = useState("");
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const res = await fetch("/api/admin/submission-options");
            if (res.ok) {
                const data = await res.json();
                setOptions(data);
            }
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOptions = options
        .filter((opt) => opt.type === activeTab)
        .sort((a, b) => a.order - b.order);

    const handleAdd = async () => {
        if (!newOptionName.trim()) return;
        setSaving(true);

        try {
            const res = await fetch("/api/admin/submission-options", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: activeTab,
                    name: newOptionName.trim(),
                    icon: newOptionIcon.trim() || null,
                    order: filteredOptions.length,
                }),
            });

            if (res.ok) {
                const newOption = await res.json();
                setOptions([...options, newOption]);
                setNewOptionName("");
                setNewOptionIcon("");
                setShowAddModal(false);
                showSuccessToast();
            }
        } catch (error) {
            console.error("Error adding option:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingOption || !newOptionName.trim()) return;
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/submission-options/${editingOption.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newOptionName.trim(),
                    icon: newOptionIcon.trim() || null,
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setOptions(options.map((opt) => (opt.id === updated.id ? updated : opt)));
                setEditingOption(null);
                setNewOptionName("");
                setNewOptionIcon("");
                showSuccessToast();
            }
        } catch (error) {
            console.error("Error updating option:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/submission-options/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setOptions(options.filter((opt) => opt.id !== id));
                setShowDeleteConfirm(null);
                showSuccessToast();
            }
        } catch (error) {
            console.error("Error deleting option:", error);
        }
    };

    const toggleActive = async (option: SubmissionOption) => {
        try {
            const res = await fetch(`/api/admin/submission-options/${option.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !option.isActive }),
            });

            if (res.ok) {
                const updated = await res.json();
                setOptions(options.map((opt) => (opt.id === updated.id ? updated : opt)));
            }
        } catch (error) {
            console.error("Error toggling option:", error);
        }
    };

    const showSuccessToast = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const openEditModal = (option: SubmissionOption) => {
        setEditingOption(option);
        setNewOptionName(option.name);
        setNewOptionIcon(option.icon || "");
    };

    const activeTypeInfo = optionTypes.find((t) => t.id === activeTab);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">সাবমিশন অপশন</h1>
                    <p className="text-gray-600 mt-1">ব্লগ/নতুন পেজের ড্রপডাউন অপশন পরিচালনা করুন</p>
                </div>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shadow-lg">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">সফলভাবে সংরক্ষিত!</span>
                </div>
            )}

            {/* Tabs - Improved with color-coded cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">ক্যাটাগরি নির্বাচন করুন</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                    {optionTypes.map((type) => {
                        const Icon = type.icon;
                        const count = options.filter((o) => o.type === type.id).length;
                        const isActive = activeTab === type.id;

                        // Color mappings for each type
                        const colorClasses: Record<string, { bg: string; activeBg: string; text: string; icon: string; border: string }> = {
                            rose: { bg: "bg-rose-50", activeBg: "bg-gradient-to-br from-rose-500 to-rose-600", text: "text-rose-700", icon: "text-rose-500", border: "border-rose-200" },
                            blue: { bg: "bg-blue-50", activeBg: "bg-gradient-to-br from-blue-500 to-blue-600", text: "text-blue-700", icon: "text-blue-500", border: "border-blue-200" },
                            indigo: { bg: "bg-indigo-50", activeBg: "bg-gradient-to-br from-indigo-500 to-indigo-600", text: "text-indigo-700", icon: "text-indigo-500", border: "border-indigo-200" },
                            violet: { bg: "bg-violet-50", activeBg: "bg-gradient-to-br from-violet-500 to-violet-600", text: "text-violet-700", icon: "text-violet-500", border: "border-violet-200" },
                            emerald: { bg: "bg-emerald-50", activeBg: "bg-gradient-to-br from-emerald-500 to-emerald-600", text: "text-emerald-700", icon: "text-emerald-500", border: "border-emerald-200" },
                            orange: { bg: "bg-orange-50", activeBg: "bg-gradient-to-br from-orange-500 to-orange-600", text: "text-orange-700", icon: "text-orange-500", border: "border-orange-200" },
                            red: { bg: "bg-red-50", activeBg: "bg-gradient-to-br from-red-500 to-red-600", text: "text-red-700", icon: "text-red-500", border: "border-red-200" },
                        };

                        const colors = colorClasses[type.color] || colorClasses.emerald;

                        return (
                            <button
                                key={type.id}
                                onClick={() => setActiveTab(type.id)}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl font-medium transition-all duration-200 border-2 ${isActive
                                        ? `${colors.activeBg} text-white shadow-lg scale-[1.02] border-transparent`
                                        : `${colors.bg} ${colors.text} hover:shadow-md hover:scale-[1.01] ${colors.border}`
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? "bg-white/20" : "bg-white shadow-sm"
                                    }`}>
                                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : colors.icon}`} />
                                </div>
                                <span className="text-sm text-center leading-tight">{type.name}</span>
                                <span
                                    className={`absolute -top-2 -right-2 min-w-[24px] h-6 px-2 flex items-center justify-center text-xs font-bold rounded-full shadow-sm ${isActive
                                            ? "bg-white text-gray-800"
                                            : `${colors.bg} ${colors.text} border ${colors.border}`
                                        }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        {activeTypeInfo && (
                            <>
                                <activeTypeInfo.icon className="w-5 h-5 text-emerald-600" />
                                <h2 className="font-semibold text-gray-900">{activeTypeInfo.name}</h2>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setShowAddModal(true);
                            setNewOptionName("");
                            setNewOptionIcon("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        নতুন যোগ করুন
                    </button>
                </div>

                {/* Options List */}
                <div className="divide-y divide-gray-100">
                    {filteredOptions.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            কোনো অপশন নেই। নতুন যোগ করতে উপরের বাটনে ক্লিক করুন।
                        </div>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option.id}
                                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${!option.isActive ? "opacity-50" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <GripVertical className="w-5 h-5 text-gray-300 cursor-grab" />
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-gray-900">{option.name}</p>
                                        {option.icon && (
                                            <p className="text-xs text-gray-500">Icon: {option.icon}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(option)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${option.isActive
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {option.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(option)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(option.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingOption) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingOption ? "অপশন সম্পাদনা" : "নতুন অপশন যোগ করুন"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingOption(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    নাম <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newOptionName}
                                    onChange={(e) => setNewOptionName(e.target.value)}
                                    placeholder="যেমন: পাঠক, সাহিত্যিক..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    আইকন (Lucide icon name)
                                </label>
                                <input
                                    type="text"
                                    value={newOptionIcon}
                                    onChange={(e) => setNewOptionIcon(e.target.value)}
                                    placeholder="যেমন: Heart, Music, BookOpen..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    ঐচ্ছিক। Lucide আইকনের নাম দিন।
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingOption(null);
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={editingOption ? handleUpdate : handleAdd}
                                disabled={saving || !newOptionName.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">মুছে ফেলবেন?</h3>
                        <p className="text-gray-500 mb-6">এই অপশনটি স্থায়ীভাবে মুছে যাবে।</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700"
                            >
                                মুছে ফেলুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
