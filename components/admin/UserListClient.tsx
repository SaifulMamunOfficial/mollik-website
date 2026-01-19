'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Plus,
    LayoutGrid,
    List as ListIcon,
    Users,
    Shield,
    User as UserIcon,
    Mail,
    Calendar,
    Edit,
    Trash2,
    Briefcase,
    Zap,
    PenTool
} from 'lucide-react';
import Image from 'next/image';

interface User {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
    role: string;
    image: string | null;
    createdAt: Date;
    _count?: {
        writings: number;
        blogPosts: number;
    };
}

interface UserListClientProps {
    users: User[];
}

export default function UserListClient({ users }: UserListClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                (user.name?.toLowerCase().includes(searchLower) || false) ||
                (user.email.toLowerCase().includes(searchLower)) ||
                (user.username?.toLowerCase().includes(searchLower) || false);

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    // Delete Handler
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/users/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
                setDeleteId(null);
            } else {
                alert('মুছতে সমস্যা হয়েছে');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('মুছতে সমস্যা হয়েছে');
        } finally {
            setIsDeleting(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200"><Zap size={12} /> সুপার অ্যাডমিন</span>;
            case 'ADMIN':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"><Shield size={12} /> অ্যাডমিন</span>;
            case 'EDITOR':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"><PenTool size={12} /> এডিটর</span>;
            case 'MANAGER':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"><Briefcase size={12} /> ম্যানেজার</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"><UserIcon size={12} /> সদস্য</span>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ব্যবহারকারী তালিকা</h1>
                    <p className="text-gray-500 mt-1">মোট {filteredUsers.length} জন ব্যবহারকারী</p>
                </div>

                <Link
                    href="/admin/users/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>নতুন ইউজার</span>
                </Link>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-6 z-10 transition-all hover:shadow-md">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="নাম, ইমেইল বা ইউজারনেম খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white"
                    />
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-sm font-medium text-gray-700 min-w-[140px] hover:bg-gray-100 transition-colors"
                    >
                        <option value="all">সব রোল</option>
                        <option value="SUPER_ADMIN">সুপার অ্যাডমিন</option>
                        <option value="ADMIN">অ্যাডমিন</option>
                        <option value="EDITOR">এডিটর</option>
                        <option value="MANAGER">ম্যানেজার</option>
                        <option value="USER">সদস্য</option>
                    </select>

                    <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            title="List View"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">কোনো ব্যবহারকারী পাওয়া যায়নি</h3>
                    <p className="text-gray-500 mt-1">আপনার সার্চ কুয়েরি পরিবর্তন করে দেখুন</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col items-center text-center p-6 relative overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white/0 -z-0" />

                                    <div className="relative z-10 mb-4">
                                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 mx-auto">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name || 'User'}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                                    <UserIcon size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            {getRoleBadge(user.role)}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{user.name || 'নাম নেই'}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-1 flex items-center gap-1.5 justify-center">
                                        <Mail size={12} />
                                        {user.email}
                                    </p>

                                    <div className="w-full grid grid-cols-2 gap-2 mb-6 border-t border-b border-gray-50 py-3">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">লেখা</p>
                                            <p className="text-lg font-bold text-gray-700">{user._count?.writings || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">ব্লগ</p>
                                            <p className="text-lg font-bold text-gray-700">{user._count?.blogPosts || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full">
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Edit size={14} />
                                            এডিট
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(user.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="মুছুন"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ব্যবহারকারী</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">রোল</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">যোগদান</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                        {user.image ? (
                                                            <Image
                                                                src={user.image}
                                                                alt={user.name || ''}
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <UserIcon size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name || 'নাম নেই'}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}`}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(user.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">আপনি কি নিশ্চিত?</h3>
                            <p className="text-gray-500 text-sm">
                                এই ব্যবহারকারীকে সিস্টেম থেকে মুছে ফেলা হবে। এই অ্যাকশনটি সাবধানে করুন।
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting && <span className="animate-spin">⏳</span>}
                                মুছে ফেলুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
