'use client';

import { useState, useMemo, useEffect } from 'react';
import { flashcards } from '@/data/flashcards';
import { courses } from '@/data/courses';
import { motion } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, Timer, Brain, Zap, CheckCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import Latex from '@/components/Latex';

type ReviewMode = 'all' | 'due';

export default function FlashcardsPage() {
    const { t } = useLanguage();
    const { reviewFlashcard, getDueFlashcards, getSRSStats, progress } = useProgress();
    const [selectedModule, setSelectedModule] = useState<string>('all');
    const [reviewMode, setReviewMode] = useState<ReviewMode>('due');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionReviewed, setSessionReviewed] = useState(0);

    const allIds = useMemo(() => flashcards.map(f => f.id), []);

    const filteredCards = useMemo(() => {
        let cards = selectedModule === 'all'
            ? flashcards
            : flashcards.filter(f => f.moduleId === selectedModule);

        if (reviewMode === 'due') {
            const dueIds = getDueFlashcards(cards.map(c => c.id));
            cards = cards.filter(c => dueIds.includes(c.id));
        }

        return cards;
    }, [selectedModule, reviewMode, getDueFlashcards]);

    const srsStats = useMemo(() => getSRSStats(allIds), [getSRSStats, allIds]);

    // Reset index when cards change
    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [filteredCards.length]);

    const currentCard = filteredCards[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
        }, 150);
    };

    // SRS quality ratings: 0=Again, 3=Hard, 4=Good, 5=Easy
    const handleRate = (quality: number) => {
        if (currentCard) {
            reviewFlashcard(currentCard.id, quality);
            setSessionReviewed(prev => prev + 1);
        }
        // Move to next card
        setIsFlipped(false);
        setTimeout(() => {
            if (filteredCards.length <= 1) {
                // Last card in the batch
                setCurrentIndex(0);
            } else {
                setCurrentIndex((prev) => {
                    // If this was the last card, go back to 0
                    if (prev >= filteredCards.length - 1) return 0;
                    return prev; // stay at same index (card removed from due list will shift)
                });
            }
        }, 150);
    };

    const handleShuffle = () => {
        setIsFlipped(false);
        if (filteredCards.length > 0) {
            setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
        }
    };

    const handleModuleChange = (moduleId: string) => {
        setSelectedModule(moduleId);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const courseInfo = currentCard ? courses.find(c => c.id === currentCard.moduleId) : null;

    // Get SRS info for current card
    const currentSRS = currentCard ? progress.flashcardSRS[currentCard.id] : null;
    const currentInterval = currentSRS?.interval || 0;

    return (
        <div className="page-container">
            <h1 className="page-title">Flashcards</h1>
            <p className="page-subtitle">{t({ fr: 'Révisez avec la répétition espacée — les cartes reviennent au bon moment.', en: 'Review with spaced repetition — cards come back at the right time.' })}</p>

            {/* SRS Stats Bar */}
            <div className="glass-card-static" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{srsStats.due}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {t({ fr: 'À revoir', en: 'Due' })}
                            </div>
                        </div>
                        <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>{srsStats.learning}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {t({ fr: 'En cours', en: 'Learning' })}
                            </div>
                        </div>
                        <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{srsStats.mastered}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {t({ fr: 'Maîtrisées', en: 'Mastered' })}
                            </div>
                        </div>
                    </div>
                    {sessionReviewed > 0 && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            ⚡ {sessionReviewed} {t({ fr: 'revues cette session', en: 'reviewed this session' })}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                    onClick={() => setReviewMode('due')}
                    className={`btn ${reviewMode === 'due' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                    <Timer size={14} />
                    {t({ fr: 'À réviser', en: 'Due for review' })} ({getDueFlashcards(flashcards.filter(f => selectedModule === 'all' || f.moduleId === selectedModule).map(f => f.id)).length})
                </button>
                <button
                    onClick={() => setReviewMode('all')}
                    className={`btn ${reviewMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                    <BookOpen size={14} />
                    {t({ fr: 'Toutes', en: 'All' })} ({flashcards.filter(f => selectedModule === 'all' || f.moduleId === selectedModule).length})
                </button>
            </div>

            {/* Module Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => handleModuleChange('all')}
                    className={`btn ${selectedModule === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}
                >
                    {t({ fr: 'Tous', en: 'All' })}
                </button>
                {courses.map(c => {
                    const count = flashcards.filter(f => f.moduleId === c.id).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={c.id}
                            onClick={() => handleModuleChange(c.id)}
                            className={`btn ${selectedModule === c.id ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}
                        >
                            {c.icon} M{c.number}
                        </button>
                    );
                })}
            </div>

            {/* Empty state */}
            {filteredCards.length === 0 ? (
                <div className="glass-card-static" style={{ padding: '3rem', textAlign: 'center' }}>
                    <CheckCircle size={48} style={{ color: '#34d399', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {t({ fr: '🎉 Tout est à jour !', en: '🎉 All caught up!' })}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {t({
                            fr: 'Aucune carte à revoir pour le moment. Revenez plus tard ou parcourez toutes les cartes.',
                            en: 'No cards due for review right now. Come back later or browse all cards.'
                        })}
                    </p>
                    <button onClick={() => setReviewMode('all')} className="btn btn-secondary">
                        {t({ fr: 'Voir toutes les cartes', en: 'Browse all cards' })}
                    </button>
                </div>
            ) : (
                <>
                    {/* Progress */}
                    <div className="glass-card-static" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {t({ fr: 'Carte', en: 'Card' })} {currentIndex + 1} / {filteredCards.length}
                            </span>
                            {currentSRS && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {t({ fr: 'Intervalle', en: 'Interval' })}: {currentInterval}d | EF: {currentSRS.easeFactor}
                                </span>
                            )}
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{
                                width: `${((currentIndex + 1) / filteredCards.length) * 100}%`,
                                background: 'var(--gradient-blue)',
                            }} />
                        </div>
                    </div>

                    {/* Flashcard */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div
                            onClick={handleFlip}
                            style={{
                                width: '100%',
                                maxWidth: 580,
                                height: 320,
                                perspective: 1000,
                                cursor: 'pointer',
                            }}
                        >
                            <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    transformStyle: 'preserve-3d',
                                    position: 'relative',
                                }}
                            >
                                {/* Front */}
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    background: 'rgba(255,255,255,0.03)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '2rem',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                        <span style={{ fontSize: '1.25rem' }}>{courseInfo?.icon}</span>
                                        <span className={`badge difficulty-${currentCard.difficulty}`} style={{ fontSize: '0.65rem' }}>
                                            {currentCard.difficulty}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.5, color: 'var(--text-primary)' }}>
                                        <Latex>{t(currentCard.question)}</Latex>
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                                        {t({ fr: 'Cliquez pour retourner', en: 'Click to flip' })}
                                    </p>
                                </div>

                                {/* Back */}
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    background: 'rgba(59, 130, 246, 0.04)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(59, 130, 246, 0.15)',
                                    borderRadius: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    padding: '2rem',
                                    overflow: 'auto',
                                }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                                        {t({ fr: 'Réponse', en: 'Answer' })}
                                    </p>
                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                                        <Latex block>{t(currentCard.answer)}</Latex>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* SRS Rating Buttons (shown when flipped) */}
                    {isFlipped ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <button
                                onClick={() => handleRate(0)}
                                style={{
                                    padding: '0.6rem 1.2rem', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)',
                                    background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.82rem',
                                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
                                }}
                            >
                                <span>{t({ fr: 'À revoir', en: 'Again' })}</span>
                                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>1d</span>
                            </button>
                            <button
                                onClick={() => handleRate(3)}
                                style={{
                                    padding: '0.6rem 1.2rem', borderRadius: 10, border: '1px solid rgba(251,191,36,0.3)',
                                    background: 'rgba(251,191,36,0.1)', color: '#fbbf24', fontSize: '0.82rem',
                                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
                                }}
                            >
                                <span>{t({ fr: 'Difficile', en: 'Hard' })}</span>
                                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>
                                    {Math.max(1, Math.round((currentInterval || 1) * 1.2))}d
                                </span>
                            </button>
                            <button
                                onClick={() => handleRate(4)}
                                style={{
                                    padding: '0.6rem 1.2rem', borderRadius: 10, border: '1px solid rgba(96,165,250,0.3)',
                                    background: 'rgba(96,165,250,0.1)', color: '#60a5fa', fontSize: '0.82rem',
                                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
                                }}
                            >
                                <span>{t({ fr: 'Bien', en: 'Good' })}</span>
                                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>
                                    {Math.max(1, Math.round((currentInterval || 1) * (currentSRS?.easeFactor || 2.5)))}d
                                </span>
                            </button>
                            <button
                                onClick={() => handleRate(5)}
                                style={{
                                    padding: '0.6rem 1.2rem', borderRadius: 10, border: '1px solid rgba(52,211,153,0.3)',
                                    background: 'rgba(52,211,153,0.1)', color: '#34d399', fontSize: '0.82rem',
                                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
                                }}
                            >
                                <span>{t({ fr: 'Facile', en: 'Easy' })}</span>
                                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>
                                    {Math.max(1, Math.round((currentInterval || 1) * (currentSRS?.easeFactor || 2.5) * 1.3))}d
                                </span>
                            </button>
                        </div>
                    ) : null}

                    {/* Navigation Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button onClick={handlePrev} className="btn btn-secondary">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={handleFlip} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Brain size={16} />
                            {t({ fr: 'Retourner', en: 'Flip' })}
                        </button>
                        <button onClick={handleNext} className="btn btn-secondary">
                            <ChevronRight size={18} />
                        </button>
                        <button onClick={handleShuffle} className="btn btn-ghost" title={t({ fr: 'Mélanger', en: 'Shuffle' })}>
                            <Shuffle size={18} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
