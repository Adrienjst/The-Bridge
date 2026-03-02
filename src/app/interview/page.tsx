'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Bot, User, Loader2, AlertCircle, Mic, MicOff, Volume2, VolumeX, Keyboard, AudioLines } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import Latex from '@/components/Latex';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// ─── Web Speech API Hook: Voice Recognition ─────────────────────────
function useVoiceRecognition(locale: string) {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            setIsSupported(true);
            const recognition = new SpeechRecognitionAPI();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }
                setTranscript(prev => {
                    if (finalTranscript) return prev + finalTranscript;
                    return prev.replace(/\[.*?\]$/, '') + (interimTranscript ? `[${interimTranscript}]` : '');
                });
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [locale]);

    const start = useCallback(() => {
        if (recognitionRef.current) {
            setTranscript('');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch { /* already started */ }
        }
    }, []);

    const stop = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    // Clean transcript (remove interim markers)
    const cleanTranscript = transcript.replace(/\[.*?\]/g, '').trim();

    return { transcript: cleanTranscript, rawTranscript: transcript, isListening, isSupported, start, stop };
}

// ─── Web Speech API Hook: Text-to-Speech ─────────────────────────
function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported('speechSynthesis' in window);
    }, []);

    const speak = useCallback((text: string, lang: string = 'fr-FR') => {
        if (!('speechSynthesis' in window)) return;

        // Stop any current speech
        window.speechSynthesis.cancel();

        // Clean text: remove LaTeX, markdown formatting
        const cleanText = text
            .replace(/\$[^$]+\$/g, 'formule mathématique')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/#{1,6}\s/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
        utterance.rate = 1.05;
        utterance.pitch = 1;

        // Try to find a good voice
        const voices = window.speechSynthesis.getVoices();
        const langPrefix = lang === 'fr' ? 'fr' : 'en';
        const preferredVoice = voices.find(v => v.lang.startsWith(langPrefix) && v.localService) ||
            voices.find(v => v.lang.startsWith(langPrefix));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);

    const stop = useCallback(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stop, isSpeaking, isSupported };
}

// ─── Main Component ─────────────────────────
export default function InterviewPage() {
    const { locale, t } = useLanguage();
    const { incrementInterviewCount } = useProgress();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [started, setStarted] = useState(false);
    const [mode, setMode] = useState<'written' | 'oral'>('written');
    const [autoSpeak, setAutoSpeak] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const voice = useVoiceRecognition(locale);
    const tts = useTextToSpeech();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (content: string, history: Message[] = messages) => {
        const userMessage: Message = { role: 'user', content };
        const newMessages = [...history, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    locale,
                    mode: mode === 'oral' ? 'oral' : 'interview',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const assistantMsg: Message = { role: 'assistant', content: data.content };
            setMessages([...newMessages, assistantMsg]);

            // Auto-speak in oral mode
            if (mode === 'oral' && autoSpeak) {
                tts.speak(data.content, locale);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const startInterview = async (selectedMode: 'written' | 'oral') => {
        setMode(selectedMode);
        setStarted(true);
        setMessages([]);
        setIsLoading(true);
        setError(null);
        incrementInterviewCount();

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [],
                    locale,
                    mode: selectedMode === 'oral' ? 'oral' : 'interview',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to start interview');
            }

            setMessages([{ role: 'assistant', content: data.content }]);

            // Auto-speak welcome message in oral mode
            if (selectedMode === 'oral' && autoSpeak) {
                tts.speak(data.content, locale);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleVoiceSubmit = () => {
        voice.stop();
        if (voice.transcript.trim()) {
            sendMessage(voice.transcript.trim());
        }
    };

    const handleRestart = () => {
        setMessages([]);
        setStarted(false);
        setError(null);
        tts.stop();
        voice.stop();
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
                        {/* Written Mode Card */}
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
                                    fr: 'Tapez vos réponses. Feedback détaillé et formules LaTeX. Idéal pour approfondir.',
                                    en: 'Type your answers. Detailed feedback with LaTeX formulas. Ideal for deep practice.'
                                })}
                            </p>
                        </div>

                        {/* Oral Mode Card */}
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
                                {t({ fr: 'Mode Oral', en: 'Oral Mode' })} 🎤
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                {voice.isSupported
                                    ? t({
                                        fr: 'Parlez au micro. L\'IA vous répond à voix haute. Simulation réaliste d\'entretien.',
                                        en: 'Speak into the mic. AI responds out loud. Realistic interview simulation.'
                                    })
                                    : t({
                                        fr: 'Non supporté par votre navigateur. Utilisez Chrome ou Edge.',
                                        en: 'Not supported by your browser. Use Chrome or Edge.'
                                    })
                                }
                            </p>
                        </div>
                    </div>

                    {/* Features list */}
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

    // ─── Chat Screen ─────────────────────────
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
                            background: mode === 'oral' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: mode === 'oral' ? '#a78bfa' : '#60a5fa',
                        }}>
                            {mode === 'oral' ? '🎤 ORAL' : '✍️ ÉCRIT'}
                        </span>
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Equity Derivatives Structuring
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {/* TTS toggle (oral mode) */}
                    {mode === 'oral' && (
                        <button
                            onClick={() => { if (tts.isSpeaking) tts.stop(); setAutoSpeak(!autoSpeak); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                padding: '0.4rem 0.75rem', background: autoSpeak ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${autoSpeak ? 'rgba(139, 92, 246, 0.3)' : 'var(--border)'}`,
                                borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                                color: autoSpeak ? '#a78bfa' : 'var(--text-muted)', fontSize: '0.75rem',
                            }}
                        >
                            {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
                            {autoSpeak ? 'TTS ON' : 'TTS OFF'}
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
                            transition: 'all 0.15s ease',
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
                    {messages.map((msg, i) => (
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
                                borderRadius: 14,
                                padding: '1rem 1.25rem',
                            }}>
                                <div style={{
                                    fontSize: '0.9rem', color: 'var(--text-secondary)',
                                    lineHeight: 1.75, whiteSpace: 'pre-wrap',
                                }}>
                                    <Latex block>{msg.content}</Latex>
                                </div>
                                {/* Speak button for assistant messages */}
                                {msg.role === 'assistant' && tts.isSupported && (
                                    <button
                                        onClick={() => tts.isSpeaking ? tts.stop() : tts.speak(msg.content, locale)}
                                        style={{
                                            marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'inherit',
                                            padding: '0.2rem 0',
                                        }}
                                    >
                                        {tts.isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                        {tts.isSpeaking
                                            ? t({ fr: 'Arrêter', en: 'Stop' })
                                            : t({ fr: 'Écouter', en: 'Listen' })
                                        }
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                    >
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
                            borderRadius: 14,
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}>
                            <Loader2 size={18} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
                            <span style={{ fontSize: '0.82rem', color: '#60a5fa' }}>
                                {t({ fr: 'L\'examinateur réfléchit...', en: 'The examiner is thinking...' })}
                            </span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            display: 'flex', gap: '0.5rem', alignItems: 'center',
                            padding: '0.75rem 1rem',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 10,
                            color: '#f87171', fontSize: '0.85rem',
                        }}
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Voice Recording Indicator */}
            {mode === 'oral' && voice.isListening && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(239, 68, 68, 0.06)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 12,
                        marginBottom: '0.5rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                >
                    <div style={{
                        width: 12, height: 12, borderRadius: '50%',
                        background: '#ef4444',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 600, marginBottom: '0.2rem' }}>
                            {t({ fr: 'Enregistrement en cours...', en: 'Recording...' })}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: 20 }}>
                            {voice.rawTranscript || t({ fr: 'Parlez maintenant...', en: 'Speak now...' })}
                        </div>
                    </div>
                    <button
                        onClick={handleVoiceSubmit}
                        disabled={!voice.transcript.trim()}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: 8,
                            background: voice.transcript.trim() ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                            border: 'none', cursor: voice.transcript.trim() ? 'pointer' : 'not-allowed',
                            color: voice.transcript.trim() ? 'white' : '#475569',
                            fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                        }}
                    >
                        <Send size={14} />
                        {t({ fr: 'Envoyer', en: 'Send' })}
                    </button>
                </motion.div>
            )}

            {/* Input Area */}
            <div style={{
                display: 'flex', gap: '0.5rem', flexShrink: 0,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: '0.5rem',
                alignItems: 'flex-end',
            }}>
                {/* Mic button (always available in oral mode) */}
                {mode === 'oral' && voice.isSupported && (
                    <button
                        onClick={() => voice.isListening ? voice.stop() : voice.start()}
                        disabled={isLoading}
                        style={{
                            padding: '0.6rem', borderRadius: 10,
                            background: voice.isListening
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(139, 92, 246, 0.12)',
                            border: `1px solid ${voice.isListening ? 'rgba(239, 68, 68, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        {voice.isListening
                            ? <MicOff size={18} color="#f87171" />
                            : <Mic size={18} color="#a78bfa" />
                        }
                    </button>
                )}

                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode === 'oral'
                        ? t({ fr: 'Parlez au micro ou tapez ici...', en: 'Speak into mic or type here...' })
                        : t({ fr: 'Votre réponse...', en: 'Your answer...' })
                    }
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
                        transition: 'all 0.15s ease',
                    }}
                >
                    <Send size={18} color={input.trim() && !isLoading ? 'white' : '#475569'} />
                </button>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
}
