"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Lock, Camera, Save, Loader2, Check, X, AlertTriangle, Eye, EyeOff, Shield, Calendar, Upload, ImageIcon } from "lucide-react";
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    createdAt: string;
}

const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "সুপার অ্যাডমিন",
    ADMIN: "অ্যাডমিন",
    MANAGER: "ম্যানেজার",
    EDITOR: "এডিটর",
    USER: "সদস্য",
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/admin/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setName(data.name || "");
                setImage(data.image || "");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setShowSuccess(false);
        setShowError(false);

        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
                setShowError(true);
                return;
            }

            // Update local profile state with new data
            if (profile && data.user) {
                setProfile({
                    ...profile,
                    name: data.user.name,
                    image: data.user.image
                });
            }

            // Dispatch event to notify other components (like header dropdown)
            window.dispatchEvent(new CustomEvent('profileUpdated'));

            setSuccessMessage("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
            setErrorMessage("প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
            setShowError(true);
        } finally {
            setSaving(false);
        }
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || null);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
        // Reset file input so same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCropConfirm = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setUploading(true);
            setIsCropping(false); // Close modal immediately

            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (!croppedImageBlob) {
                throw new Error("Failed to crop image");
            }

            // Convert blob to file
            const file = new File([croppedImageBlob], "profile-image.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || "ছবি আপলোড করতে সমস্যা হয়েছে");
                setShowError(true);
                return;
            }

            // Set the uploaded image URL
            setImage(data.url);

            // Auto-save the profile with new image
            const saveRes = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image: data.url }),
            });

            if (saveRes.ok) {
                const saveData = await saveRes.json();
                if (profile && saveData.user) {
                    setProfile({
                        ...profile,
                        name: saveData.user.name,
                        image: saveData.user.image
                    });
                }
                // Dispatch event to notify other components (like header dropdown)
                window.dispatchEvent(new CustomEvent('profileUpdated'));

                setSuccessMessage("ছবি আপলোড ও সংরক্ষণ হয়েছে!");
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setErrorMessage("ছবি আপলোড করতে সমস্যা হয়েছে");
            setShowError(true);
        } finally {
            setUploading(false);
            setImageSrc(null); // Clear image source
        }
    };

    const handleCropCancel = () => {
        setIsCropping(false);
        setImageSrc(null);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("নতুন পাসওয়ার্ড মিলছে না");
            setShowError(true);
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
            setShowError(true);
            return;
        }

        setSavingPassword(true);
        setShowSuccess(false);
        setShowError(false);

        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
                setShowError(true);
                return;
            }

            setSuccessMessage("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
            setShowSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error changing password:", error);
            setErrorMessage("পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
            setShowError(true);
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
                <p className="text-gray-600 mt-1">আপনার অ্যাকাউন্টের তথ্য পরিচালনা করুন</p>
            </div>

            {/* Cropper Modal */}
            {isCropping && imageSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">ছবি এডিট করুন</h3>
                            <button onClick={handleCropCancel} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="relative flex-1 bg-gray-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="p-4 border-t bg-white space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">জুম:</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleCropCancel}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    বাতিল
                                </button>
                                <button
                                    onClick={handleCropConfirm}
                                    className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <Check size={18} />
                                    সেভ করুন
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shadow-lg animate-in slide-in-from-top fade-in duration-300">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            {/* Error Modal */}
            {showError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95">
                        <button
                            onClick={() => setShowError(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">সমস্যা হয়েছে!</h3>
                            <p className="text-gray-500 mb-6">{errorMessage}</p>
                            <button
                                onClick={() => setShowError(false)}
                                className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl"
                            >
                                ঠিক আছে
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                </div>

                {/* Avatar & Basic Info */}
                <div className="px-6 pb-6 -mt-16 relative">
                    <div className="flex flex-col sm:flex-row gap-5">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl ring-4 ring-white overflow-hidden">
                                {profile?.image && !profile.image.includes('not-found') ? (
                                    <img
                                        src={profile.image}
                                        alt={profile.name || ""}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : null}
                                <span className={profile?.image && !profile.image.includes('not-found') ? 'hidden' : ''}>
                                    {profile?.name?.[0]?.toUpperCase() || "A"}
                                </span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="avatar-upload"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:scale-110 transition-all border border-gray-200 disabled:opacity-50"
                            >
                                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 pt-4 sm:pt-8">
                            <h2 className="text-2xl font-bold text-gray-900">{profile?.name || "Unknown"}</h2>
                            <p className="text-gray-500 mt-1">{profile?.email}</p>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                                    <Shield size={14} />
                                    {roleLabels[profile?.role || "USER"]}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                                    <Calendar size={14} />
                                    যোগদান: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("bn-BD") : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">মৌলিক তথ্য</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                পুরো নাম
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ইমেইল
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={profile?.email || ""}
                                    disabled
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                                />
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">ইমেইল পরিবর্তন করা যায় না</p>
                        </div>


                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {saving ? "সংরক্ষণ হচ্ছে..." : "প্রোফাইল সেভ করুন"}
                        </button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <Lock className="text-red-600" size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">পাসওয়ার্ড পরিবর্তন</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                বর্তমান পাসওয়ার্ড
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                নতুন পাসওয়ার্ড
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                পাসওয়ার্ড নিশ্চিত করুন
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {savingPassword ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Lock className="w-5 h-5" />
                            )}
                            {savingPassword ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
