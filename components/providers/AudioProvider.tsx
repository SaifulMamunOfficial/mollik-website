"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface Track {
    id: string;
    title: string;
    slug: string;
    artist?: string | null;
    album?: string | null;
    albumSlug?: string | null;
    duration?: string | null;
    audioUrl: string;
    coverImage?: string | null;
}

interface AudioContextType {
    currentTrack: Track | null;
    playlist: Track[];
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isLoading: boolean;
    error: string | null;
    play: (track: Track, newPlaylist?: Track[]) => void;
    pause: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
    next: () => void;
    prev: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.8);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio Element
    useEffect(() => {
        audioRef.current = new Audio();
        
        // Load saved volume
        const savedVolume = localStorage.getItem("audio-volume");
        if (savedVolume) {
            const vol = parseFloat(savedVolume);
            audioRef.current.volume = vol;
            setVolumeState(vol);
        }

        // Event Listeners
        const audio = audioRef.current;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onDurationChange = () => setDuration(audio.duration || 0);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onWaiting = () => setIsLoading(true);
        const onPlaying = () => {
            setIsLoading(false);
            setError(null);
        };
        const onError = () => {
            setIsLoading(false);
            setError("অডিও ফাইলটি লোড করা সম্ভব হয়নি।");
            setIsPlaying(false);
        };
        const onEnded = () => {
            setIsPlaying(false);
            // Auto play next song if available in playlist
            next();
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("durationchange", onDurationChange);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("waiting", onWaiting);
        audio.addEventListener("playing", onPlaying);
        audio.addEventListener("error", onError);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.pause();
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("durationchange", onDurationChange);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("waiting", onWaiting);
            audio.removeEventListener("playing", onPlaying);
            audio.removeEventListener("error", onError);
            audio.removeEventListener("ended", onEnded);
        };
    }, [playlist]);

    // Handle track source change
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        const isSameTrack = audioRef.current.src === currentTrack.audioUrl;
        if (!isSameTrack) {
            audioRef.current.src = currentTrack.audioUrl;
            audioRef.current.load();
        }

        if (isPlaying) {
            setIsLoading(true);
            audioRef.current.play().catch((err) => {
                console.warn("Playback failed due to browser autoplay policy:", err);
                setIsPlaying(false);
                setIsLoading(false);
            });
        }
    }, [currentTrack]);

    const play = (track: Track, newPlaylist?: Track[]) => {
        if (newPlaylist) {
            setPlaylist(newPlaylist);
        } else if (!playlist.some(t => t.id === track.id)) {
            setPlaylist(prev => [...prev, track]);
        }
        
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (!currentTrack) return;
        if (isPlaying) {
            pause();
        } else {
            setIsPlaying(true);
            if (audioRef.current) {
                setIsLoading(true);
                audioRef.current.play().catch(() => {
                    setIsPlaying(false);
                    setIsLoading(false);
                });
            }
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (vol: number) => {
        const safeVol = Math.max(0, Math.min(1, vol));
        setVolumeState(safeVol);
        if (audioRef.current) {
            audioRef.current.volume = safeVol;
        }
        localStorage.setItem("audio-volume", safeVol.toString());
    };

    const next = () => {
        if (playlist.length <= 1 || !currentTrack) return; // playlist.length === 1 or 0 is no-op
        const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
        if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
            play(playlist[currentIndex + 1]);
        }
    };

    const prev = () => {
        if (playlist.length <= 1 || !currentTrack) return; // playlist.length === 1 or 0 is no-op
        const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
        if (currentIndex > 0) {
            play(playlist[currentIndex - 1]);
        }
    };

    return (
        <AudioContext.Provider
            value={{
                currentTrack,
                playlist,
                isPlaying,
                currentTime,
                duration,
                volume,
                isLoading,
                error,
                play,
                pause,
                togglePlay,
                seek,
                setVolume,
                next,
                prev,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
