import { Users, Shield, User, Mail, Calendar, Zap, Briefcase, PenTool } from 'lucide-react'
import prisma from '@/lib/prisma'
import UserActionMenu from './UserActionMenu'
import UserFilter from './UserFilter'
import { Suspense } from 'react'

async function getUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
                select: {
                    blogPosts: true,
                    comments: true,
                    tributes: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    })
}

interface PageProps {
    searchParams: Promise<{ role?: string }>
}

export default async function UsersPage({ searchParams }: PageProps) {
    const params = await searchParams
    const roleFilter = params.role || 'ALL'
    const allUsers = await getUsers()

    // Filter users based on role
    const users = roleFilter === 'ALL'
        ? allUsers
        : allUsers.filter(u => u.role === roleFilter)

    const admins = allUsers.filter(u => u.role === 'ADMIN')
    const superAdmins = allUsers.filter(u => u.role === 'SUPER_ADMIN')
    const regularUsers = allUsers.filter(u => u.role === 'USER')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ব্যবহারকারী পরিচালনা</h1>
                    <p className="text-gray-600 mt-1">মোট {allUsers.length} জন ব্যবহারকারী</p>
                </div>
                <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse w-96"></div>}>
                    <UserFilter />
                </Suspense>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Users className="text-indigo-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-indigo-700">{users.length}</p>
                            <p className="text-sm text-indigo-600">মোট ব্যবহারকারী</p>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Shield className="text-purple-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-purple-700">{admins.length}</p>
                            <p className="text-sm text-purple-600">অ্যাডমিন</p>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <User className="text-blue-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-blue-700">{regularUsers.length}</p>
                            <p className="text-sm text-blue-600">সাধারণ ব্যবহারকারী</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
                {users.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ব্যবহারকারী</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ইমেইল</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">রোল</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">কার্যকলাপ</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">যোগদান</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">একশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'
                                                }`}>
                                                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.name || 'নাম নেই'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail size={14} />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full
                      ${user.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-700' :
                                                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                                                        user.role === 'EDITOR' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-gray-100 text-gray-700'}
                    `}>
                                            {user.role === 'SUPER_ADMIN' && <Zap size={12} />}
                                            {user.role === 'ADMIN' && <Shield size={12} />}
                                            {user.role === 'MANAGER' && <Briefcase size={12} />}
                                            {user.role === 'EDITOR' && <PenTool size={12} />}

                                            {user.role === 'SUPER_ADMIN' ? 'সুপার অ্যাডমিন' :
                                                user.role === 'ADMIN' ? 'অ্যাডমিন' :
                                                    user.role === 'MANAGER' ? 'ম্যানেজার' :
                                                        user.role === 'EDITOR' ? 'এডিটর' : 'সদস্য'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>{user._count.blogPosts} ব্লগ পোস্ট</div>
                                            <div>{user._count.comments} মন্তব্য</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} />
                                            {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <UserActionMenu
                                            userId={user.id}
                                            currentRole={user.role}
                                            currentUserName={user.name || "User"}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
