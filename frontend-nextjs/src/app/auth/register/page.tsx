'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ maxWidth: 400, margin: '4rem auto', width: '100%', padding: '0 1rem' }}>
                <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <Mail size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Vérifiez vos emails</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Un lien de confirmation a été envoyé à <strong>{email}</strong>.
                    </p>
                    <Link href="/auth/login" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 400, margin: '4rem auto', width: '100%', padding: '0 1rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Inscription</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Créez votre compte pour sauvegarder votre progression.</p>
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

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                            minLength={6}
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
                                Créer mon compte
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Vous avez déjà un compte ?{' '}
                    <Link href="/auth/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                        Se connecter
                    </Link>
                </div>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
