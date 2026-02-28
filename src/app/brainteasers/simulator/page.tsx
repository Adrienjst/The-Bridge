"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brain, Mic, MicOff, Play, Send, RotateCcw, Bot, User, Loader2, AlertCircle, Lightbulb, Clock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import brainteasersData from '@/data/brainteasers.json';
import Latex from '@/components/Latex';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Brainteaser {
    id: string;
    category: string;
    difficulty: Difficulty;
    mechanics: string[];
    question: { fr: string; en: string; };
    solution: { fr: string; en: string; };
}

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Converts LaTeX bracket delimiters \[...\] and \(...\) to $$...$$ and $...$
 * so that remarkMath can process them.
 */
function preprocessLatex(text: string): string {
    if (!text) return text;
    // Convert \[...\] to $$...$$
    let result = text.replace(/\\\[([\s\S]*?)\\\]/g, '\n$$$$\n$1\n$$$$\n');
    // Convert \(...\) to $...$
    result = result.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');
    return result;
}

function SimulatorContent() {
    const { t, locale } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [teaser, setTeaser] = useState<Brainteaser | null>(null);

    // Timer
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState(false);

    // Recording
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const recognitionRef = useRef<any>(null);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // AI
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Hints
    const [hints, setHints] = useState<string[]>([]);
    const [isHintLoading, setIsHintLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load Data
    useEffect(() => {
        if (!id) { router.push('/brainteasers'); return; }
        const found = (brainteasersData as Brainteaser[]).find(b => b.id === id);
        if (found) {
            setTeaser(found);
            if (found.difficulty === 'Easy') setTimeLeft(2 * 60);
            if (found.difficulty === 'Medium') setTimeLeft(5 * 60);
            if (found.difficulty === 'Hard') setTimeLeft(10 * 60);
        } else {
            router.push('/brainteasers');
        }
    }, [id, router]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0 && messages.length === 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isActive && messages.length === 0) {
            setIsActive(false);
            if (isRecording) stopRecording();
            handleAutoSubmit();
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, timeLeft, messages.length, isRecording, transcript, t, teaser, error]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- Web Speech ---
    const initSpeechRecognition = () => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) {
            alert(t({ fr: "Votre navigateur ne supporte pas la reconnaissance vocale.", en: "Your browser does not support speech recognition." }));
            return false;
        }
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
        recognition.onresult = (event: any) => {
            const finalOutput = Array.from(event.results as any).map((res: any) => res[0].transcript).join('');
            setTranscript(finalOutput);
        };
        recognition.onerror = (event: any) => { console.error('Speech error', event.error); setIsRecording(false); };
        /* eslint-enable @typescript-eslint/no-explicit-any */
        recognitionRef.current = recognition;
        return true;
    };

    const toggleRecording = () => { isRecording ? stopRecording() : startRecording(); };
    const startRecording = () => {
        if (!recognitionRef.current && !initSpeechRecognition()) return;
        try { recognitionRef.current.start(); setIsRecording(true); } catch (e) { console.error(e); }
    };
    const stopRecording = () => {
        if (recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false); }
    };

    // --- Hint ---
    const requestHint = async () => {
        if (!teaser || isHintLoading) return;
        setIsHintLoading(true);
        const qText = locale === 'fr' ? teaser.question.fr : teaser.question.en;
        const sText = locale === 'fr' ? teaser.solution.fr : teaser.solution.en;
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: `You are a helpful interviewer. The candidate is solving: "${qText}". Solution: "${sText}". Give ONE short sentence hint without revealing the answer. Respond in ${locale === 'fr' ? 'French' : 'English'}.` },
                        { role: "user", content: "Give me a subtle hint." }
                    ], locale
                })
            });
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            setHints(prev => [...prev, data.content]);
        } catch (err) { console.error("Hint error", err); }
        finally { setIsHintLoading(false); }
    };

    // --- Submission ---
    const handleAutoSubmit = () => {
        handleInitialSubmit(t({ fr: "[Timer expiré] : ", en: "[Timer expired] : " }) + transcript);
    };
    const handleManualSubmit = () => {
        if (isRecording) stopRecording();
        setIsActive(false);
        handleInitialSubmit(transcript || t({ fr: "[Aucune réponse fournie.]", en: "[No answer provided.]" }));
    };

    const handleInitialSubmit = async (finalText: string) => {
        if (!teaser) return;
        setIsLoading(true);
        setError(null);
        const qText = locale === 'fr' ? teaser.question.fr : teaser.question.en;
        const sText = locale === 'fr' ? teaser.solution.fr : teaser.solution.en;

        const systemPrompt = `You are a strict but fair quantitative finance interviewer. 
The candidate is solving: "${qText}"
OFFICIAL SOLUTION (explain the logic, never copy-paste): "${sText}"

1. State clearly CORRECT, PARTIALLY CORRECT, or WRONG.
2. Analyze their reasoning.
3. Provide the official explanation clearly.
Use $...$ for inline math and $$...$$ for block math.
Respond entirely in ${locale === 'fr' ? 'French' : 'English'}. Use Markdown for readability.`;

        const initialMessages: Message[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `My answer/reasoning: ${finalText}` }
        ];
        setMessages(initialMessages);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: initialMessages, locale })
            });
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            setMessages([...initialMessages, { role: "assistant", content: data.content || "Error." }]);
        } catch (err) {
            console.error(err);
            setError(t({ fr: 'Erreur de connexion à l\'IA.', en: 'Error connecting to AI.' }));
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Chat ---
    const sendChatMessage = async (content: string) => {
        const userMsg: Message = { role: 'user', content };
        const newMsgs = [...messages, userMsg];
        setMessages(newMsgs);
        setChatInput('');
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMsgs, locale })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            setMessages([...newMsgs, { role: 'assistant', content: data.content }]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isLoading) return;
        sendChatMessage(chatInput.trim());
    };
    const handleChatKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(e); }
    };

    // --- Render ---
    if (!teaser) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 size={28} className="animate-spin" style={{ color: '#60a5fa' }} />
            </div>
        );
    }

    const hasEvaluation = messages.length > 0;

    // --- PRE-TIMER VIEW ---
    if (!hasEvaluation) {
        return (
            <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* Back */}
                <button
                    onClick={() => router.push('/brainteasers')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'inherit',
                        marginBottom: '1.5rem',
                    }}
                >
                    <ArrowLeft size={16} />
                    {t({ fr: 'Retour au Hub', en: 'Back to Hub' })}
                </button>

                {/* Question Card */}
                <div className="glass-card-static" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{
                            padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                            background: teaser.difficulty === 'Easy' ? 'rgba(34,197,94,0.1)' : teaser.difficulty === 'Medium' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                            color: teaser.difficulty === 'Easy' ? '#22c55e' : teaser.difficulty === 'Medium' ? '#eab308' : '#ef4444',
                            border: `1px solid ${teaser.difficulty === 'Easy' ? 'rgba(34,197,94,0.2)' : teaser.difficulty === 'Medium' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        }}>{teaser.difficulty}</span>
                        <span style={{
                            padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                            background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                        }}>{teaser.category}</span>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        {locale === 'fr' ? teaser.question.fr : teaser.question.en}
                    </h1>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {teaser.mechanics.map(m => (
                            <span key={m} style={{
                                fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)',
                                background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.6rem',
                                borderRadius: 6, border: '1px solid var(--border)',
                            }}>#{m}</span>
                        ))}
                    </div>
                </div>

                {/* Timer & Controls */}
                <div className="glass-card-static" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={18} style={{ color: 'var(--text-muted)' }} />
                        <span style={{
                            fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700,
                            color: timeLeft <= 30 ? '#ef4444' : timeLeft <= 60 ? '#f59e0b' : 'var(--text-primary)',
                        }}>{formatTime(timeLeft)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* Hint Button */}
                        {isActive && (
                            <button
                                onClick={requestHint}
                                disabled={isHintLoading}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.5rem 1rem', borderRadius: 10,
                                    background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)',
                                    color: '#eab308', fontSize: '0.85rem', fontWeight: 600,
                                    cursor: isHintLoading ? 'wait' : 'pointer', fontFamily: 'inherit',
                                    opacity: isHintLoading ? 0.6 : 1,
                                }}
                            >
                                {isHintLoading ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />}
                                {t({ fr: 'Indice', en: 'Hint' })}
                            </button>
                        )}

                        {/* Mic */}
                        <button
                            onClick={toggleRecording}
                            disabled={!isActive && !transcript}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.5rem 1rem', borderRadius: 10,
                                background: isRecording ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${isRecording ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                                color: isRecording ? '#ef4444' : 'var(--text-secondary)',
                                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                opacity: (!isActive && !transcript) ? 0.4 : 1,
                            }}
                        >
                            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                            {isRecording ? t({ fr: 'Stop', en: 'Stop' }) : t({ fr: 'Dicter', en: 'Dictate' })}
                        </button>

                        {/* Start or Submit */}
                        {!isActive && timeLeft > 0 && !transcript ? (
                            <button
                                onClick={() => setIsActive(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.5rem 1.5rem', borderRadius: 10,
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    border: 'none', color: 'white', fontSize: '0.85rem', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                }}
                            >
                                <Play size={14} style={{ fill: 'currentColor' }} />
                                {t({ fr: 'Démarrer', en: 'Start' })}
                            </button>
                        ) : (
                            <button
                                onClick={handleManualSubmit}
                                disabled={isLoading}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.5rem 1.5rem', borderRadius: 10,
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    border: 'none', color: 'white', fontSize: '0.85rem', fontWeight: 600,
                                    cursor: isLoading ? 'wait' : 'pointer', fontFamily: 'inherit',
                                    opacity: isLoading ? 0.6 : 1,
                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                }}
                            >
                                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                {t({ fr: 'Soumettre', en: 'Submit' })}
                            </button>
                        )}
                    </div>
                </div>

                {/* Hints */}
                {hints.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {hints.map((hint, idx) => (
                            <div key={idx} style={{
                                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                                padding: '0.85rem 1.15rem', borderRadius: 12,
                                background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)',
                            }}>
                                <Lightbulb size={16} style={{ color: '#eab308', flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{hint}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Textarea */}
                <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    disabled={!isActive && !transcript}
                    placeholder={
                        !isActive
                            ? t({ fr: 'Appuyez sur Démarrer pour commencer...', en: 'Press Start to begin...' })
                            : t({ fr: 'Rédigez votre raisonnement ici...', en: 'Write your reasoning here...' })
                    }
                    style={{
                        width: '100%', minHeight: 250, padding: '1.25rem',
                        background: 'var(--bg-glass)', border: '1px solid var(--border)',
                        borderRadius: 14, resize: 'vertical', outline: 'none',
                        color: 'var(--text-primary)', fontSize: '0.95rem',
                        fontFamily: 'inherit', lineHeight: 1.7,
                        opacity: (!isActive && !transcript) ? 0.5 : 1,
                    }}
                />

                {error && (
                    <div style={{
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                        padding: '0.75rem 1rem', marginTop: '1rem',
                        background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 10, color: '#f87171', fontSize: '0.85rem',
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
            </div>
        );
    }

    // --- CHAT / EVALUATION VIEW ---
    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)', padding: '1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                        <Brain size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: '#60a5fa' }} />
                        {t({ fr: 'Correction du Brainteaser', en: 'Brainteaser Feedback' })}
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {teaser.category} · {teaser.difficulty}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => router.push('/brainteasers')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)', borderRadius: 8,
                            color: 'var(--text-secondary)', fontSize: '0.8rem',
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        <ArrowLeft size={14} />
                        {t({ fr: 'Hub', en: 'Hub' })}
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)', borderRadius: 8,
                            color: 'var(--text-secondary)', fontSize: '0.8rem',
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        <RotateCcw size={14} />
                        {t({ fr: 'Refaire', en: 'Retry' })}
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem',
                paddingRight: '0.5rem', marginBottom: '1rem',
            }}>
                <AnimatePresence>
                    {messages.filter(m => m.role !== 'system').map((msg, i) => (
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
                                maxWidth: '80%',
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
                                    {msg.role === 'assistant' ? (
                                        <Latex block>{preprocessLatex(msg.content)}</Latex>
                                    ) : (
                                        <span>{msg.content.replace(/^My answer\/reasoning:\s*/, '')}</span>
                                    )}
                                </div>
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
                        }}>
                            <Loader2 size={18} color="#60a5fa" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
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
                            background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 10, color: '#f87171', fontSize: '0.85rem',
                        }}
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleChatSubmit} style={{
                display: 'flex', gap: '0.5rem', flexShrink: 0,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: '0.5rem',
            }}>
                <textarea
                    ref={inputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder={t({ fr: 'Posez une question...', en: 'Ask a question...' })}
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
                    type="submit"
                    disabled={!chatInput.trim() || isLoading}
                    style={{
                        padding: '0.6rem', borderRadius: 10,
                        background: chatInput.trim() && !isLoading ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        cursor: chatInput.trim() && !isLoading ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <Send size={18} color={chatInput.trim() && !isLoading ? 'white' : '#475569'} />
                </button>
            </form>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default function SimulatorPage() {
    return (
        <Suspense fallback={
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 size={28} className="animate-spin" style={{ color: '#60a5fa' }} />
            </div>
        }>
            <SimulatorContent />
        </Suspense>
    );
}
