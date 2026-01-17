"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter, Zap, Shield, Briefcase, PenTool, User, Users, Check } from "lucide-react";

const roles = [
    { id: "ALL", label: "সবাই", icon: Users, color: "text-gray-600 bg-gray-50" },
    { id: "SUPER_ADMIN", label: "সুপার অ্যাডমিন", icon: Zap, color: "text-amber-600 bg-amber-50" },
    { id: "ADMIN", label: "অ্যাডমিন", icon: Shield, color: "text-purple-600 bg-purple-50" },
    { id: "MANAGER", label: "ম্যানেজার", icon: Briefcase, color: "text-blue-600 bg-blue-50" },
    { id: "EDITOR", label: "এডিটর", icon: PenTool, color: "text-emerald-600 bg-emerald-50" },
    { id: "USER", label: "সাধারণ সদস্য", icon: User, color: "text-gray-500 bg-gray-50" },
];

export default function UserFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRole = searchParams.get("role") || "ALL";
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedRole = roles.find(r => r.id === currentRole) || roles[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFilterChange = (role: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (role === "ALL") {
            params.delete("role");
        } else {
            params.set("role", role);
        }
        router.push(`/admin/users?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors min-w-[200px]"
            >
                <Filter size={16} className="text-gray-400" />
                <selectedRole.icon size={16} className={selectedRole.color.split(' ')[0]} />
                <span className="text-sm font-medium text-gray-700 flex-1 text-left">{selectedRole.label}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                        রোল অনুযায়ী ফিল্টার
                    </div>
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleFilterChange(role.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${currentRole === role.id
                                    ? role.color
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <role.icon size={16} />
                            {role.label}
                            {currentRole === role.id && <Check size={14} className="ml-auto" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
