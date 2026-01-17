"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
    ChevronDown, User, LogOut, Shield, Zap,
    Briefcase, PenTool, ExternalLink
} from "lucide-react";

const roleConfig: Record<string, { label: string; icon: typeof Shield; color: string }> = {
    SUPER_ADMIN: { label: "সুপার অ্যাডমিন", icon: Zap, color: "text-amber-600 bg-amber-50" },
    ADMIN: { label: "অ্যাডমিন", icon: Shield, color: "text-purple-600 bg-purple-50" },
    MANAGER: { label: "ম্যানেজার", icon: Briefcase, color: "text-blue-600 bg-blue-50" },
    EDITOR: { label: "এডিটর", icon: PenTool, color: "text-emerald-600 bg-emerald-50" },
    USER: { label: "সদস্য", icon: User, color: "text-gray-600 bg-gray-50" },
};

interface UserProfile {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
}

export default function AdminProfileDropdown() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch latest profile data from API
    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/admin/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchProfile();
        }
    }, [session]);

    // Listen for profile updates from other components
    useEffect(() => {
        const handleProfileUpdate = () => {
            fetchProfile();
        };

        window.addEventListener('profileUpdated', handleProfileUpdate);
        return () => {
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);

    // Use profile data if available, otherwise fall back to session
    const user = profile || session?.user;
    const role = roleConfig[user?.role || "USER"] || roleConfig.USER;
    const RoleIcon = role.icon;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    if (!user) return null;

    // Render avatar with image or fallback letter
    const renderAvatar = (size: "sm" | "md" | "lg") => {
        const sizeClasses = {
            sm: "w-11 h-11 text-lg",
            md: "w-12 h-12 text-xl",
            lg: "w-12 h-12 text-xl"
        };

        if (user.image) {
            return (
                <div className={`${sizeClasses[size]} rounded-full overflow-hidden ring-2 ring-white shadow-lg shadow-emerald-500/30`}>
                    <img
                        src={user.image}
                        alt={user.name || ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Hide image on error
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {user.name?.[0]?.toUpperCase() || "A"}
                    </div>
                </div>
            );
        }

        return (
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30 ring-2 ring-white transition-transform hover:scale-105`}>
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "A"}
            </div>
        );
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200
                    ${isOpen
                        ? 'bg-gray-100 ring-2 ring-emerald-500/20'
                        : 'hover:bg-gray-50/80 hover:shadow-sm'
                    }
                `}
            >
                {/* Name & Role - Left */}
                <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900 leading-tight tracking-tight">
                        {user.name || "User"}
                    </p>
                    <div className={`inline-flex items-center gap-1 mt-0.5 text-[11px] font-medium ${role.color.split(' ')[0]} opacity-80`}>
                        <RoleIcon size={10} />
                        {role.label}
                    </div>
                </div>

                {/* Avatar - Right */}
                {renderAvatar("sm")}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            {renderAvatar("md")}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                    {user.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        {/* Role Badge */}
                        <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role.color}`}>
                            <RoleIcon size={12} />
                            {role.label}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        <Link
                            href="/admin/profile"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <User size={18} className="text-gray-400" />
                            <span>আমার প্রোফাইল</span>
                        </Link>


                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            <span>লগ আউট</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
