'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Locale = 'fr' | 'en';

export interface Bilingual {
    fr: string;
    en: string;
}

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
    t: (obj: Bilingual | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('fr');

    const toggleLocale = useCallback(() => {
        setLocale(prev => prev === 'fr' ? 'en' : 'fr');
    }, []);

    const t = useCallback((obj: Bilingual | string): string => {
        if (typeof obj === 'string') return obj;
        return obj[locale] || obj.fr;
    }, [locale]);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
