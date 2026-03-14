'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { t } = useLanguage();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '4rem auto', width: '100%', padding: '0 1rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Connexion</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Reprenez votre progression sur tous vos appareils.</p>
                </div>

                {error && (
                    <div style={{ 
                        padding: '0.75rem 1rem', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--red)',
                        fontSize: '0.9rem',
                        marginBottom: '1.5rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: 12, top: 12, width: 18, height: 18, color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)', color: 'var(--text)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: 12, top: 12, width: 18, height: 18, color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)', color: 'var(--text)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? <Loader2 className="spin" size={18} /> : (
                            <>
                                Se connecter
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Pas encore de compte ?{' '}
                    <Link href="/auth/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                        S'inscrire
                    </Link>
                </div>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
