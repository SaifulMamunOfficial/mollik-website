import { prisma } from "@/lib/prisma";
import { Mail, Trash2, CheckCircle, XCircle, Search } from "lucide-react";
import { toggleSubscriberStatus, deleteSubscriber } from "./actions";

export default async function SubscribersPage() {
    const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">নিউজলেটার সাবস্ক্রাইবার</h1>
                    <p className="text-gray-600 mt-1">
                        মোট {subscribers.length} জন সাবস্ক্রাইবার
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {subscribers.length === 0 ? (
                    <div className="text-center py-12">
                        <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-2">কোনো সাবস্ক্রাইবার নেই</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">ইমেইল</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">স্ট্যাটাস</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">যোগদানের তারিখ</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {subscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {subscriber.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {subscriber.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                    <CheckCircle size={12} />
                                                    সক্রিয়
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    <XCircle size={12} />
                                                    নিষ্ক্রিয়
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(subscriber.createdAt).toLocaleDateString("bn-BD")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <form action={toggleSubscriberStatus.bind(null, subscriber.id, subscriber.isActive)}>
                                                    <button
                                                        type="submit"
                                                        className={`p-2 rounded-lg transition-colors ${subscriber.isActive
                                                                ? "text-orange-600 hover:bg-orange-50"
                                                                : "text-green-600 hover:bg-green-50"
                                                            }`}
                                                        title={subscriber.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                                                    >
                                                        {subscriber.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                    </button>
                                                </form>

                                                <form action={deleteSubscriber.bind(null, subscriber.id)}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="মুছুন"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
