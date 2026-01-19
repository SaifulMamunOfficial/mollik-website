'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'

// Types
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => string
    removeToast: (id: string) => void
    updateToast: (id: string, toast: Partial<Omit<Toast, 'id'>>) => void
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Hook
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// Toast Item Component
function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: () => void }) {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setIsVisible(true))

        // Auto dismiss (except loading)
        if (toast.type !== 'loading') {
            const duration = toast.duration || 4000
            const timer = setTimeout(() => {
                handleClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const handleClose = () => {
        setIsLeaving(true)
        setTimeout(onRemove, 300)
    }

    const icons = {
        success: <CheckCircle2 className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        loading: <Loader2 className="w-5 h-5 animate-spin" />
    }

    const styles = {
        success: {
            bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
            icon: 'bg-white/20',
            border: 'border-emerald-400/30'
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500 to-rose-500',
            icon: 'bg-white/20',
            border: 'border-red-400/30'
        },
        warning: {
            bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
            icon: 'bg-white/20',
            border: 'border-amber-400/30'
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
            icon: 'bg-white/20',
            border: 'border-blue-400/30'
        },
        loading: {
            bg: 'bg-gradient-to-r from-gray-700 to-gray-800',
            icon: 'bg-white/20',
            border: 'border-gray-600/30'
        }
    }

    const style = styles[toast.type]

    return (
        <div
            className={`
                relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-sm
                transform transition-all duration-300 ease-out
                ${style.bg} ${style.border}
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            {/* Progress bar for auto-dismiss */}
            {toast.type !== 'loading' && (
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-shrink"
                    style={{ animationDuration: `${toast.duration || 4000}ms` }}
                />
            )}

            <div className="flex items-start gap-3 p-4 pr-12">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${style.icon} flex items-center justify-center text-white`}>
                    {icons[toast.type]}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="text-white font-bold text-sm">{toast.title}</h4>
                    {toast.message && (
                        <p className="text-white/80 text-sm mt-0.5 line-clamp-2">{toast.message}</p>
                    )}
                </div>
            </div>

            {/* Close button */}
            {toast.type !== 'loading' && (
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}

// Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { ...toast, id }])
        return id
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const updateToast = useCallback((id: string, updates: Partial<Omit<Toast, 'id'>>) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem
                            toast={toast}
                            onRemove={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>

            {/* Animation keyframes */}
            <style jsx global>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-shrink {
                    animation: shrink linear forwards;
                }
            `}</style>
        </ToastContext.Provider>
    )
}

// Standalone toast function (for use outside React components)
let toastFn: ToastContextType['addToast'] | null = null
let removeToastFn: ToastContextType['removeToast'] | null = null
let updateToastFn: ToastContextType['updateToast'] | null = null

export function setToastFunctions(
    add: ToastContextType['addToast'],
    remove: ToastContextType['removeToast'],
    update: ToastContextType['updateToast']
) {
    toastFn = add
    removeToastFn = remove
    updateToastFn = update
}

export const toast = {
    success: (title: string, message?: string) => toastFn?.({ type: 'success', title, message }),
    error: (title: string, message?: string) => toastFn?.({ type: 'error', title, message }),
    warning: (title: string, message?: string) => toastFn?.({ type: 'warning', title, message }),
    info: (title: string, message?: string) => toastFn?.({ type: 'info', title, message }),
    loading: (title: string, message?: string) => toastFn?.({ type: 'loading', title, message }),
    dismiss: (id: string) => removeToastFn?.(id),
    update: (id: string, updates: Partial<Omit<Toast, 'id'>>) => updateToastFn?.(id, updates)
}
