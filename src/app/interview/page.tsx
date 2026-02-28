'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Latex from '@/components/Latex';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function InterviewPage() {
    const { locale, t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [started, setStarted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

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
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            setMessages([...newMessages, { role: 'assistant', content: data.content }]);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const startInterview = async () => {
        setStarted(true);
        setMessages([]);
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [],
                    locale,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to start interview');
            }

            setMessages([{ role: 'assistant', content: data.content }]);
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

    const handleRestart = () => {
        setMessages([]);
        setStarted(false);
        setError(null);
    };

    if (!started) {
        return (
            <div className="page-container">
                <h1 className="page-title">{t({ fr: 'Simulateur d\'Entretien', en: 'Interview Simulator' })}</h1>
                <p className="page-subtitle">{t({
                    fr: 'Préparez-vous pour vos entretiens techniques en structuration avec un recruteur IA.',
                    en: 'Prepare for your technical structuring interviews with an AI recruiter.'
                })}</p>

                <div style={{ maxWidth: 600, margin: '2rem auto' }}>
                    <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 16,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                        }}>
                            <Bot size={32} color="white" />
                        </div>

                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            {t({ fr: 'Simulation d\'entretien technique', en: 'Technical Interview Simulation' })}
                        </h2>

                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            {t({
                                fr: 'Un recruteur IA spécialisé en equity derivatives vous posera des questions techniques sur les options, les produits structurés, le pricing, les Greeks, et plus encore. Adaptez-vous au niveau de difficulté croissant !',
                                en: 'An AI recruiter specializing in equity derivatives will ask you technical questions about options, structured products, pricing, Greeks, and more. Adapt to increasing difficulty levels!'
                            })}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {[
                                { fr: '✅ Options vanilles et stratégies', en: '✅ Vanilla options and strategies' },
                                { fr: '✅ Greeks et couverture', en: '✅ Greeks and hedging' },
                                { fr: '✅ Produits structurés (autocall, phoenix...)', en: '✅ Structured products (autocall, phoenix...)' },
                                { fr: '✅ Pricing (Black-Scholes, Monte Carlo)', en: '✅ Pricing (Black-Scholes, Monte Carlo)' },
                                { fr: '✅ Volatilité et surfaces', en: '✅ Volatility and surfaces' },
                                { fr: '✅ Feedback détaillé après chaque réponse', en: '✅ Detailed feedback after each answer' },
                            ].map((item, i) => (
                                <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
                                    {t(item)}
                                </div>
                            ))}
                        </div>



                        <button
                            onClick={startInterview}
                            style={{
                                padding: '0.85rem 2.5rem',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                border: 'none', borderRadius: 12,
                                color: 'white', fontSize: '1rem', fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'; }}
                        >
                            {t({ fr: 'Démarrer l\'entretien', en: 'Start Interview' })}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)', padding: '1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                        {t({ fr: 'Entretien Technique', en: 'Technical Interview' })}
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {t({ fr: 'Equity Derivatives Structuring', en: 'Equity Derivatives Structuring' })}
                    </p>
                </div>
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

            {/* Input */}
            <form onSubmit={handleSubmit} style={{
                display: 'flex', gap: '0.5rem', flexShrink: 0,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: '0.5rem',
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
                    type="submit"
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
