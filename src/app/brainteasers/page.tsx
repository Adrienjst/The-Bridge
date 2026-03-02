"use client";

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Search, Brain, Shuffle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import brainteasersData from '@/data/brainteasers.json';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Brainteaser {
    id: string;
    category: string;
    difficulty: Difficulty;
    mechanics: string[];
    question: { fr: string; en: string; };
    solution: { fr: string; en: string; };
}

const brainteasers = brainteasersData as Brainteaser[];

const diffColors: Record<Difficulty, { bg: string; text: string; border: string }> = {
    Easy: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' },
    Medium: { bg: 'rgba(234,179,8,0.1)', text: '#eab308', border: 'rgba(234,179,8,0.2)' },
    Hard: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
};

export default function BrainteasersHub() {
    const { t, locale } = useLanguage();
    const { isBrainteaserSolved, progress } = useProgress();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [showUnsolvedOnly, setShowUnsolvedOnly] = useState(false);

    const solvedCount = progress.solvedBrainteasers.length;
    const totalCount = brainteasers.length;
    const solvedPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    const categories = useMemo(() => {
        const cats = new Set(brainteasers.map(b => b.category));
        return ['All', ...Array.from(cats)];
    }, []);

    const filteredTeasers = useMemo(() => {
        return brainteasers.filter(teaser => {
            const matchesCategory = selectedCategory === 'All' || teaser.category === selectedCategory;
            const matchesDifficulty = selectedDifficulty === 'All' || teaser.difficulty === selectedDifficulty;
            const matchesUnsolved = !showUnsolvedOnly || !isBrainteaserSolved(teaser.id);
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                teaser.question.en.toLowerCase().includes(searchLower) ||
                teaser.question.fr.toLowerCase().includes(searchLower) ||
                teaser.mechanics.some(m => m.toLowerCase().includes(searchLower)) ||
                teaser.category.toLowerCase().includes(searchLower);
            return matchesCategory && matchesDifficulty && matchesSearch && matchesUnsolved;
        });
    }, [searchTerm, selectedCategory, selectedDifficulty, showUnsolvedOnly, isBrainteaserSolved]);

    const handleStartRandom = () => {
        const pool = filteredTeasers.length > 0 ? filteredTeasers : brainteasers;
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        router.push(`/brainteasers/simulator?id=${randomItem.id}`);
    };

    const handleStartSpecific = (id: string) => {
        router.push(`/brainteasers/simulator?id=${id}`);
    };

    const selectStyle: React.CSSProperties = {
        padding: '0.6rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        fontFamily: 'inherit',
        outline: 'none',
        cursor: 'pointer',
        minWidth: 170,
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 44, height: 44, borderRadius: 12,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                        }}>
                            <Brain size={22} color="white" />
                        </span>
                        {t({ fr: 'Brainteasers Hub', en: 'Brainteasers Hub' })}
                    </h1>
                    <p className="page-subtitle" style={{ maxWidth: 600 }}>
                        {t({
                            fr: 'Une base de données de problèmes quantitatifs, logiques et mathématiques pour exceller en entretien.',
                            en: 'A database of quantitative, logic, and math problems to ace your financial interviews.'
                        })}
                    </p>
                    {/* Progress bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div className="progress-bar-container" style={{ flex: 1, maxWidth: 250 }}>
                            <div className="progress-bar-fill" style={{ width: `${solvedPercent}%`, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {solvedCount}/{totalCount} {t({ fr: 'résolus', en: 'solved' })}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleStartRandom}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.5rem', borderRadius: 12,
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        border: 'none', color: 'white', fontSize: '0.95rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <Shuffle size={18} />
                    {t({ fr: 'Lancer au Hasard', en: 'Play Random' })}
                </button>
            </div>

            {/* Search & Filters */}
            <div className="glass-card-static" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder={t({ fr: 'Rechercher (probabilité, logique, options...)', en: 'Search (probability, logic, options...)' })}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: 10, outline: 'none',
                                color: 'var(--text-primary)', fontSize: '0.85rem',
                                fontFamily: 'inherit',
                            }}
                        />
                    </div>

                    {/* Category */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={selectStyle}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'All' ? t({ fr: 'Toutes catégories', en: 'All Categories' }) : cat}
                            </option>
                        ))}
                    </select>

                    {/* Difficulty */}
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="All">{t({ fr: 'Toutes difficultés', en: 'All Difficulties' })}</option>
                        <option value="Easy">{t({ fr: 'Facile', en: 'Easy' })}</option>
                        <option value="Medium">{t({ fr: 'Moyen', en: 'Medium' })}</option>
                        <option value="Hard">{t({ fr: 'Difficile', en: 'Hard' })}</option>
                    </select>

                    {/* Unsolved filter */}
                    <button
                        onClick={() => setShowUnsolvedOnly(!showUnsolvedOnly)}
                        className={`btn ${showUnsolvedOnly ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                    >
                        {showUnsolvedOnly
                            ? t({ fr: '✓ Non résolus', en: '✓ Unsolved' })
                            : t({ fr: 'Non résolus', en: 'Unsolved' })
                        }
                    </button>
                </div>
            </div>

            {/* Count */}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '1rem' }}>
                {filteredTeasers.length} {t({ fr: 'problèmes trouvés', en: 'problems found' })}
            </p>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {filteredTeasers.length > 0 ? (
                    filteredTeasers.slice(0, 100).map(teaser => {
                        const dc = diffColors[teaser.difficulty];
                        return (
                            <div
                                key={teaser.id}
                                onClick={() => handleStartSpecific(teaser.id)}
                                className="glass-card"
                                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}
                            >
                                {/* Tags */}
                                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                                        background: dc.bg, color: dc.text, border: `1px solid ${dc.border}`,
                                    }}>{teaser.difficulty}</span>
                                    <span style={{
                                        padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
                                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
                                        border: '1px solid var(--border)',
                                    }}>{teaser.category}</span>
                                    {isBrainteaserSolved(teaser.id) && (
                                        <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#34d399' }} />
                                    )}
                                    <span style={{
                                        marginLeft: isBrainteaserSolved(teaser.id) ? '0.3rem' : 'auto', fontSize: '0.65rem', fontFamily: 'monospace',
                                        color: 'var(--text-muted)', opacity: 0.5,
                                    }}>{teaser.id}</span>
                                </div>

                                {/* Question */}
                                <h3 style={{
                                    fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.55,
                                    color: 'var(--text-primary)', flex: 1,
                                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {locale === 'fr' ? teaser.question.fr : teaser.question.en}
                                </h3>

                                {/* Mechanics Tags */}
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                                    {teaser.mechanics.slice(0, 3).map(mech => (
                                        <span key={mech} style={{
                                            fontSize: '0.7rem', fontWeight: 500, padding: '0.15rem 0.5rem',
                                            borderRadius: 6, background: 'rgba(99,102,241,0.08)',
                                            color: '#818cf8',
                                        }}>#{mech}</span>
                                    ))}
                                    {teaser.mechanics.length > 3 && (
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            +{teaser.mechanics.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{
                        gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)', borderRadius: 16,
                        border: '1px dashed var(--border)',
                    }}>
                        <Search size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            {t({ fr: 'Aucun problème trouvé', en: 'No problems found' })}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
                            {t({ fr: 'Essayez de réduire vos filtres ou d\'utiliser des mots-clés plus larges.', en: 'Try reducing your filters or using broader keywords.' })}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
