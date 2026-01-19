import { Suspense } from 'react';
import ProfileClient from './ProfileClient';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">প্রোফাইল লোড হচ্ছে...</p>
                    </div>
                </main>
            </>
        }>
            <ProfileClient />
        </Suspense>
    );
}
