'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BarChart3, Users, BookOpen, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ users: 0, activeToday: 0 });
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        } else if (user) {
            // Check admin status
            supabase.from('profiles').select('role').eq('id', user.id).single()
                .then(({ data, error }) => {
                    if (data?.role === 'admin') {
                        setIsAdmin(true);
                        // Fetch stats (mocked for visual CMS structure unless you have extensive RLS for counting users)
                        setStats({ users: 12, activeToday: 3 });
                    } else {
                        setIsAdmin(false);
                    }
                });
        }
    }, [user, loading, router]);

    if (loading || isAdmin === null) return <div style={{ padding: '4rem', textAlign: 'center' }}>Chargement...</div>;

    if (!isAdmin) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <ShieldAlert size={48} style={{ color: 'var(--red)', margin: '0 auto 1rem' }} />
                <h1>Accès refusé</h1>
                <p>Panneau d'administration réservé.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart3 className="text-accent" />
                CMS & Administration
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <Users />
                        <span style={{ fontWeight: 600 }}>Utilisateurs Inscrits</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.users}</div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <BarChart3 />
                        <span style={{ fontWeight: 600 }}>Actifs Aujourd'hui</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.activeToday}</div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <BookOpen />
                        <span style={{ fontWeight: 600 }}>Contenu (Modules)</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>10</div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Outils de gestion</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    L'ajout de contenu (Brainteasers, Exercices) est actuellement géré via les fichiers statiques (src/data). 
                    Une future migration vers des tables Supabase complètes permettra l'édition directement ici.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" disabled>Éditer Modules</button>
                    <button className="btn btn-outline" disabled>Gérer Utilisateurs</button>
                </div>
            </div>
        </div>
    );
}
