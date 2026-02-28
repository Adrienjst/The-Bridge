'use client';

import { useState, useMemo } from 'react';
import { quizzes } from '@/data/quizzes';
import { courses } from '@/data/courses';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Latex from '@/components/Latex';

export default function QuizPage() {
    const { t } = useLanguage();
    const [selectedModule, setSelectedModule] = useState<string>('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [started, setStarted] = useState(false);

    const filteredQuestions = useMemo(() => {
        return selectedModule === 'all'
            ? quizzes
            : quizzes.filter(q => q.moduleId === selectedModule);
    }, [selectedModule]);

    const currentQuestion = filteredQuestions[currentIndex];

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        setShowExplanation(true);
        if (index === currentQuestion.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 >= filteredQuestions.length) {
            setIsFinished(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setIsFinished(false);
        setStarted(false);
    };

    const handleStart = (mod: string) => {
        setSelectedModule(mod);
        setStarted(true);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setIsFinished(false);
    };

    // Start Screen
    if (!started) {
        return (
            <div className="page-container">
                <h1 className="page-title">Quiz</h1>
                <p className="page-subtitle">{t({ fr: 'Testez vos connaissances sur la structuration de produits.', en: 'Test your knowledge on product structuring.' })}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 600 }}>
                    <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => handleStart('all')}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>🎯 {t({ fr: 'Quiz complet', en: 'Full quiz' })}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{quizzes.length} questions — {t({ fr: 'tous les modules', en: 'all modules' })}</p>
                            </div>
                            <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
                        </div>
                    </div>
                    {courses.map(c => {
                        const count = quizzes.filter(q => q.moduleId === c.id).length;
                        if (count === 0) return null;
                        return (
                            <div key={c.id} className="glass-card" style={{ cursor: 'pointer' }} onClick={() => handleStart(c.id)}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                            {c.icon} Module {c.number} — {t(c.title)}
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} questions</p>
                                    </div>
                                    <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Results Screen
    if (isFinished) {
        const percentage = Math.round((score / filteredQuestions.length) * 100);
        const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪';
        const message = percentage >= 80
            ? t({ fr: 'Excellent !', en: 'Excellent!' })
            : percentage >= 60
                ? t({ fr: 'Bien joué !', en: 'Well done!' })
                : percentage >= 40
                    ? t({ fr: 'Continuez à réviser !', en: 'Keep reviewing!' })
                    : t({ fr: 'Il faut retravailler ce module !', en: 'This module needs more work!' });

        return (
            <div className="page-container">
                <div style={{ maxWidth: 500, margin: '3rem auto', textAlign: 'center' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</div>
                    </motion.div>
                    <h1 className="page-title" style={{ fontSize: '2.25rem' }}>{t({ fr: 'Résultats', en: 'Results' })}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>{message}</p>

                    <div className="glass-card-static" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: percentage >= 60 ? '#34d399' : '#f87171' }}>
                                    {percentage}%
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Score</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                    {score}/{filteredQuestions.length}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t({ fr: 'Bonnes réponses', en: 'Correct answers' })}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button onClick={handleRestart} className="btn btn-primary btn-lg">
                            <RotateCcw size={18} /> {t({ fr: 'Recommencer', en: 'Restart' })}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Question Screen
    const courseInfo = courses.find(c => c.id === currentQuestion.moduleId);

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Quiz</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#34d399' }}>
                        <Trophy size={16} /> {score}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Target size={16} /> {currentIndex + 1}/{filteredQuestions.length}
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="progress-bar-container" style={{ marginBottom: '2rem' }}>
                <div className="progress-bar-fill" style={{
                    width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
                    background: 'var(--gradient-blue)',
                }} />
            </div>

            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                {/* Module Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1rem' }}>{courseInfo?.icon}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Module {courseInfo?.number}</span>
                    <span className={`badge difficulty-${currentQuestion.difficulty}`} style={{ fontSize: '0.65rem' }}>
                        {currentQuestion.difficulty}
                    </span>
                </div>

                {/* Question */}
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    <Latex>{t(currentQuestion.question)}</Latex>
                </h2>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                    {currentQuestion.options.map((option, i) => {
                        let bg = 'rgba(255,255,255,0.03)';
                        let border = 'rgba(255,255,255,0.06)';
                        let color = 'var(--text-secondary)';
                        let icon = null;

                        if (selectedAnswer !== null) {
                            if (i === currentQuestion.correctIndex) {
                                bg = 'rgba(16, 185, 129, 0.1)';
                                border = 'rgba(16, 185, 129, 0.3)';
                                color = '#34d399';
                                icon = <CheckCircle size={18} />;
                            } else if (i === selectedAnswer && i !== currentQuestion.correctIndex) {
                                bg = 'rgba(239, 68, 68, 0.1)';
                                border = 'rgba(239, 68, 68, 0.3)';
                                color = '#f87171';
                                icon = <XCircle size={18} />;
                            }
                        }

                        return (
                            <motion.button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                                whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem 1.25rem',
                                    background: bg,
                                    border: `1px solid ${border}`,
                                    borderRadius: 12,
                                    cursor: selectedAnswer === null ? 'pointer' : 'default',
                                    color: color,
                                    fontSize: '0.9rem',
                                    textAlign: 'left',
                                    width: '100%',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <span style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 8,
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    flexShrink: 0,
                                }}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span style={{ flex: 1 }}>{t(option)}</span>
                                {icon}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card-static"
                        style={{
                            borderLeft: `3px solid ${selectedAnswer === currentQuestion.correctIndex ? '#34d399' : '#f87171'}`,
                            marginBottom: '1.5rem',
                        }}
                    >
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            {t({ fr: 'Explication', en: 'Explanation' })}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <Latex block>{t(currentQuestion.explanation)}</Latex>
                        </p>
                    </motion.div>
                )}

                {/* Next Button */}
                {selectedAnswer !== null && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleNext} className="btn btn-primary">
                            {currentIndex + 1 >= filteredQuestions.length
                                ? t({ fr: 'Voir les résultats', en: 'View results' })
                                : t({ fr: 'Question suivante', en: 'Next question' })}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
