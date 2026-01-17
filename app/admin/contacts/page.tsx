import { Mail, Phone, Eye, Trash2, MailOpen, Reply, Archive, Clock } from 'lucide-react'
// Note: ContactSubmission model needs to be migrated first
// For now, showing static layout with empty state

export default async function ContactsPage() {
    // Once schema is migrated, uncomment:
    // const contacts = await prisma.contactSubmission.findMany({
    //     orderBy: { createdAt: 'desc' },
    // })
    const contacts: any[] = [] // Temporary empty array

    const unreadCount = contacts.filter(c => c.status === 'UNREAD').length
    const totalCount = contacts.length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">যোগাযোগ বার্তা</h1>
                <p className="text-gray-600 mt-1">
                    মোট {totalCount}টি বার্তা
                    {unreadCount > 0 && <span className="text-amber-600"> • {unreadCount}টি অপঠিত</span>}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Mail className="text-blue-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-blue-700">{totalCount}</p>
                            <p className="text-sm text-blue-600">মোট বার্তা</p>
                        </div>
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="text-amber-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-amber-700">{unreadCount}</p>
                            <p className="text-sm text-amber-600">অপঠিত</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Reply className="text-green-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-green-700">
                                {contacts.filter(c => c.status === 'REPLIED').length}
                            </p>
                            <p className="text-sm text-green-600">উত্তর দেওয়া</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Archive className="text-gray-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-gray-700">
                                {contacts.filter(c => c.status === 'ARCHIVED').length}
                            </p>
                            <p className="text-sm text-gray-600">আর্কাইভ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {contacts.length === 0 ? (
                    <div className="text-center py-12">
                        <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-2">কোনো যোগাযোগ বার্তা নেই</p>
                        <p className="text-sm text-gray-400">
                            যখন কেউ contact form পূরণ করবে, বার্তা এখানে দেখা যাবে
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {contacts.map((contact: any) => (
                            <div
                                key={contact.id}
                                className={`p-6 hover:bg-gray-50 ${contact.status === 'UNREAD' ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{contact.subject}</h3>
                                            {contact.status === 'UNREAD' && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                    নতুন
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 line-clamp-2 mb-3">{contact.message}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="font-medium">{contact.name}</span>
                                            <span className="flex items-center gap-1">
                                                <Mail size={14} />
                                                {contact.email}
                                            </span>
                                            {contact.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone size={14} />
                                                    {contact.phone}
                                                </span>
                                            )}
                                            <span>•</span>
                                            <span>{new Date(contact.createdAt).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="বিস্তারিত দেখুন"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                            title="পঠিত হিসেবে চিহ্নিত"
                                        >
                                            <MailOpen size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="মুছুন"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
