'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Bot, User, Loader2, AlertCircle, Volume2, Keyboard, AudioLines, PhoneOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useStreamingChat, ChatMessage as Message, fetchStreamingResponse } from '@/hooks/useStreamingChat';
import Latex from '@/components/Latex';
import LiveOrb from '@/components/LiveOrb';
import PayoffChart, { PayoffPayload } from '@/components/PayoffChart';

const GlassCursor = () => (
    <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, y: 0, scaleY: 1 }}
        animate={{ opacity: [0, 1, 0.75], y: [0, -6, 0], scaleY: [1, 1.05, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
            width: 10,
            height: 34,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.7)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.15))',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 15px 35px rgba(59, 130, 246, 0.45)',
            pointerEvents: 'none',
        }}
    />
);

const PAYOFF_MARKER = '[[PAYOFF_CHART]]';

function extractPayoffBlock(content: string): { payload: PayoffPayload; cleaned: string } | null {
    const markerIndex = content.indexOf(PAYOFF_MARKER);
    if (markerIndex === -1) return null;

    const before = content.slice(0, markerIndex);
    const after = content.slice(markerIndex + PAYOFF_MARKER.length);
    const match = after.match(/^\s*({[\s\S]*})/);
    if (!match) return null;

    try {
        const payload = JSON.parse(match[1]);
        const cleaned = (before + after.slice(match[1].length)).trim();
        return { payload, cleaned };
    } catch {
        return null;
    }
}

// ─── Live Voice Recognition with auto-silence detection ─────────────────────
function useLiveVoice(locale: string) {
    const [displayText, setDisplayText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const onSilenceRef = useRef<((text: string) => void) | null>(null);
    const accumulatedRef = useRef('');
    const shouldListenRef = useRef(false);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            setIsSupported(true);
        }
    }, []);

    const start = useCallback((onSilence: (text: string) => void) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) return;

        // Always create a fresh recognition instance to avoid Chrome bugs
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';

        accumulatedRef.current = '';
        setDisplayText('');
        onSilenceRef.current = onSilence;
        shouldListenRef.current = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                accumulatedRef.current += finalTranscript;
            }
            setDisplayText((accumulatedRef.current + ' ' + interim).trim());

            // Reset silence timer
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
                const text = (accumulatedRef.current + ' ' + interim).trim();
                if (text && onSilenceRef.current) {
                    // Stop first, then send
                    shouldListenRef.current = false;
                    try { recognition.stop(); } catch { /* */ }
                    setIsListening(false);
                    onSilenceRef.current(text);
                    accumulatedRef.current = '';
                    setDisplayText('');
                }
            }, 2000);
        };

        recognition.onerror = () => {
            setIsListening(false);
            shouldListenRef.current = false;
        };

        recognition.onend = () => {
            // Only auto-restart if we should still be listening
            if (shouldListenRef.current) {
                try { recognition.start(); } catch { setIsListening(false); }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
            setIsListening(true);
        } catch { /* already started */ }
    }, [locale]);

    const stop = useCallback(() => {
        shouldListenRef.current = false;
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch { /* */ }
        }
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        setIsListening(false);
        setDisplayText('');
    }, []);

    return { transcript: displayText, isListening, isSupported, start, stop };
}

// ─── TTS via Edge Neural Voices (server-side, free) ─────────────────────────
function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const speak = useCallback(async (text: string, lang: string = 'fr', onEnd?: () => void) => {
        // Cancel any current playback
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        if (abortRef.current) abortRef.current.abort();

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setIsSpeaking(true);

            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, locale: lang, rate: '-3%', pitch: '+0Hz' }),
                signal: controller.signal,
            });

            if (!res.ok) throw new Error('TTS request failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
                setTimeout(() => onEnd?.(), 300);
            };

            audio.onerror = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
                onEnd?.();
            };

            await audio.play();
        } catch (err) {
            // If aborted, don't call onEnd
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setIsSpeaking(false);
            onEnd?.();
        }
    }, []);

    const stop = useCallback(() => {
        if (abortRef.current) abortRef.current.abort();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setIsSpeaking(false);
    }, []);

    return { speak, stop, isSpeaking, isSupported: true };
}

// ─── Conversation State ─────────────────────────
type LiveState = 'idle' | 'listening' | 'processing' | 'speaking';

// ─── Main Component ─────────────────────────
export default function InterviewPage() {
    const { locale, t } = useLanguage();
    const { incrementInterviewCount } = useProgress();
    const { messages, isStreaming: isLoading, error, setError, sendMessage: sendStreamMessage, resetChat } = useStreamingChat();
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [mode, setMode] = useState<'written' | 'oral'>('written');
    const [liveState, setLiveState] = useState<LiveState>('idle');
    const [assessment, setAssessment] = useState<string | null>(null);
    const [isAssessing, setIsAssessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // Use ref for messages to avoid stale closures in TTS callbacks
    const messagesRef = useRef<Message[]>([]);
    const isLiveRef = useRef(false);

    const voice = useLiveVoice(locale);
    const tts = useTextToSpeech();

    // Keep messagesRef in sync
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ─── Core: send message and handle response ─────────────────────────
    const sendAndSpeak = useCallback(async (content: string, currentMessages: Message[]) => {
        messagesRef.current = [...currentMessages, { role: 'user', content }];
        setInput('');
        setLiveState('processing');

        try {
            const fullContent = await sendStreamMessage(content, locale, 'oral', currentMessages);
            messagesRef.current = [...messagesRef.current, { role: 'assistant', content: fullContent }];

            // Speak the response
            setLiveState('speaking');
            tts.speak(fullContent, locale, () => {
                // After TTS finishes, auto-listen again if still in live mode
                if (isLiveRef.current) {
                    setLiveState('listening');
                    voice.start((text) => {
                        // Use ref to get latest messages
                        sendAndSpeak(text, messagesRef.current);
                    });
                }
            });
        } catch (err: unknown) {
            setLiveState('idle');
        }
    }, [locale, tts, voice, sendStreamMessage]);

    // ─── Send message (written mode) ─────────────────────────
    const sendMessageLocal = async (content: string, history: Message[] = messages) => {
        setInput('');
        try {
            await sendStreamMessage(content, locale, 'interview', history);
        } catch (err: unknown) {}
    };

    // ─── Start Interview ─────────────────────────
    const startInterview = async (selectedMode: 'written' | 'oral') => {
        setMode(selectedMode);
        setStarted(true);
        resetChat();
        messagesRef.current = [];
        setAssessment(null);
        incrementInterviewCount();

        if (selectedMode === 'oral') {
            isLiveRef.current = true;
        }

        try {
            const fullContent = await sendStreamMessage(null, locale, selectedMode === 'oral' ? 'oral' : 'interview', []);
            messagesRef.current = [{ role: 'assistant', content: fullContent }];

            // In oral mode: speak welcome, then auto-listen
            if (selectedMode === 'oral') {
                setLiveState('speaking');
                tts.speak(fullContent, locale, () => {
                    if (isLiveRef.current) {
                        setLiveState('listening');
                        voice.start((text) => {
                            sendAndSpeak(text, messagesRef.current);
                        });
                    }
                });
            }
        } catch (err: unknown) {
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessageLocal(input.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const requestAssessment = async (msgs: Message[]) => {
        setIsAssessing(true);
        setAssessment(null);
        try {
            const finalMsgs = [
                ...msgs,
                {
                    role: 'user' as const, content: locale === 'fr'
                        ? 'L\'entretien est terminé. Évalue ma performance globale.'
                        : 'The interview is over. Evaluate my overall performance.'
                }
            ];
            const fullContent = await fetchStreamingResponse(finalMsgs, locale, 'assessment');
            setAssessment(fullContent);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Assessment error';
            setError(errorMessage);
        } finally {
            setIsAssessing(false);
        }
    };

    const handleEndCall = () => {
        isLiveRef.current = false;
        voice.stop();
        tts.stop();
        setLiveState('idle');
        if (messages.length >= 3) {
            requestAssessment(messages);
        } else {
            setStarted(false);
            resetChat();
            messagesRef.current = [];
        }
    };

    const handleRestart = () => {
        isLiveRef.current = false;
        resetChat();
        messagesRef.current = [];
        setStarted(false);
        setAssessment(null);
        setIsAssessing(false);
        tts.stop();
        voice.stop();
        setLiveState('idle');
    };

    // ─── Start Screen ─────────────────────────
    if (!started) {
        return (
            <div className="page-container">
                <h1 className="page-title">{t({ fr: 'Simulateur d\'Entretien', en: 'Interview Simulator' })}</h1>
                <p className="page-subtitle">{t({
                    fr: 'Préparez-vous pour vos entretiens techniques en structuration avec un recruteur IA.',
                    en: 'Prepare for your technical structuring interviews with an AI recruiter.'
                })}</p>

                <div style={{ maxWidth: 700, margin: '2rem auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Written Mode */}
                        <div
                            className="glass-card"
                            style={{ cursor: 'pointer', padding: '2rem', textAlign: 'center', transition: 'all 0.2s ease' }}
                            onClick={() => startInterview('written')}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: 14,
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.25rem',
                            }}>
                                <Keyboard size={28} color="white" />
                            </div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                {t({ fr: 'Mode Écrit', en: 'Written Mode' })} ✍️
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                {t({
                                    fr: 'Tapez vos réponses. Feedback détaillé et formules LaTeX.',
                                    en: 'Type your answers. Detailed feedback with LaTeX formulas.'
                                })}
                            </p>
                        </div>

                        {/* Oral Live Mode */}
                        <div
                            className="glass-card"
                            style={{
                                cursor: voice.isSupported ? 'pointer' : 'not-allowed',
                                padding: '2rem', textAlign: 'center',
                                opacity: voice.isSupported ? 1 : 0.5,
                                transition: 'all 0.2s ease',
                            }}
                            onClick={() => voice.isSupported && startInterview('oral')}
                            onMouseEnter={(e) => { if (voice.isSupported) { e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: 14,
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.25rem',
                            }}>
                                <AudioLines size={28} color="white" />
                            </div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                {t({ fr: 'Mode Oral Live', en: 'Live Oral Mode' })} 🎙️
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                {voice.isSupported
                                    ? t({
                                        fr: 'Conversation live. L\'IA parle, vous répondez. Comme un vrai entretien.',
                                        en: 'Live conversation. AI speaks, you respond. Like a real interview.'
                                    })
                                    : t({
                                        fr: 'Non supporté. Utilisez Chrome ou Edge.',
                                        en: 'Not supported. Use Chrome or Edge.'
                                    })
                                }
                            </p>
                        </div>
                    </div>

                    <div className="glass-card-static" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            {[
                                { fr: '✅ Options vanilles et stratégies', en: '✅ Vanilla options and strategies' },
                                { fr: '✅ Greeks et couverture', en: '✅ Greeks and hedging' },
                                { fr: '✅ Produits structurés (autocall, phoenix)', en: '✅ Structured products (autocall, phoenix)' },
                                { fr: '✅ Pricing (Black-Scholes, Monte Carlo)', en: '✅ Pricing (Black-Scholes, Monte Carlo)' },
                                { fr: '✅ Volatilité et surfaces', en: '✅ Volatility and surfaces' },
                                { fr: '✅ Feedback adaptatif par l\'IA', en: '✅ Adaptive AI feedback' },
                            ].map((item, i) => (
                                <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                    {t(item)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── ORAL LIVE MODE ─────────────────────────
    if (mode === 'oral') {
        const stateLabel: Record<LiveState, { fr: string; en: string }> = {
            idle: { fr: 'En attente...', en: 'Waiting...' },
            listening: { fr: 'Je vous écoute...', en: 'Listening...' },
            processing: { fr: 'Réflexion en cours...', en: 'Thinking...' },
            speaking: { fr: 'L\'examinateur parle...', en: 'Examiner speaking...' },
        };

        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: 'calc(100vh - 2rem)', padding: '2rem', position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{ position: 'absolute', top: '1.5rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {t({ fr: 'Entretien Live', en: 'Live Interview' })}
                            <span style={{
                                fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                                borderRadius: 20, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
                                animation: liveState !== 'idle' ? 'live-pulse 2s ease-in-out infinite' : 'none',
                            }}>
                                ● LIVE
                            </span>
                        </h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Equity Derivatives Structuring</p>
                    </div>
                    <button
                        onClick={handleEndCall}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1.25rem', borderRadius: 20,
                            background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        <PhoneOff size={15} />
                        {t({ fr: 'Raccrocher', en: 'End Call' })}
                    </button>
                </div>

                {/* Animated Orb */}
                <LiveOrb state={liveState} size={300} />

                {/* State Label */}
                <div style={{
                    fontSize: '1rem', fontWeight: 600, marginTop: '1rem',
                    color: liveState === 'listening' ? '#a78bfa'
                        : liveState === 'speaking' ? '#34d399'
                            : liveState === 'processing' ? '#60a5fa'
                                : 'var(--text-muted)',
                    transition: 'color 0.4s ease',
                }}>
                    {t(stateLabel[liveState])}
                </div>

                {/* Live Transcript */}
                {liveState === 'listening' && voice.transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            maxWidth: 500, textAlign: 'center',
                            fontSize: '0.9rem', color: 'var(--text-secondary)',
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(139, 92, 246, 0.06)',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            borderRadius: 12, marginTop: '0.75rem',
                        }}
                    >
                        {voice.transcript}
                    </motion.div>
                )}

                {/* Assessment result (after raccrocher) */}
                {(assessment || isAssessing) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            position: 'absolute', bottom: '5rem', left: '2rem', right: '2rem',
                            maxWidth: 600, margin: '0 auto',
                            padding: '1.5rem',
                            background: 'rgba(245, 158, 11, 0.04)',
                            border: '1px solid rgba(245, 158, 11, 0.15)',
                            borderRadius: 14, maxHeight: '40vh', overflowY: 'auto',
                        }}
                    >
                        {isAssessing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                {t({ fr: 'Évaluation de votre performance...', en: 'Evaluating your performance...' })}
                            </div>
                        ) : assessment && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                <Latex block>{assessment}</Latex>
                                <button onClick={handleRestart} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                                    <RotateCcw size={14} />
                                    {t({ fr: 'Nouvel entretien', en: 'New interview' })}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Last AI message */}
                {messages.length > 0 && !assessment && !isAssessing && (
                    <div style={{
                        position: 'absolute', bottom: '3rem', left: '2rem', right: '2rem',
                        maxWidth: 600, margin: '0 auto',
                    }}>
                        <div style={{
                            padding: '1rem 1.25rem',
                            background: 'rgba(59, 130, 246, 0.04)',
                            border: '1px solid rgba(59, 130, 246, 0.1)',
                            borderRadius: 14,
                            fontSize: '0.82rem', color: 'var(--text-secondary)',
                            lineHeight: 1.7, maxHeight: 100, overflowY: 'auto',
                        }}>
                            <Latex block>{messages[messages.length - 1].content}</Latex>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                        padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10,
                        color: '#f87171', fontSize: '0.8rem', zIndex: 10,
                    }}>
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes live-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                `}</style>
            </div>
        );
    }

    // ─── WRITTEN MODE ─────────────────────────
    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)', padding: '1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {t({ fr: 'Entretien Technique', en: 'Technical Interview' })}
                        <span style={{
                            fontSize: '0.65rem', fontWeight: 600,
                            padding: '0.2rem 0.5rem', borderRadius: 6,
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#60a5fa',
                        }}>
                            ✍️ {t({ fr: 'ÉCRIT', en: 'WRITTEN' })}
                        </span>
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Equity Derivatives Structuring</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {messages.filter(m => m.role === 'user').length > 0 && (
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 600,
                            padding: '0.25rem 0.6rem', borderRadius: 6,
                            background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa',
                        }}>
                            {messages.filter(m => m.role === 'user').length} Q
                        </span>
                    )}
                    {messages.length >= 3 && !assessment && (
                        <button
                            onClick={() => requestAssessment(messages)}
                            disabled={isAssessing}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                border: 'none', borderRadius: 8,
                                color: 'white', fontSize: '0.8rem', fontWeight: 600,
                                cursor: isAssessing ? 'wait' : 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            {isAssessing ? (
                                <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {t({ fr: 'Évaluation...', en: 'Assessing...' })}</>
                            ) : (
                                <>{t({ fr: '📊 Bilan', en: '📊 Assess' })}</>
                            )}
                        </button>
                    )}
                    <button
                        onClick={handleRestart}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)', borderRadius: 8,
                            color: 'var(--text-secondary)', fontSize: '0.8rem',
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        <RotateCcw size={14} />
                        {t({ fr: 'Recommencer', en: 'Restart' })}
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem',
                paddingRight: '0.5rem', marginBottom: '1rem',
            }}>
                <AnimatePresence>
                    {messages.map((msg, i) => {
                        const payoffInfo = extractPayoffBlock(msg.content);
                        const renderedContent = payoffInfo?.cleaned ?? msg.content;
                        const showPayoffChart = payoffInfo && msg.role === 'assistant';
                        const showCursor = msg.role === 'assistant' && i === messages.length - 1 && isLoading;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    display: 'flex', gap: '0.75rem',
                                    alignItems: 'flex-start',
                                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                    background: msg.role === 'assistant'
                                        ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                                        : 'rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {msg.role === 'assistant' ? <Bot size={18} color="white" /> : <User size={18} color="#94a3b8" />}
                                </div>
                                <div style={{
                                    maxWidth: '75%',
                                    background: msg.role === 'assistant'
                                        ? 'rgba(59, 130, 246, 0.06)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${msg.role === 'assistant' ? 'rgba(59, 130, 246, 0.12)' : 'var(--border)'}`,
                                    borderRadius: 14, padding: '1rem 1.25rem',
                                    position: 'relative',
                                }}>
                                <div style={{
                                    fontSize: '0.9rem', color: 'var(--text-secondary)',
                                    lineHeight: 1.75, whiteSpace: 'pre-wrap',
                                }}>
                                    <Latex block>{renderedContent}</Latex>
                                    {showPayoffChart && <PayoffChart payload={payoffInfo!.payload} />}
                                </div>
                                    {showCursor && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '0.8rem',
                                            right: '0.9rem',
                                            pointerEvents: 'none',
                                        }}>
                                            <GlassCursor />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Bot size={18} color="white" />
                        </div>
                        <div style={{
                            padding: '1rem 1.25rem',
                            background: 'rgba(59, 130, 246, 0.06)',
                            border: '1px solid rgba(59, 130, 246, 0.12)',
                            borderRadius: 14, display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}>
                            <Loader2 size={18} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
                            <span style={{ fontSize: '0.82rem', color: '#60a5fa' }}>
                                {t({ fr: 'L\'examinateur réfléchit...', en: 'The examiner is thinking...' })}
                            </span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{
                            display: 'flex', gap: '0.5rem', alignItems: 'center',
                            padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10,
                            color: '#f87171', fontSize: '0.85rem',
                        }}>
                        <AlertCircle size={16} /> {error}
                    </motion.div>
                )}

                <div ref={messagesEndRef} />

                {/* Assessment */}
                {(assessment || isAssessing) && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '1.5rem',
                            background: 'rgba(245, 158, 11, 0.04)',
                            border: '1px solid rgba(245, 158, 11, 0.15)',
                            borderRadius: 14,
                        }}>
                        {isAssessing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                {t({ fr: 'Évaluation de votre performance...', en: 'Evaluating your performance...' })}
                            </div>
                        ) : assessment && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                                <Latex block>{assessment}</Latex>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div style={{
                display: 'flex', gap: '0.5rem', flexShrink: 0,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: '0.5rem',
                alignItems: 'flex-end',
            }}>
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t({ fr: 'Votre réponse...', en: 'Your answer...' })}
                    rows={1}
                    style={{
                        flex: 1, resize: 'none', border: 'none', outline: 'none',
                        background: 'transparent', padding: '0.6rem 0.75rem',
                        color: 'var(--text-primary)', fontSize: '0.9rem',
                        fontFamily: 'inherit', lineHeight: 1.5,
                        maxHeight: 120, overflowY: 'auto',
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                    }}
                />
                <button
                    type="button"
                    onClick={handleSubmit as unknown as () => void}
                    disabled={!input.trim() || isLoading}
                    style={{
                        padding: '0.6rem', borderRadius: 10,
                        background: input.trim() && !isLoading ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                        border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <Send size={18} color={input.trim() && !isLoading ? 'white' : '#475569'} />
                </button>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
