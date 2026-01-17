"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Loader2, Music, Users, GraduationCap, Briefcase, Award } from "lucide-react";
import Image from "next/image";

interface BiographySettings {
    heroTitle: string;
    heroDescription: string;
    bornDate: string;
    bornPlace: string;
    deathDate: string;
    occupation: string;
    earlyLife: string;
    philosophy: string;
    career: string;
    deathSection: string;
    timeline: Array<{ year: string; title: string; desc: string }>;
    organizations: Array<{ name: string; description: string; icon: string }>;
    quotes: string[];
    awards: string[];
    literaryWorks: {
        poetry: string[];
        songs: string[];
    };
}

export default function AdminBiographyPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<BiographySettings>({
        heroTitle: "",
        heroDescription: "",
        bornDate: "",
        bornPlace: "",
        deathDate: "",
        occupation: "",
        earlyLife: "",
        philosophy: "",
        career: "",
        deathSection: "",
        timeline: [],
        organizations: [],
        quotes: [],
        awards: [],
        literaryWorks: { poetry: [], songs: [] }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/biography");
            const data = await res.json();
            if (res.ok) {
                // Parse JSON fields if they come as strings, or default to empty arrays
                const parsedData = {
                    ...data,
                    // If the API returns the JSON fields directly (which Prisma does), use them.
                    // If they are missing, default to empty.
                    timeline: data.timeline || [],
                    organizations: data.organizations || [],
                    quotes: data.quotes || [],
                    awards: data.awards || [],
                    literaryWorks: data.literaryWorks || { poetry: [], songs: [] }
                };
                setSettings(parsedData);
            }
        } catch (error) {
            console.error("Failed to fetch biography settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/biography", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert("Biography updated successfully!");
            } else {
                const err = await res.json();
                alert("Failed to save: " + err.error);
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof BiographySettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    // Helper for Timeline
    const addTimelineItem = () => {
        setSettings(prev => ({
            ...prev,
            timeline: [...prev.timeline, { year: "", title: "", desc: "" }]
        }));
    };
    const updateTimelineItem = (index: number, field: string, value: string) => {
        const newTimeline = [...settings.timeline];
        newTimeline[index] = { ...newTimeline[index], [field]: value };
        setSettings(prev => ({ ...prev, timeline: newTimeline }));
    };
    const removeTimelineItem = (index: number) => {
        setSettings(prev => ({
            ...prev,
            timeline: prev.timeline.filter((_, i) => i !== index)
        }));
    };

    // Helper for Organizations
    const addOrganization = () => {
        setSettings(prev => ({
            ...prev,
            organizations: [...prev.organizations, { name: "", description: "", icon: "Users" }]
        }));
    };
    const updateOrganization = (index: number, field: string, value: string) => {
        const newOrgs = [...settings.organizations];
        newOrgs[index] = { ...newOrgs[index], [field]: value };
        setSettings(prev => ({ ...prev, organizations: newOrgs }));
    };
    const removeOrganization = (index: number) => {
        setSettings(prev => ({
            ...prev,
            organizations: prev.organizations.filter((_, i) => i !== index)
        }));
    };

    // Helper for Arrays (Quotes, Awards)
    const addArrayItem = (field: 'quotes' | 'awards') => {
        setSettings(prev => ({
            ...prev,
            [field]: [...prev[field], ""]
        }));
    };
    const updateArrayItem = (field: 'quotes' | 'awards', index: number, value: string) => {
        const newArray = [...settings[field]];
        newArray[index] = value;
        setSettings(prev => ({ ...prev, [field]: newArray }));
    };
    const removeArrayItem = (field: 'quotes' | 'awards', index: number) => {
        setSettings(prev => ({
            ...prev,
            [field]: settings[field].filter((_, i) => i !== index)
        }));
    };

    // Helper for Literary Works
    const addLiteraryWork = (type: 'poetry' | 'songs') => {
        setSettings(prev => ({
            ...prev,
            literaryWorks: {
                ...prev.literaryWorks,
                [type]: [...prev.literaryWorks[type], ""]
            }
        }));
    };
    const updateLiteraryWork = (type: 'poetry' | 'songs', index: number, value: string) => {
        const newList = [...settings.literaryWorks[type]];
        newList[index] = value;
        setSettings(prev => ({
            ...prev,
            literaryWorks: {
                ...prev.literaryWorks,
                [type]: newList
            }
        }));
    };
    const removeLiteraryWork = (type: 'poetry' | 'songs', index: number) => {
        setSettings(prev => ({
            ...prev,
            literaryWorks: {
                ...prev.literaryWorks,
                [type]: prev.literaryWorks[type].filter((_, i) => i !== index)
            }
        }));
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                        জীবনী সম্পাদনা
                    </h1>
                    <p className="text-sm text-gray-500">
                        জীবনী পাতার সকল তথ্য এখান থেকে পরিবর্তন করুন
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    সংরক্ষণ করুন
                </button>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto pb-12">
                {/* Hero Section */}
                <SectionCard title="হিরো সেকশন" icon={<Award className="w-5 h-5 text-primary-600" />}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputGroup label="শিরোনাম (Title)" value={settings.heroTitle} onChange={(e: any) => handleChange('heroTitle', e.target.value)} />
                        <InputGroup label="পেশা/পরিচয় (Occupation)" value={settings.occupation} onChange={(e: any) => handleChange('occupation', e.target.value)} />
                        <InputGroup label="জন্ম তারিখ" value={settings.bornDate} onChange={(e: any) => handleChange('bornDate', e.target.value)} />
                        <InputGroup label="জন্মস্থান" value={settings.bornPlace} onChange={(e: any) => handleChange('bornPlace', e.target.value)} />
                        <InputGroup label="মৃত্যু তারিখ" value={settings.deathDate} onChange={(e: any) => handleChange('deathDate', e.target.value)} />
                        <div className="md:col-span-2">
                            <InputGroup label="সংক্ষিপ্ত বর্ণনা (Description)" value={settings.heroDescription} onChange={(e: any) => handleChange('heroDescription', e.target.value)} textarea />
                        </div>
                    </div>
                </SectionCard>

                {/* Main Biography Text Sections */}
                <SectionCard title="বিস্তারিত জীবনী" icon={<Briefcase className="w-5 h-5 text-primary-600" />}>
                    <div className="space-y-6">
                        <InputGroup label="জন্ম ও প্রাথমিক জীবন" value={settings.earlyLife} onChange={(e: any) => handleChange('earlyLife', e.target.value)} textarea rows={5} />
                        <InputGroup label="দর্শন ও সাহিত্যভাবনা" value={settings.philosophy} onChange={(e: any) => handleChange('philosophy', e.target.value)} textarea rows={5} />
                        <InputGroup label="কর্মজীবন" value={settings.career} onChange={(e: any) => handleChange('career', e.target.value)} textarea rows={5} />
                        <InputGroup label="মহাপ্রয়াণ" value={settings.deathSection} onChange={(e: any) => handleChange('deathSection', e.target.value)} textarea rows={4} />
                    </div>
                </SectionCard>

                {/* Timeline */}
                <SectionCard title="জীবন পথরেখা (Timeline)" icon={<GraduationCap className="w-5 h-5 text-primary-600" />}>
                    <div className="space-y-4">
                        {settings.timeline.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex-1 grid md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="সাল (যেমন: ১৯৫৪)"
                                        value={item.year}
                                        onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                                    />
                                    <input
                                        type="text"
                                        placeholder="শিরোনাম"
                                        value={item.title}
                                        onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                                    />
                                    <input
                                        type="text"
                                        placeholder="বিবরণ"
                                        value={item.desc}
                                        onChange={(e) => updateTimelineItem(index, 'desc', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                                    />
                                </div>
                                <button
                                    onClick={() => removeTimelineItem(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addTimelineItem}
                            className="flex items-center gap-2 text-primary-600 font-medium px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            নতুন যোগ করুন
                        </button>
                    </div>
                </SectionCard>

                {/* Organizations */}
                <SectionCard title="প্রতিষ্ঠিত সংগঠন" icon={<Users className="w-5 h-5 text-primary-600" />}>
                    <div className="space-y-4">
                        {settings.organizations.map((org, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex-1 space-y-3">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="নাম"
                                            value={org.name}
                                            onChange={(e) => updateOrganization(index, 'name', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                                        />
                                        <select
                                            value={org.icon}
                                            onChange={(e) => updateOrganization(index, 'icon', e.target.value)}
                                            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                                        >
                                            <option value="Users">Users Icon</option>
                                            <option value="Music">Music Icon</option>
                                            <option value="BookOpen">Book Icon</option>
                                        </select>
                                    </div>
                                    <textarea
                                        placeholder="বিবরণ"
                                        value={org.description}
                                        onChange={(e) => updateOrganization(index, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                                        rows={2}
                                    />
                                </div>
                                <button
                                    onClick={() => removeOrganization(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addOrganization}
                            className="flex items-center gap-2 text-primary-600 font-medium px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            নতুন যোগ করুন
                        </button>
                    </div>
                </SectionCard>

                {/* Literary Works */}
                <SectionCard title="সাহিত্যকর্ম" icon={<Music className="w-5 h-5 text-primary-600" />}>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">কাব্যগ্রন্থ</h4>
                            <div className="space-y-2">
                                {settings.literaryWorks.poetry.map((work, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={work}
                                            onChange={(e) => updateLiteraryWork('poetry', index, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-sm"
                                        />
                                        <button onClick={() => removeLiteraryWork('poetry', index)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addLiteraryWork('poetry')} className="text-sm text-primary-600 flex items-center gap-1 mt-2">
                                    <Plus className="w-3 h-3" /> নতুন বই
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">গানের বই</h4>
                            <div className="space-y-2">
                                {settings.literaryWorks.songs.map((work, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={work}
                                            onChange={(e) => updateLiteraryWork('songs', index, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-sm"
                                        />
                                        <button onClick={() => removeLiteraryWork('songs', index)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addLiteraryWork('songs')} className="text-sm text-primary-600 flex items-center gap-1 mt-2">
                                    <Plus className="w-3 h-3" /> নতুন বই
                                </button>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* Awards & Quotes */}
                <div className="grid md:grid-cols-2 gap-8">
                    <SectionCard title="পুরস্কার ও সম্মাননা" icon={<Award className="w-5 h-5 text-primary-600" />}>
                        <div className="space-y-2">
                            {settings.awards.map((award, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={award}
                                        onChange={(e) => updateArrayItem('awards', index, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-sm"
                                    />
                                    <button onClick={() => removeArrayItem('awards', index)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('awards')} className="text-sm text-primary-600 flex items-center gap-1 mt-2">
                                <Plus className="w-3 h-3" /> নতুন পুরস্কার
                            </button>
                        </div>
                    </SectionCard>

                    <SectionCard title="বাণী" icon={<Users className="w-5 h-5 text-primary-600" />}>
                        <div className="space-y-2">
                            {settings.quotes.map((quote, index) => (
                                <div key={index} className="flex gap-2">
                                    <textarea
                                        value={quote}
                                        onChange={(e) => updateArrayItem('quotes', index, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-sm"
                                        rows={2}
                                    />
                                    <button onClick={() => removeArrayItem('quotes', index)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('quotes')} className="text-sm text-primary-600 flex items-center gap-1 mt-2">
                                <Plus className="w-3 h-3" /> নতুন বাণী
                            </button>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </>
    );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
                {icon}
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, textarea = false, rows = 3 }: any) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            {textarea ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 transition-all text-sm"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 transition-all text-sm"
                />
            )}
        </div>
    );
}
