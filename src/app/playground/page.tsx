'use client';

import React, { useState } from 'react';
import { ArrowLeft, Terminal, Lightbulb, Code2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { CodeRunner } from '@/components/CodeRunner';

const LANG_BOILERPLATES: Record<string, string> = {
    python: `import math

# Playground Python — Finance Quantitative
# Testez vos algorithmes de pricing ici.

def black_scholes_call(S, K, T, r, sigma):
    from math import log, sqrt, exp, erf
    d1 = (log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrt(T))
    d2 = d1 - sigma * sqrt(T)
    N = lambda x: 0.5 * (1 + erf(x / sqrt(2)))
    return S * N(d1) - K * exp(-r * T) * N(d2)

price = black_scholes_call(100, 105, 1, 0.05, 0.2)
print(f"Prix du Call BS : {price:.4f} EUR")
`,
    cpp: `#include <iostream>
#include <cmath>
#include <vector>

using namespace std;

// Playground C++ — Performance & Architecture
// Compilez vos classes de Payoff ici.

class Payoff {
public:
    virtual double operator()(double S) const = 0;
    virtual ~Payoff() {}
};

class CallPayoff : public Payoff {
    double K;
public:
    CallPayoff(double strike) : K(strike) {}
    double operator()(double S) const override {
        return max(S - K, 0.0);
    }
};

int main() {
    CallPayoff call(105.0);
    cout << "Payoff Call(S=110, K=105) = " << call(110.0) << endl;
    cout << "Payoff Call(S=100, K=105) = " << call(100.0) << endl;
    return 0;
}
`,
    javascript: `// Playground JavaScript — Logique Métier
// Prototypez vos fonctions de pricing.

const payoffCall = (S, K) => Math.max(S - K, 0);
const payoffPut  = (S, K) => Math.max(K - S, 0);

const S = 100, K = 105;
console.log("Call Payoff:", payoffCall(S, K));
console.log("Put Payoff:",  payoffPut(S, K));

// Simulation simple
const spots = [90, 95, 100, 105, 110, 115, 120];
spots.forEach(s => {
    console.log(\`S=\${s} → Call=\${payoffCall(s,K)}, Put=\${payoffPut(s,K)}\`);
});
`
};

const EXERCISE_IDEAS = [
    {
        title: 'Pricing Black-Scholes',
        desc_fr: 'Calculez le prix d\'un Call européen avec la formule analytique.',
        desc_en: 'Compute a European Call price using the analytical formula.',
        lang: 'Python',
    },
    {
        title: 'Arbre Binomial CRR',
        desc_fr: 'Implémentez un arbre CRR pour pricer un Put Américain.',
        desc_en: 'Implement a CRR tree to price an American Put.',
        lang: 'C++',
    },
    {
        title: 'Monte Carlo GBM',
        desc_fr: 'Simulez un Mouvement Brownien Géométrique et pricez un Call.',
        desc_en: 'Simulate a Geometric Brownian Motion and price a Call.',
        lang: 'Python',
    },
    {
        title: 'Payoff Classes',
        desc_fr: 'Créez une hiérarchie de classes avec polymorphisme pour les payoffs.',
        desc_en: 'Build a class hierarchy with polymorphism for payoff structures.',
        lang: 'C++',
    },
];

export default function PlaygroundPage() {
    const { t } = useLanguage();
    const [language, setLanguage] = useState<'python' | 'cpp' | 'javascript'>('python');
    const [code, setCode] = useState(LANG_BOILERPLATES['python']);

    const handleLanguageChange = (lang: 'python' | 'cpp' | 'javascript') => {
        setLanguage(lang);
        setCode(LANG_BOILERPLATES[lang]);
    };

    const langs: Array<{ key: 'python' | 'cpp' | 'javascript'; label: string }> = [
        { key: 'python', label: 'Python' },
        { key: 'cpp', label: 'C++' },
        { key: 'javascript', label: 'JavaScript' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                transition: 'color var(--transition-fast)',
            }}>
                <ArrowLeft size={15} />
                {t({ fr: 'Retour à l\'accueil', en: 'Back to Home' })}
            </Link>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Terminal style={{ width: 28, height: 28, color: 'var(--green)' }} />
                        {t({ fr: 'Playground Quantitatif', en: 'Quantitative Playground' })}
                    </h1>
                    <p className="page-subtitle" style={{ maxWidth: 600 }}>
                        {t({
                            fr: 'Testez librement vos algorithmes de pricing, méthodes numériques et structures de données directement dans le navigateur.',
                            en: 'Freely test your pricing algorithms, numerical methods and data structures directly in the browser.'
                        })}
                    </p>
                </div>

                {/* Language Selector */}
                <div className="glass-card-static" style={{ padding: '0.25rem', display: 'flex', gap: '0.25rem' }}>
                    {langs.map(l => (
                        <button
                            key={l.key}
                            onClick={() => handleLanguageChange(l.key)}
                            style={{
                                padding: '0.5rem 1.1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'all var(--transition-fast)',
                                background: language === l.key ? 'var(--gradient-blue)' : 'transparent',
                                color: language === l.key ? '#fff' : 'var(--text-muted)',
                                boxShadow: language === l.key ? 'var(--shadow-glow-blue)' : 'none',
                            }}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.25rem', alignItems: 'start' }}>

                {/* Sidebar — Exercise Ideas */}
                <div className="glass-card-static" style={{ padding: '1.25rem' }}>
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--amber)',
                        marginBottom: '1rem',
                    }}>
                        <Lightbulb size={16} />
                        {t({ fr: 'Idées d\'exercices', en: 'Exercise Ideas' })}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {EXERCISE_IDEAS.map((idea, i) => (
                            <div key={i} style={{
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{idea.title}</span>
                                    <span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>{idea.lang}</span>
                                </div>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                                    {t({ fr: idea.desc_fr, en: idea.desc_en })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Code Editor Area */}
                <div>
                    <CodeRunner
                        key={language}
                        language={language}
                        initialCode={code}
                    />
                </div>
            </div>
        </div>
    );
}
