'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LanguageProvider>
                <ProgressProvider>
                    {children}
                </ProgressProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}
