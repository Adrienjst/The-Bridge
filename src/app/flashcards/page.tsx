'use client';

import { useState, useMemo, useEffect } from 'react';
import { flashcards } from '@/data/flashcards';
import { courses } from '@/data/courses';
import { motion } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle, XCircle, Shuffle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import Latex from '@/components/Latex';

export default function FlashcardsPage() {
    const { t } = useLanguage();
    const { markFlashcardKnown, unmarkFlashcardKnown, isFlashcardKnown } = useProgress();
    const [selectedModule, setSelectedModule] = useState<string>('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionKnown, setSessionKnown] = useState<Set<string>>(new Set());
    const [sessionUnknown, setSessionUnknown] = useState<Set<string>>(new Set());

    // Load persisted known flashcards into session state
    useEffect(() => {
        const persistedKnown = new Set(flashcards.filter(f => isFlashcardKnown(f.id)).map(f => f.id));
        setSessionKnown(persistedKnown);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const filteredCards = useMemo(() => {
        return selectedModule === 'all'
            ? flashcards
            : flashcards.filter(f => f.moduleId === selectedModule);
    }, [selectedModule]);

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

    const handleKnown = () => {
        if (currentCard) {
            setSessionKnown(prev => new Set([...prev, currentCard.id]));
            sessionUnknown.delete(currentCard.id);
            setSessionUnknown(new Set(sessionUnknown));
            markFlashcardKnown(currentCard.id); // Persist to context
        }
        handleNext();
    };

    const handleUnknown = () => {
        if (currentCard) {
            setSessionUnknown(prev => new Set([...prev, currentCard.id]));
            sessionKnown.delete(currentCard.id);
            setSessionKnown(new Set(sessionKnown));
            unmarkFlashcardKnown(currentCard.id); // Persist to context
        }
        handleNext();
    };

    const handleShuffle = () => {
        setIsFlipped(false);
        setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
    };

    const handleReset = () => {
        setSessionKnown(new Set());
        setSessionUnknown(new Set());
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleModuleChange = (moduleId: string) => {
        setSelectedModule(moduleId);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    if (!currentCard) return null;

    const progress = ((sessionKnown.size) / filteredCards.length) * 100;
    const courseInfo = courses.find(c => c.id === currentCard.moduleId);

    return (
        <div className="page-container">
            <h1 className="page-title">Flashcards</h1>
            <p className="page-subtitle">{t({ fr: 'Révisez les concepts clés avec des cartes à retourner.', en: 'Review key concepts with flip cards.' })}</p>

            {/* Module Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => handleModuleChange('all')}
                    className={`btn ${selectedModule === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                >
                    {t({ fr: 'Toutes', en: 'All' })} ({flashcards.length})
                </button>
                {courses.map(c => {
                    const count = flashcards.filter(f => f.moduleId === c.id).length;
                    return (
                        <button
                            key={c.id}
                            onClick={() => handleModuleChange(c.id)}
                            className={`btn ${selectedModule === c.id ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                        >
                            {c.icon} M{c.number} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Progress */}
            <div className="glass-card-static" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {t({ fr: 'Carte', en: 'Card' })} {currentIndex + 1} / {filteredCards.length}
                    </span>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                        <span style={{ color: '#34d399' }}>✓ {sessionKnown.size} {t({ fr: 'connues', en: 'known' })}</span>
                        <span style={{ color: '#f87171' }}>✗ {sessionUnknown.size} {t({ fr: 'à revoir', en: 'to review' })}</span>
                    </div>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%`, background: 'var(--gradient-green)' }} />
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

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={handlePrev} className="btn btn-secondary">
                    <ChevronLeft size={18} />
                </button>
                <button onClick={handleUnknown} className="btn btn-secondary" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
                    <XCircle size={18} /> {t({ fr: 'À revoir', en: 'Review' })}
                </button>
                <button onClick={handleKnown} className="btn btn-secondary" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                    <CheckCircle size={18} /> {t({ fr: 'Connue', en: 'Known' })}
                </button>
                <button onClick={handleNext} className="btn btn-secondary">
                    <ChevronRight size={18} />
                </button>
                <button onClick={handleShuffle} className="btn btn-ghost" title={t({ fr: 'Mélanger', en: 'Shuffle' })}>
                    <Shuffle size={18} />
                </button>
                <button onClick={handleReset} className="btn btn-ghost" title={t({ fr: 'Réinitialiser', en: 'Reset' })}>
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>
    );
}
