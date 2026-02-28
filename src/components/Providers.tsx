'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <ProgressProvider>
                {children}
            </ProgressProvider>
        </LanguageProvider>
    );
}
