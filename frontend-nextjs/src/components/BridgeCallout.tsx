'use client';

import Link from 'next/link';
import { Target, Briefcase, ArrowRight } from 'lucide-react';
import { useLanguage, Bilingual } from '@/contexts/LanguageContext';

interface BridgeCalloutProps {
    interview?: Bilingual;
    desk?: Bilingual;
    practiceLink?: string;
    practiceLabel?: Bilingual;
}

export default function BridgeCallout({ interview, desk, practiceLink, practiceLabel }: BridgeCalloutProps) {
    const { t } = useLanguage();

    if (!interview && !desk && !practiceLink) return null;

    return (
        <div style={{
            marginTop: '2rem',
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.04), rgba(59,130,246,0.04))',
            border: '1px solid rgba(139,92,246,0.12)',
            borderRadius: 14,
            borderLeft: '3px solid #8b5cf6',
        }}>
            <h4 style={{
                fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: '#a78bfa', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
                🌉 {t({ fr: 'Faire le pont', en: 'Bridge to Practice' })}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {interview && (
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <Target size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {t({ fr: 'En entretien', en: 'In an interview' })}
                            </span>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.2rem' }}>
                                {t(interview)}
                            </p>
                        </div>
                    </div>
                )}

                {desk && (
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <Briefcase size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {t({ fr: 'En desk', en: 'On the desk' })}
                            </span>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.2rem' }}>
                                {t(desk)}
                            </p>
                        </div>
                    </div>
                )}

                {practiceLink && (
                    <Link href={practiceLink} style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 0.85rem', borderRadius: 8,
                            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
                            color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.15s ease', width: 'fit-content',
                        }}>
                            <ArrowRight size={14} />
                            {practiceLabel ? t(practiceLabel) : t({ fr: 'Pratiquer maintenant', en: 'Practice now' })}
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
