'use client';

import React, { useState } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calculator, Play, Info } from 'lucide-react';
import Latex from '@/components/Latex';

// --- Simulations Logic ---

type BetResult = 'win' | 'loss';

interface PathDataPoint {
    flipNumber: number;
    flat: number;
    martingale: number;
    fibonacci: number;
    betAmountFlat: number;
    betAmountMartingale: number;
    betAmountFibonacci: number;
    result: BetResult;
}

const generateSequence = (
    numFlips: number,
    winProbability: number,
    initialBankroll: number,
    baseBet: number
): PathDataPoint[] => {
    const data: PathDataPoint[] = [];

    let bankrollFlat = initialBankroll;
    let bankrollMartingale = initialBankroll;
    let bankrollFibonacci = initialBankroll;

    let betMartingale = baseBet;
    let betFibonacciIndex = 1; // F_1 = 1, F_2 = 1, F_3 = 2...

    // pre-calculate some fibonacci numbers
    const fibArray = [0, 1, 1];
    for (let i = 3; i <= 50; i++) {
        fibArray.push(fibArray[i - 1] + fibArray[i - 2]);
    }
    const getFib = (idx: number) => {
        if (idx >= fibArray.length) return fibArray[fibArray.length - 1]; // cap it to prevent infinite growth issues in JS
        return fibArray[idx];
    };

    // Push initial state
    data.push({
        flipNumber: 0,
        flat: bankrollFlat,
        martingale: bankrollMartingale,
        fibonacci: bankrollFibonacci,
        betAmountFlat: 0,
        betAmountMartingale: 0,
        betAmountFibonacci: 0,
        result: 'win', // dummy
    });

    for (let i = 1; i <= numFlips; i++) {
        const isWin = Math.random() < winProbability;
        const result: BetResult = isWin ? 'win' : 'loss';

        // 1. Flat Betting
        const betFlat = baseBet;
        if (bankrollFlat > 0) {
            const actualBetFlat = Math.min(betFlat, bankrollFlat); // can't bet more than we have
            bankrollFlat += isWin ? actualBetFlat : -actualBetFlat;
        }

        // 2. Martingale
        const currentBetMartingale = betMartingale;
        if (bankrollMartingale > 0) {
            const actualBetMartingale = Math.min(currentBetMartingale, bankrollMartingale);
            bankrollMartingale += isWin ? actualBetMartingale : -actualBetMartingale;
            // Next bet size:
            if (isWin) {
                betMartingale = baseBet; // reset
            } else {
                betMartingale = currentBetMartingale * 2; // double
            }
        }

        // 3. Fibonacci
        const currentBetFibonacci = getFib(betFibonacciIndex) * baseBet;
        if (bankrollFibonacci > 0) {
            const actualBetFibonacci = Math.min(currentBetFibonacci, bankrollFibonacci);
            bankrollFibonacci += isWin ? actualBetFibonacci : -actualBetFibonacci;
            // Next bet index:
            if (isWin) {
                betFibonacciIndex = Math.max(1, betFibonacciIndex - 2); // go back 2 steps
            } else {
                betFibonacciIndex++; // go forward 1 step
            }
        }

        data.push({
            flipNumber: i,
            flat: bankrollFlat,
            martingale: bankrollMartingale,
            fibonacci: bankrollFibonacci,
            betAmountFlat: betFlat,
            betAmountMartingale: currentBetMartingale,
            betAmountFibonacci: currentBetFibonacci,
            result,
        });

        // Early exit if all bankrupt to save rendering huge flatlines?
        // Let's just track it out so the chart X axis stays consistent.
    }

    return data;
};

// --- Component ---

export default function BettingStrategiesSimulator() {
    const { locale: language } = useLanguage();

    // Setup state
    const [numFlips, setNumFlips] = useState<number>(100);
    const [winProb, setWinProb] = useState<number>(0.4737); // European Roulette Red/Black (18/38 or 18/37? European is 18/37 = 48.6%. American is 18/38 = 47.37%)
    const [initialBankroll, setInitialBankroll] = useState<number>(1000);
    const [baseBet, setBaseBet] = useState<number>(10);
    const [chartData, setChartData] = useState<PathDataPoint[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const content = {
        title: language === 'fr' ? 'Simulateur de Systèmes de Paris' : 'Betting Systems Simulator',
        description: language === 'fr'
            ? 'Simulez et comparez l\'évolution du capital sous 3 stratégies (Mise Fixe, Martingale, Fibonacci) pour comprendre le "Risk of Ruin".'
            : 'Simulate and compare bankroll evolution across 3 strategies (Flat, Martingale, Fibonacci) to understand the "Risk of Ruin".',
        params: {
            flips: language === 'fr' ? 'Nombre de Paris (N)' : 'Number of Bets (N)',
            prob: language === 'fr' ? 'Probabilité de Gain ($p$)' : 'Win Probability ($p$)',
            bankroll: language === 'fr' ? 'Capital Initial' : 'Initial Bankroll',
            baseBet: language === 'fr' ? 'Mise de Base' : 'Base Bet',
        },
        runBtn: language === 'fr' ? 'Lancer la Simulation' : 'Run Simulation',
        strategies: {
            flat: language === 'fr' ? 'Mise Fixe (Flat)' : 'Flat Betting',
            martingale: 'Martingale',
            fibonacci: 'Fibonacci'
        },
        tooltips: {
            flip: language === 'fr' ? 'Pari' : 'Bet',
            result: language === 'fr' ? 'Résultat' : 'Result',
            win: language === 'fr' ? 'Gagné' : 'Win',
            loss: language === 'fr' ? 'Perdu' : 'Loss',
            betSize: language === 'fr' ? 'Mise' : 'Bet Size'
        }
    };

    const handleSimulate = () => {
        setIsSimulating(true);
        setTimeout(() => {
            const data = generateSequence(numFlips, winProb, initialBankroll, baseBet);
            setChartData(data);
            setIsSimulating(false);
        }, 50); // slight delay for UI feedback
    };

    // Run once on mount
    React.useEffect(() => {
        handleSimulate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload as PathDataPoint;
            return (
                <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-xl text-sm">
                    <p className="font-bold text-white mb-2">{content.tooltips.flip} #{label}</p>
                    {label > 0 && (
                        <p className={`font-semibold mb-2 ${dataPoint.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                            {content.tooltips.result}: {dataPoint.result === 'win' ? content.tooltips.win : content.tooltips.loss}
                        </p>
                    )}
                    <div className="space-y-1">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {payload.map((entry: any, index: number) => {
                            let expectedBetAmount = 0;
                            if (entry.dataKey === 'flat') expectedBetAmount = dataPoint.betAmountFlat;
                            if (entry.dataKey === 'martingale') expectedBetAmount = dataPoint.betAmountMartingale;
                            if (entry.dataKey === 'fibonacci') expectedBetAmount = dataPoint.betAmountFibonacci;

                            return (
                                <div key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
                                    <span>{entry.name}:</span>
                                    <span className="font-mono">
                                        Val: {entry.value.toFixed(0)} | {content.tooltips.betSize}: {label > 0 ? expectedBetAmount.toFixed(0) : '-'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">{content.title}</h1>
                <p className="page-subtitle">{content.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* Controls Sidebar */}
                <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <Calculator size={20} className="text-secondary" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{language === 'fr' ? 'Paramètres' : 'Parameters'}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary"><Latex>{content.params.flips}</Latex></label>
                                <span className="text-primary font-mono">{numFlips}</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="2000"
                                step="10"
                                value={numFlips}
                                onChange={(e) => setNumFlips(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary"><Latex>{content.params.prob}</Latex></label>
                                <span className="text-primary font-mono">{(winProb * 100).toFixed(2)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.01"
                                max="0.99"
                                step="0.01"
                                value={winProb}
                                onChange={(e) => setWinProb(Number(e.target.value))}
                                className="w-full"
                            />
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {language === 'fr' ? '47.37% = Roulette Américaine' : '47.37% = American Roulette'}
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{content.params.bankroll}</label>
                                <span className="text-primary font-mono">${initialBankroll}</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="10000"
                                step="100"
                                value={initialBankroll}
                                onChange={(e) => setInitialBankroll(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <label className="text-secondary">{content.params.baseBet}</label>
                                <span className="text-primary font-mono">${baseBet}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="500"
                                step="1"
                                value={baseBet}
                                onChange={(e) => setBaseBet(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <button
                            onClick={handleSimulate}
                            disabled={isSimulating}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            {isSimulating ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Play size={16} />}
                            {content.runBtn}
                        </button>
                    </div>
                </div>

                {/* Chart Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{language === 'fr' ? 'Évolution du Capital (Drawdowns)' : 'Bankroll Evolution (Drawdowns)'}</h2>
                        </div>

                        <div style={{ height: 400, width: '100%' }}>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis
                                            dataKey="flipNumber"
                                            stroke="rgba(255,255,255,0.3)"
                                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.3)"
                                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            tickFormatter={(val: any) => '$' + val}
                                            domain={['auto', 'auto']}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                                        <ReferenceLine y={initialBankroll} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 3" />

                                        <Line
                                            type="monotone"
                                            dataKey="flat"
                                            name={content.strategies.flat}
                                            stroke="#3b82f6" // blue
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                                            animationDuration={1500}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="fibonacci"
                                            name={content.strategies.fibonacci}
                                            stroke="#10b981" // emerald
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff' }}
                                            strokeDasharray="5 5"
                                            animationDuration={1500}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="martingale"
                                            name={content.strategies.martingale}
                                            stroke="#f97316" // orange
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, fill: '#f97316', stroke: '#fff' }}
                                            animationDuration={1500}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : null}
                        </div>
                    </div>

                    {/* Interview Context Block */}
                    <div className="glass-card" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ color: '#818cf8', marginTop: '0.1rem' }}>
                                <Info size={20} />
                            </div>
                            <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>
                                    {language === 'fr' ? 'Pertinence pour les Entretiens en Finance' : 'Relevance for Finance Interviews'}
                                </h3>
                                <p style={{ marginBottom: '1rem' }}>
                                    {language === 'fr' ? 'Ce simulateur est extrêmement pertinent pour les entretiens en finance de marché (Quant, Structuration, Trading).' : 'This simulator is highly relevant for market finance interviews (Quant, Structuring, Trading).'}
                                </p>
                                <ul style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="list-disc">
                                    <li>
                                        <strong style={{ color: 'var(--text-primary)' }}>{language === 'fr' ? 'La Martingale (Stratégie vs Mathématiques) :' : 'Martingale (Strategy vs Mathematics):'}</strong>{' '}
                                        {language === 'fr'
                                            ? 'Les recruteurs demandent souvent pourquoi la stratégie de la Martingale (doubler sa mise) ne fonctionne pas en bourse. La réponse attendue est le risque de ruine lié au ' : 'Recruiters often ask why the Martingale strategy (doubling down) fails in markets. The expected answer is the risk of ruin due to '}
                                        <span style={{ color: '#818cf8' }}>{language === 'fr' ? 'capital fini et aux limites de taille de position.' : 'finite capital and position size limits.'}</span>{' '}
                                        {language === 'fr'
                                            ? 'Ensuite, ils font la transition vers le concept mathématique de Martingale (un processus où l\'espérance conditionnelle future est égale à la valeur présente, fondamental pour le Pricing Neutre au Risque).' : 'They then transition to the mathematical concept of a Martingale (a process where future conditional expectation equals present value, fundamental for Risk-Neutral Pricing).'}
                                    </li>
                                    <li>
                                        <strong style={{ color: 'var(--text-primary)' }}>{language === 'fr' ? 'Risque de Ruine (Risk of Ruin) :' : 'Risk of Ruin:'}</strong>{' '}
                                        {language === 'fr'
                                            ? 'Apprendre à gérer son capital est la règle numéro une. Un drawdown trop profond empêche mathématiquement de remonter la pente (asymétrie des rendements).' : 'Capital preservation is the number one rule. A drawdown that is too deep makes it mathematically impossible to recover (return asymmetry).'}
                                    </li>
                                    <li>
                                        <strong style={{ color: 'var(--text-primary)' }}>{language === 'fr' ? 'Kelly Criterion :' : 'Kelly Criterion:'}</strong>{' '}
                                        {language === 'fr'
                                            ? 'Une question bonus classique est "Si vous avez un edge (probabilité de gain > 50%), comment dimensionnez-vous votre pari ?". La réponse optimale n\'est jamais la Martingale, mais le Critère de Kelly.' : 'A classic bonus question is "If you have an edge (win probability > 50%), how do you size your bet?". The optimal answer is never the Martingale, but the Kelly Criterion.'}
                                    </li>
                                </ul>
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
