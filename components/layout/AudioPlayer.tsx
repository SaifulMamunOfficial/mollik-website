"use client";

import React, { useState } from "react";
import { useAudio } from "@/components/providers/AudioProvider";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Minimize2, Maximize2, Music, Loader2, AlertCircle } from "lucide-react";

export function AudioPlayer() {
    const {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isLoading,
        error,
        togglePlay,
        seek,
        setVolume,
        next,
        prev,
        playlist
    } = useAudio();

    const [isMinimized, setIsMinimized] = useState(false);
    const [prevVolume, setPrevVolume] = useState(0.8);

    if (!currentTrack) return null;

    // Helper to format time (e.g. 125 -> "02:05")
    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        seek(parseFloat(e.target.value));
    };

    const toggleMute = () => {
        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
        } else {
            setVolume(prevVolume);
        }
    };

    // Compact Minimized Player for Mobile/Desktop
    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-[999] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full shadow-2xl p-2 flex items-center gap-3 animate-slide-up transition-all duration-300">
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-primary-600 dark:bg-gold-500 flex items-center justify-center text-white dark:text-gray-950 hover:scale-105 active:scale-95 transition-transform"
                    aria-label={isPlaying ? "গান পজ করুন" : "গান প্লে করুন"}
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                    ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                </button>
                <div className="text-xs max-w-[120px] truncate pr-2">
                    <p className="font-semibold text-gray-900 dark:text-white truncate font-bengali">{currentTrack.title}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] truncate">{currentTrack.artist || "মতিউর রহমান মল্লিক"}</p>
                </div>
                <button
                    onClick={() => setIsMinimized(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mr-1"
                    aria-label="প্লেয়ার বড় করুন"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl animate-slide-up pb-[env(safe-area-inset-bottom)] transition-all">
            <div className="container-custom max-w-7xl mx-auto py-3 px-4 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* 1. Album Art & Song Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial">
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary-100 to-gold-100 dark:from-primary-950 dark:to-gold-950 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-800">
                        {currentTrack.coverImage ? (
                            <img src={currentTrack.coverImage} alt={currentTrack.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <Music className="w-6 h-6 text-primary-600 dark:text-gold-500" />
                        )}
                    </div>
                    <div className="min-w-0 pr-4">
                        <h4 className="font-display font-bold text-sm md:text-base text-gray-900 dark:text-white truncate font-bengali">
                            {currentTrack.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {currentTrack.artist || "কবি মতিউর রহমান মল্লিক"}
                        </p>
                    </div>
                </div>

                {/* 2. Controls & Seekbar */}
                <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl w-full">
                    {/* Control Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prev}
                            disabled={playlist.length <= 1}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="পূর্ববর্তী গান"
                        >
                            <SkipBack className="w-5 h-5 fill-current" />
                        </button>
                        
                        <button
                            onClick={togglePlay}
                            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary-600 dark:bg-gold-500 hover:bg-primary-700 dark:hover:bg-gold-400 flex items-center justify-center text-white dark:text-gray-950 shadow-md hover:scale-105 active:scale-95 transition-all"
                            aria-label={isPlaying ? "গান পজ করুন" : "গান প্লে করুন"}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-5.5 h-5.5 fill-current" />
                            ) : (
                                <Play className="w-5.5 h-5.5 fill-current ml-0.5" />
                            )}
                        </button>

                        <button
                            onClick={next}
                            disabled={playlist.length <= 1}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="পরবর্তী গান"
                        >
                            <SkipForward className="w-5 h-5 fill-current" />
                        </button>
                    </div>

                    {/* Progress Slider */}
                    <div className="flex items-center gap-3 w-full text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeekChange}
                            className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary-600 dark:accent-gold-500"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* 3. Extra Controls (Volume & Minimize) */}
                <div className="hidden md:flex items-center gap-4 flex-1 md:flex-initial justify-end">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMute}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            aria-label={volume === 0 ? "আনমিউট করুন" : "মিউট করুন"}
                        >
                            {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary-600 dark:accent-gold-500"
                        />
                    </div>

                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        aria-label="প্লেয়ার মিনিমাইজ করুন"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile-only minimize button */}
                <div className="absolute top-2 right-4 md:hidden">
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                        aria-label="প্লেয়ার মিনিমাইজ করুন"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </div>
    );
}
