'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Send, RotateCcw, ArrowRight, Loader2, Target, BookOpen, Briefcase, GraduationCap, ChevronRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { structurationCases, StructurationCase } from '@/data/structuration-cases';
import Latex from '@/components/Latex';
import { fetchStreamingResponse } from '@/hooks/useStreamingChat';

type Phase = 'select' | 'brief' | 'work' | 'result';

interface ScoreResult {
    overall: number;
    criteria: {
        label: string;
        score: number;
        max: number;
        feedback: string;
    }[];
    generalFeedback: string;
}

export default function CaseStructurationPage() {
    const { locale, t } = useLanguage();
    const [phase, setPhase] = useState<Phase>('select');
    const [selectedCase, setSelectedCase] = useState<StructurationCase | null>(null);
    const [answer, setAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Timer
    useEffect(() => {
        if (phase !== 'work' || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [phase, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const startCase = (c: StructurationCase) => {
        setSelectedCase(c);
        setPhase('brief');
        setAnswer('');
        setScoreResult(null);
        setError(null);
    };

    const beginWork = () => {
        if (selectedCase) {
            setTimeLeft(selectedCase.timeMinutes * 60);
            setPhase('work');
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    };

    const submitAnswer = async () => {
        if (!answer.trim() || !selectedCase || isLoading) return;
        setIsLoading(true);
        setError(null);

        const scoringPrompt = locale === 'fr'
            ? `Tu es un structureur senior expérimenté qui corrige un exercice de cas pratique. Évalue la réponse du candidat selon cette grille STRICTE et renvoie UNIQUEMENT un JSON valide.

CAS : ${t(selectedCase.brief)}
CONTRAINTES : ${selectedCase.constraints.map(c => t(c)).join(', ')}
PRODUIT ATTENDU : ${selectedCase.expectedProduct}

RÉPONSE DU CANDIDAT :
${answer}

Renvoie UNIQUEMENT ce JSON (pas de texte avant/après) :
{
  "overall": <0-100>,
  "criteria": [
    {"label": "Compréhension du besoin client", "score": <0-20>, "max": 20, "feedback": "..."},
    {"label": "Choix du produit et payoff", "score": <0-20>, "max": 20, "feedback": "..."},
    {"label": "Pricing / intuition de valeur", "score": <0-15>, "max": 15, "feedback": "..."},
    {"label": "Couverture / hedging", "score": <0-15>, "max": 15, "feedback": "..."},
    {"label": "Identification des risques", "score": <0-15>, "max": 15, "feedback": "..."},
    {"label": "Angle commercial / storytelling", "score": <0-15>, "max": 15, "feedback": "..."}
  ],
  "generalFeedback": "Feedback global détaillé avec formules LaTeX si pertinent"
}`
            : `You are a senior experienced structurer grading a practical case exercise. Evaluate the candidate's answer using this STRICT rubric and return ONLY valid JSON.

CASE: ${t(selectedCase.brief)}
CONSTRAINTS: ${selectedCase.constraints.map(c => t(c)).join(', ')}
EXPECTED PRODUCT: ${selectedCase.expectedProduct}

CANDIDATE'S ANSWER:
${answer}

Return ONLY this JSON (no text before/after):
{
  "overall": <0-100>,
  "criteria": [
    {"label": "Understanding client needs", "score": <0-20>, "max": 20, "feedback": "..."},
    {"label": "Product choice and payoff", "score": <0-20>, "max": 20, "feedback": "..."},
    {"label": "Pricing / value intuition", "score": <0-15>, "max": 15, "feedback": "..."},
    {"label": "Hedging / coverage", "score": <0-15>, "max": 15, "feedback": "..."},
    {"label": "Risk identification", "score": <0-15>, "max": 15, "feedback": "..."},
    {"label": "Commercial angle / storytelling", "score": <0-15>, "max": 15, "feedback": "..."}
  ],
  "generalFeedback": "Detailed overall feedback with LaTeX formulas if relevant"
}`;

        try {
            const dataContent = await fetchStreamingResponse(
                [{ role: 'user', content: scoringPrompt }],
                locale,
                'brainteaser'
            );

            // Parse JSON from response
            const jsonMatch = dataContent.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('Invalid scoring response format');

            const parsed = JSON.parse(jsonMatch[0]) as ScoreResult;
            setScoreResult(parsed);
            setPhase('result');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setPhase('select');
        setSelectedCase(null);
        setAnswer('');
        setScoreResult(null);
        setError(null);
    };

    const levelConfig = {
        junior: { icon: GraduationCap, color: '#10b981', label: { fr: 'Junior', en: 'Junior' } },
        confirmed: { icon: Briefcase, color: '#3b82f6', label: { fr: 'Confirmé', en: 'Confirmed' } },
        senior: { icon: Target, color: '#f59e0b', label: { fr: 'Senior', en: 'Senior' } },
    };

    const filteredCases = selectedLevel === 'all'
        ? structurationCases
        : structurationCases.filter(c => c.level === selectedLevel);

    // ─── Case Selection ─────────────────────────
    if (phase === 'select') {
        return (
            <div className="page-container">
                <h1 className="page-title">{t({ fr: 'Case Structuration', en: 'Structuration Case Study' })}</h1>
                <p className="page-subtitle">{t({
                    fr: 'Simulez un vrai cas d\'entretien. Recevez un brief client, structurez votre produit, et obtenez un scoring détaillé par l\'IA.',
                    en: 'Simulate a real interview case. Receive a client brief, structure your product, and get detailed AI scoring.'
                })}</p>

                {/* Level filter */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                        { value: 'all', label: { fr: 'Tous', en: 'All' } },
                        { value: 'junior', label: { fr: '🟢 Junior', en: '🟢 Junior' } },
                        { value: 'confirmed', label: { fr: '🔵 Confirmé', en: '🔵 Confirmed' } },
                        { value: 'senior', label: { fr: '🟡 Senior', en: '🟡 Senior' } },
                    ].map(lvl => (
                        <button
                            key={lvl.value}
                            onClick={() => setSelectedLevel(lvl.value)}
                            className={`btn ${selectedLevel === lvl.value ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                        >
                            {t(lvl.label)} ({lvl.value === 'all' ? structurationCases.length : structurationCases.filter(c => c.level === lvl.value).length})
                        </button>
                    ))}
                </div>

                {/* Cases grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
                    {filteredCases.map(c => {
                        const lvl = levelConfig[c.level];
                        const LvlIcon = lvl.icon;
                        return (
                            <div
                                key={c.id}
                                className="glass-card"
                                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                onClick={() => startCase(c)}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${lvl.color}40`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <LvlIcon size={16} style={{ color: lvl.color }} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: lvl.color, textTransform: 'uppercase' }}>
                                            {t(lvl.label)}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        ⏱ {c.timeMinutes} min
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                                    {t(c.title)}
                                </h3>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                                    {t(c.clientProfile)}
                                </p>
                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                    {c.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '0.6rem', padding: '0.1rem 0.4rem',
                                            borderRadius: 4, background: `${lvl.color}15`, color: lvl.color,
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ─── Brief Screen ─────────────────────────
    if (phase === 'brief' && selectedCase) {
        const lvl = levelConfig[selectedCase.level];
        return (
            <div className="page-container">
                <button onClick={reset} className="btn btn-ghost" style={{ marginBottom: '1rem', fontSize: '0.82rem' }}>
                    ← {t({ fr: 'Retour aux cas', en: 'Back to cases' })}
                </button>

                <div style={{ maxWidth: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: lvl.color, textTransform: 'uppercase' }}>
                            {t(lvl.label)} · ⏱ {selectedCase.timeMinutes} min
                        </span>
                    </div>
                    <h1 className="page-title">{t(selectedCase.title)}</h1>

                    {/* Client profile */}
                    <div className="glass-card-static" style={{ marginBottom: '1.25rem', borderLeft: `3px solid ${lvl.color}` }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: lvl.color, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            👤 {t({ fr: 'Profil Client', en: 'Client Profile' })}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {t(selectedCase.clientProfile)}
                        </p>
                    </div>

                    {/* Brief */}
                    <div className="glass-card-static" style={{ marginBottom: '1.25rem', borderLeft: '3px solid #3b82f6' }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            📋 {t({ fr: 'Votre Mission', en: 'Your Mission' })}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {t(selectedCase.brief)}
                        </p>
                    </div>

                    {/* Constraints */}
                    <div className="glass-card-static" style={{ marginBottom: '1.5rem', borderLeft: '3px solid #f59e0b' }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            ⚠️ {t({ fr: 'Contraintes', en: 'Constraints' })}
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {selectedCase.constraints.map((c, i) => (
                                <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1rem', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: '#fbbf24' }}>•</span>
                                    {t(c)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={beginWork}
                        style={{
                            padding: '0.85rem 2.5rem',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            border: 'none', borderRadius: 12,
                            color: 'white', fontSize: '1rem', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'transform 0.15s ease',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <Timer size={18} />
                        {t({ fr: `Commencer (${selectedCase.timeMinutes} min)`, en: `Start (${selectedCase.timeMinutes} min)` })}
                    </button>
                </div>
            </div>
        );
    }

    // ─── Work Screen ─────────────────────────
    if (phase === 'work' && selectedCase) {
        const timePercentage = (timeLeft / (selectedCase.timeMinutes * 60)) * 100;
        const isLowTime = timeLeft < 120; // < 2 min

        return (
            <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)', padding: '1rem' }}>
                {/* Header with timer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t(selectedCase.title)}</h1>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {t(selectedCase.clientProfile)}
                        </p>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem', borderRadius: 10,
                        background: isLowTime ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.08)',
                        border: `1px solid ${isLowTime ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.15)'}`,
                        color: isLowTime ? '#f87171' : '#60a5fa',
                        fontWeight: 700, fontSize: '1.1rem', fontVariantNumeric: 'tabular-nums',
                        animation: isLowTime ? 'pulse 1s ease-in-out infinite' : 'none',
                    }}>
                        <Timer size={18} />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Timer bar */}
                <div className="progress-bar-container" style={{ marginBottom: '1rem', flexShrink: 0 }}>
                    <div className="progress-bar-fill" style={{
                        width: `${timePercentage}%`,
                        background: isLowTime ? '#ef4444' : 'var(--gradient-blue)',
                        transition: 'width 1s linear',
                    }} />
                </div>

                {/* Answer area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                    <textarea
                        ref={textareaRef}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={t({
                            fr: 'Rédigez votre structuration ici...\n\n• Type de produit proposé\n• Sous-jacent, strike, barrière(s)\n• Mécanisme de coupon\n• Payoff à maturité\n• Risques identifiés\n• Argumentaire commercial',
                            en: 'Write your structuration here...\n\n• Proposed product type\n• Underlying, strike, barrier(s)\n• Coupon mechanism\n• Payoff at maturity\n• Identified risks\n• Commercial pitch'
                        })}
                        style={{
                            flex: 1, resize: 'none', border: '1px solid var(--border)',
                            borderRadius: 14, padding: '1.25rem',
                            background: 'rgba(255,255,255,0.03)', outline: 'none',
                            color: 'var(--text-primary)', fontSize: '0.9rem',
                            fontFamily: 'inherit', lineHeight: 1.7,
                        }}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                        padding: '0.75rem 1rem', marginBottom: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 10, color: '#f87171', fontSize: '0.85rem',
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* Submit */}
                <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                    <button onClick={reset} className="btn btn-secondary">
                        <RotateCcw size={16} />
                        {t({ fr: 'Abandonner', en: 'Abandon' })}
                    </button>
                    <button
                        onClick={submitAnswer}
                        disabled={!answer.trim() || isLoading}
                        style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            padding: '0.75rem 1.5rem', borderRadius: 12,
                            background: answer.trim() && !isLoading ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                            border: 'none', cursor: answer.trim() && !isLoading ? 'pointer' : 'not-allowed',
                            color: answer.trim() && !isLoading ? 'white' : '#475569',
                            fontSize: '0.95rem', fontWeight: 600, fontFamily: 'inherit',
                        }}
                    >
                        {isLoading ? (
                            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> {t({ fr: 'Correction en cours...', en: 'Grading...' })}</>
                        ) : (
                            <><Send size={18} /> {t({ fr: 'Soumettre ma réponse', en: 'Submit my answer' })}</>
                        )}
                    </button>
                </div>

                <style jsx>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                `}</style>
            </div>
        );
    }

    // ─── Results Screen ─────────────────────────
    if (phase === 'result' && scoreResult && selectedCase) {
        const emoji = scoreResult.overall >= 80 ? '🎉' : scoreResult.overall >= 60 ? '👍' : scoreResult.overall >= 40 ? '📚' : '💪';
        const scoreColor = scoreResult.overall >= 80 ? '#34d399' : scoreResult.overall >= 60 ? '#3b82f6' : scoreResult.overall >= 40 ? '#f59e0b' : '#f87171';

        return (
            <div className="page-container">
                {/* Score header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{emoji}</div>
                    </motion.div>
                    <h1 className="page-title" style={{ fontSize: '2rem' }}>{t({ fr: 'Résultats', en: 'Results' })}</h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{t(selectedCase.title)}</p>
                    <div style={{
                        fontSize: '3rem', fontWeight: 800, color: scoreColor,
                        textShadow: `0 0 30px ${scoreColor}30`,
                    }}>
                        {scoreResult.overall}/100
                    </div>
                </div>

                {/* Criteria breakdown */}
                <div style={{ maxWidth: 650, margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                        📊 {t({ fr: 'Détail par critère', en: 'Criteria Breakdown' })}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                        {scoreResult.criteria.map((crit, i) => {
                            const pct = (crit.score / crit.max) * 100;
                            const color = pct >= 80 ? '#34d399' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#f87171';
                            return (
                                <div key={i} className="glass-card-static">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{crit.label}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{crit.score}/{crit.max}</span>
                                    </div>
                                    <div className="progress-bar-container" style={{ marginBottom: '0.5rem' }}>
                                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                        <Latex>{crit.feedback}</Latex>
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* General feedback */}
                    <div className="glass-card-static" style={{ borderLeft: '3px solid #3b82f6', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            💡 {t({ fr: 'Feedback global', en: 'General Feedback' })}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                            <Latex block>{scoreResult.generalFeedback}</Latex>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button onClick={reset} className="btn btn-secondary btn-lg">
                            <BookOpen size={18} />
                            {t({ fr: 'Autre cas', en: 'Another case' })}
                        </button>
                        <button
                            onClick={() => startCase(selectedCase)}
                            className="btn btn-primary btn-lg"
                        >
                            <RotateCcw size={18} />
                            {t({ fr: 'Réessayer ce cas', en: 'Retry this case' })}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
