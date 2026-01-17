"use client";

import { useState } from "react";
import { MoreVertical, Shield, User, Check, Loader2, Zap, PenTool, Briefcase, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    userId: string;
    currentRole: string;
    currentUserName: string;
}

export default function UserActionMenu({ userId, currentRole, currentUserName }: Props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [pendingRole, setPendingRole] = useState<string | null>(null);

    const roles = [
        { id: "SUPER_ADMIN", label: "সুপার অ্যাডমিন", icon: Zap, color: "text-amber-600 bg-amber-50" },
        { id: "ADMIN", label: "অ্যাডমিন", icon: Shield, color: "text-purple-600 bg-purple-50" },
        { id: "MANAGER", label: "ম্যানেজার", icon: Briefcase, color: "text-blue-600 bg-blue-50" },
        { id: "EDITOR", label: "এডিটর", icon: PenTool, color: "text-emerald-600 bg-emerald-50" },
        { id: "USER", label: "সাধারণ সদস্য", icon: User, color: "text-gray-600 bg-gray-50" },
    ];

    const initiateRoleUpdate = (newRole: string) => {
        if (newRole === currentRole) return;

        // Show modal for ALL roles as requested
        setPendingRole(newRole);
        setIsOpen(false);
        setShowConfirmModal(true);
    };

    const executeRoleUpdate = async (newRole: string) => {
        setLoading(true);
        setIsOpen(false);
        setShowConfirmModal(false);

        try {
            const res = await fetch("/api/admin/users/role", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newRole }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || "Something went wrong");
                setShowErrorModal(true);
                return;
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to update role");
            setShowErrorModal(true);
        } finally {
            setLoading(false);
            setPendingRole(null);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="রোল পরিবর্তন করুন"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                            রোল পরিবর্তন করুন
                        </div>

                        <div className="flex flex-col gap-0.5">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => initiateRoleUpdate(role.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${currentRole === role.id
                                        ? role.color
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <role.icon className="w-4 h-4" />
                                    {role.label}
                                    {currentRole === role.id && <Check className="w-3 h-3 ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Custom Confirmation Modal */}
            {showConfirmModal && pendingRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200 border border-gray-100">

                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-7 h-7 text-amber-600" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                রোল পরিবর্তনের নিশ্চিতকরণ
                            </h3>

                            <p className="text-gray-500 mb-6">
                                আপনি কি নিশ্চিত যে <span className="font-semibold text-gray-900">{currentUserName}</span>-কে <span className="font-bold text-amber-600">{pendingRole}</span> বানাতে চান?
                                <br />
                                <span className="text-xs text-amber-600/80 mt-1 block">এটি একটি সংবেদনশীল পরিবর্তন।</span>
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                                >
                                    না, বাতিল করুন
                                </button>
                                <button
                                    onClick={() => executeRoleUpdate(pendingRole)}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-600/30"
                                >
                                    হ্যাঁ, নিশ্চিত
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200 border border-red-100">

                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-600" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                সমস্যা হয়েছে!
                            </h3>

                            <p className="text-gray-500 mb-6">
                                {errorMessage}
                            </p>

                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
                            >
                                ঠিক আছে
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
