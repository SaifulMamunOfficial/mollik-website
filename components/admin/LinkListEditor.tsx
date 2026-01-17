import { Trash2, Plus, GripVertical } from "lucide-react";

interface LinkItem {
    name: string;
    href: string;
}

interface LinkListEditorProps {
    title: string;
    links: LinkItem[];
    onChange: (links: LinkItem[]) => void;
}

export default function LinkListEditor({ title, links, onChange }: LinkListEditorProps) {
    const handleAdd = () => {
        onChange([...links, { name: "", href: "" }]);
    };

    const handleRemove = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        onChange(newLinks);
    };

    const handleChange = (index: number, key: keyof LinkItem, value: string) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [key]: value };
        onChange(newLinks);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium border border-emerald-100"
                >
                    <Plus size={16} />
                    নতুন যোগ করুন
                </button>
            </div>

            <div className="space-y-3">
                {links.map((link, index) => (
                    <div key={index} className="flex gap-3 group items-start">
                        <div className="mt-3 text-gray-400 cursor-move">
                            <GripVertical size={20} />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="লিংকের নাম (যেমন: ব্লগ)"
                                value={link.name}
                                onChange={(e) => handleChange(index, "name", e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                            />
                            <input
                                type="text"
                                placeholder="লিংক URL (যেমন: /blog)"
                                value={link.href}
                                onChange={(e) => handleChange(index, "href", e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-code"
                            />
                        </div>
                        <button
                            onClick={() => handleRemove(index)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                            title="মুছে ফেলুন"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {links.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-gray-500 text-sm">কোনো লিংক যোগ করা হয়নি</p>
                    </div>
                )}
            </div>
        </div>
    );
}
