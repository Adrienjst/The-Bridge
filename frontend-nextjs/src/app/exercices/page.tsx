'use client';

import { useState } from 'react';
import { exercises } from '@/data/exercises';
import { courses } from '@/data/courses';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Lightbulb, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import Latex from '@/components/Latex';

export default function ExercicesPage() {
    const { t } = useLanguage();
    const { markExerciseComplete, isExerciseComplete } = useProgress();
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [revealedSteps, setRevealedSteps] = useState<Set<string>>(new Set());
    const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());

    const toggleExercise = (id: string) => {
        setExpandedExercise(prev => prev === id ? null : id);
    };

    const toggleStep = (stepKey: string, exerciseId: string, totalSteps: number) => {
        setRevealedSteps(prev => {
            const next = new Set(prev);
            if (next.has(stepKey)) next.delete(stepKey);
            else next.add(stepKey);
            // Check if all steps of this exercise are revealed
            const exerciseStepKeys = Array.from({ length: totalSteps }, (_, i) => `${exerciseId}-${i}`);
            const allRevealed = exerciseStepKeys.every(k => next.has(k));
            if (allRevealed) {
                markExerciseComplete(exerciseId);
            }
            return next;
        });
    };

    const toggleHint = (stepKey: string) => {
        setRevealedHints(prev => {
            const next = new Set(prev);
            if (next.has(stepKey)) next.delete(stepKey);
            else next.add(stepKey);
            return next;
        });
    };

    return (
        <div className="page-container">
            <h1 className="page-title">{t({ fr: 'Exercices', en: 'Exercises' })}</h1>
            <p className="page-subtitle">{t({ fr: 'Exercices guidés avec solutions étape par étape.', en: 'Guided exercises with step-by-step solutions.' })}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 760 }}>
                {exercises.map((exercise) => {
                    const isExpanded = expandedExercise === exercise.id;
                    const courseInfo = courses.find(c => c.id === exercise.moduleId);

                    return (
                        <div key={exercise.id} className="glass-card-static" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Header */}
                            <button
                                onClick={() => toggleExercise(exercise.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    width: '100%',
                                    padding: '1.25rem 1.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    textAlign: 'left',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{courseInfo?.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{t(exercise.title)}</h3>
                                        <span className={`badge difficulty-${exercise.difficulty}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.45rem' }}>
                                            {exercise.difficulty}
                                        </span>
                                        {isExerciseComplete(exercise.id) && (
                                            <CheckCircle size={16} style={{ color: '#34d399' }} />
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {t(exercise.description)} · {exercise.steps.length} {t({ fr: 'étapes', en: 'steps' })}
                                    </p>
                                </div>
                                {isExpanded ? <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />}
                            </button>

                            {/* Steps */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                                            {exercise.steps.map((step, i) => {
                                                const stepKey = `${exercise.id}-${i}`;
                                                const isRevealed = revealedSteps.has(stepKey);
                                                const isHintRevealed = revealedHints.has(stepKey);

                                                return (
                                                    <div key={i} style={{
                                                        marginTop: '1.25rem',
                                                        paddingBottom: i < exercise.steps.length - 1 ? '1.25rem' : 0,
                                                        borderBottom: i < exercise.steps.length - 1 ? '1px solid var(--border)' : 'none',
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                            <span style={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: 6,
                                                                background: 'rgba(59,130,246,0.15)',
                                                                color: '#60a5fa',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                flexShrink: 0,
                                                                marginTop: 2,
                                                            }}>
                                                                {i + 1}
                                                            </span>
                                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                                                                <Latex>{t(step.instruction)}</Latex>
                                                            </p>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '2.25rem' }}>
                                                            {step.hint && (
                                                                <button
                                                                    onClick={() => toggleHint(stepKey)}
                                                                    className="btn btn-ghost"
                                                                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', color: '#fbbf24' }}
                                                                >
                                                                    <Lightbulb size={14} />
                                                                    {isHintRevealed
                                                                        ? t({ fr: "Cacher l'indice", en: 'Hide hint' })
                                                                        : t({ fr: "Voir l'indice", en: 'Show hint' })}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => toggleStep(stepKey, exercise.id, exercise.steps.length)}
                                                                className="btn btn-ghost"
                                                                style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', color: '#34d399' }}
                                                            >
                                                                {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                                                {isRevealed
                                                                    ? t({ fr: 'Cacher la solution', en: 'Hide solution' })
                                                                    : t({ fr: 'Voir la solution', en: 'Show solution' })}
                                                            </button>
                                                        </div>

                                                        {/* Hint */}
                                                        <AnimatePresence>
                                                            {isHintRevealed && step.hint && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    style={{
                                                                        marginLeft: '2.25rem',
                                                                        marginTop: '0.5rem',
                                                                        padding: '0.75rem 1rem',
                                                                        background: 'rgba(245, 158, 11, 0.06)',
                                                                        border: '1px solid rgba(245, 158, 11, 0.15)',
                                                                        borderRadius: 10,
                                                                        fontSize: '0.85rem',
                                                                        color: '#fbbf24',
                                                                        lineHeight: 1.5,
                                                                    }}
                                                                >
                                                                    💡 <Latex>{t(step.hint)}</Latex>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        {/* Solution */}
                                                        <AnimatePresence>
                                                            {isRevealed && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    style={{
                                                                        marginLeft: '2.25rem',
                                                                        marginTop: '0.5rem',
                                                                        padding: '1rem 1.25rem',
                                                                        background: 'rgba(16, 185, 129, 0.04)',
                                                                        border: '1px solid rgba(16, 185, 129, 0.12)',
                                                                        borderRadius: 10,
                                                                        fontSize: '0.88rem',
                                                                        color: 'var(--text-secondary)',
                                                                        lineHeight: 1.7,
                                                                        whiteSpace: 'pre-wrap',
                                                                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                                                                    }}
                                                                >
                                                                    <Latex block>{t(step.solution)}</Latex>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
