'use client';

import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Calculator, Play, Info, BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Latex from '@/components/Latex';

export default function MonteCarloPage() {
    const { t } = useLanguage();

    const [S0, setS0] = useState(100);
    const [K, setK] = useState(100);
    const [T, setT] = useState(1);
    const [r, setR] = useState(0.05);
    const [sigma, setSigma] = useState(0.2);
    const [numPaths, setNumPaths] = useState(10);
    const [numSteps] = useState(100);

    const [paths, setPaths] = useState<number[][]>([]);
    const [expectedCall, setExpectedCall] = useState<number | null>(null);
    const [expectedPut, setExpectedPut] = useState<number | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // Black-Scholes formulas for comparison
    const d1 = (Math.log(S0 / K) + (r + (sigma ** 2) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    // Standard Normal CDF approximation
    const normalCDF = (x: number) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        if (x > 0) p = 1 - p;
        return p;
    };

    const bsCall = S0 * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    const bsPut = K * Math.exp(-r * T) * normalCDF(-d2) - S0 * normalCDF(-d1);

    // Box-Muller transform for normal distribution
    const generateRandomNormal = () => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return num;
    };

    const runSimulation = () => {
        setIsSimulating(true);

        // Run slightly asynchronously to allow UI to update loading state
        setTimeout(() => {
            const dt = T / numSteps;
            const drift = (r - 0.5 * sigma * sigma) * dt;
            const vol = sigma * Math.sqrt(dt);

            const newPaths: number[][] = [];
            let sumCallPayoffs = 0;
            let sumPutPayoffs = 0;

            for (let i = 0; i < numPaths; i++) {
                const path = [S0];
                let currentS = S0;

                for (let j = 1; j <= numSteps; j++) {
                    const z = generateRandomNormal();
                    currentS = currentS * Math.exp(drift + vol * z);
                    path.push(currentS);
                }

                newPaths.push(path);

                const finalS = path[numSteps];
                sumCallPayoffs += Math.max(0, finalS - K);
                sumPutPayoffs += Math.max(0, K - finalS);
            }

            setPaths(newPaths);

            const discount = Math.exp(-r * T);
            setExpectedCall((sumCallPayoffs / numPaths) * discount);
            setExpectedPut((sumPutPayoffs / numPaths) * discount);

            setIsSimulating(false);
        }, 50);
    };

    // Run initial simulation on mount
    useEffect(() => {
        runSimulation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const chartData = useMemo(() => {
        if (paths.length === 0) return [];

        return Array.from({ length: numSteps + 1 }).map((_, stepIdx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const point: any = { time: ((stepIdx / numSteps) * T).toFixed(2) };
            paths.slice(0, 100).forEach((path, pathIdx) => {
                point[`path${pathIdx}`] = path[stepIdx];
            });
            return point;
        });
    }, [paths, numSteps, T]);

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">{t({ fr: 'Simulateur Monte Carlo', en: 'Monte Carlo Simulator' })}</h1>
                <p className="page-subtitle">
                    {t({
                        fr: 'Simulez les trajectoires d\'un prix d\'actif (Mouvement Brownien Géométrique) et observez la convergence vers le prix de Black-Scholes par la Loi des Grands Nombres.',
                        en: 'Simulate asset price paths (Geometric Brownian Motion) and observe the convergence to the Black-Scholes price via the Law of Large Numbers.'
                    })}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* Controls Sidebar */}
                <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <Calculator size={20} className="text-secondary" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t({ fr: 'Paramètres', en: 'Parameters' })}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{t({ fr: 'Prix Spot', en: 'Spot Price' })} (<Latex>$S_0$</Latex>)</label>
                                <span className="text-primary font-mono">{S0}</span>
                            </div>
                            <input type="range" min="50" max="150" step="1" value={S0} onChange={(e) => setS0(Number(e.target.value))} className="w-full" />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{t({ fr: 'Strike (Prix d\'exercice)', en: 'Strike Price' })} (<Latex>$K$</Latex>)</label>
                                <span className="text-primary font-mono">{K}</span>
                            </div>
                            <input type="range" min="50" max="150" step="1" value={K} onChange={(e) => setK(Number(e.target.value))} className="w-full" />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{t({ fr: 'Volatilité Implicite', en: 'Implied Volatility' })} ($\\sigma$)</label>
                                <span className="text-primary font-mono">{(sigma * 100).toFixed(1)}%</span>
                            </div>
                            <input type="range" min="0.05" max="0.80" step="0.01" value={sigma} onChange={(e) => setSigma(Number(e.target.value))} className="w-full" />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{t({ fr: 'Taux Sans Risque', en: 'Risk-Free Rate' })} (<Latex>$r$</Latex>)</label>
                                <span className="text-primary font-mono">{(r * 100).toFixed(1)}%</span>
                            </div>
                            <input type="range" min="0.0" max="0.10" step="0.01" value={r} onChange={(e) => setR(Number(e.target.value))} className="w-full" />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{t({ fr: 'Maturité (années)', en: 'Maturity (years)' })} (<Latex>$T$</Latex>)</label>
                                <span className="text-primary font-mono">{T}</span>
                            </div>
                            <input type="range" min="0.1" max="5" step="0.1" value={T} onChange={(e) => setT(Number(e.target.value))} className="w-full" />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{t({ fr: 'Nombre de Simulations', en: 'Number of Paths' })} (<Latex>$N$</Latex>)</label>
                                <span className="text-primary font-mono">{numPaths.toLocaleString()}</span>
                            </div>
                            <input type="range" min="10" max="10000" step="10" value={numPaths} onChange={(e) => setNumPaths(Number(e.target.value))} className="w-full" />
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {t({ fr: 'Plus N est grand, plus la précision augmente.', en: 'Larger N yields higher precision.' })}
                            </div>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={isSimulating}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            {isSimulating ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Play size={16} />}
                            {t({ fr: 'Lancer MC', en: 'Run MC' })}
                        </button>
                    </div>
                </div>

                {/* Results & Chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div className="glass-card" style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                Call Option
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monte Carlo</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                    {expectedCall?.toFixed(3)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Black-Scholes</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#3b82f6', fontFamily: 'monospace' }}>
                                    {bsCall.toFixed(3)}
                                </span>
                            </div>
                            {expectedCall !== null && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                                    Erreur: {Math.abs(expectedCall - bsCall).toFixed(4)}
                                </div>
                            )}
                        </div>

                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                Put Option
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monte Carlo</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                    {expectedPut?.toFixed(3)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Black-Scholes</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ec4899', fontFamily: 'monospace' }}>
                                    {bsPut.toFixed(3)}
                                </span>
                            </div>
                            {expectedPut !== null && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                                    Erreur: {Math.abs(expectedPut - bsPut).toFixed(4)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <BarChart size={20} className="text-secondary" />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t({ fr: 'Trajectoires Simulées', en: 'Simulated Paths' })}</h2>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                {t({ fr: 'Affiche max 100 trajectoires pour performance', en: 'Showing max 100 paths for performance' })}
                            </span>
                        </div>

                        <div style={{ height: 400, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="rgba(255,255,255,0.3)"
                                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                        label={{ value: t({ fr: 'Temps t (années)', en: 'Time t (years)' }), position: 'bottom', offset: 0, fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.3)"
                                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                        domain={['auto', 'auto']}
                                        label={{ value: t({ fr: 'Prix du sous-jacent S(t)', en: 'Underlying Price S(t)' }), angle: -90, position: 'left', offset: -10, fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                    />

                                    {paths.length > 0 && Array.from({ length: Math.min(paths.length, 100) }).map((_, idx) => (
                                        <Line
                                            key={idx}
                                            type="monotone"
                                            dataKey={`path${idx}`}
                                            stroke={`hsla(${(idx * 137.5) % 360}, 70%, 60%, ${paths.length > 30 ? 0.3 : 0.6})`}
                                            strokeWidth={1}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    ))}

                                    {/* Strike Line Reference */}
                                    <Line
                                        type="step"
                                        dataKey={() => K}
                                        stroke="rgba(255,255,255,0.8)"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        isAnimationActive={false}
                                    />

                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ color: '#3b82f6', marginTop: '0.1rem' }}>
                                <Info size={20} />
                            </div>
                            <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                    {t({ fr: 'Biais Statistique (Loi Normale)', en: 'Statistical Bias (Normal Distribution)' })}
                                </h4>
                                <p>
                                    <Latex>
                                        {t({
                                            fr: 'Ici on évalue $\\hat{P}_0 = e^{-rT} \\frac{1}{N} \\sum_{i=1}^{N} h(S_T^{(i)})$. Plus le nombre de simulations $N$ est grand, plus l\'erreur se réduit (vitesse de $1/\\sqrt{N}$). Pour des options path-dependent sans solution analytique, MC devient le standard du marché.',
                                            en: 'Here we evaluate $\\hat{P}_0 = e^{-rT} \\frac{1}{N} \\sum_{i=1}^{N} h(S_T^{(i)})$. The larger the simulation count $N$, the smaller the error (speed of $1/\\sqrt{N}$). For path-dependent options with no analytical solution, MC becomes the market standard.'
                                        })}
                                    </Latex>
                                </p>
                                <p style={{ marginTop: '0.5rem' }}>
                                    {t({
                                        fr: 'Astuce : L\'erreur au dessus affiche la distance avec la solution exacte de B&S. Augmentez N pour voir l\'erreur tendre vers 0 !',
                                        en: 'Tip: The error above displays the distance to the exact B&S solution. Increase N to watch the error converge to 0!'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
        .spinner {
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
      `}</style>
        </div>
    );
}
