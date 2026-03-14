'use client';

import { useState, useMemo } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bilingual } from '@/contexts/LanguageContext';

type Strategy = 'long-call' | 'long-put' | 'short-call' | 'short-put' | 'bull-spread' | 'bear-spread' | 'straddle' | 'collar' | 'capital-garanti' | 'reverse-convertible' | 'autocall';

const strategies: { id: Strategy; label: string; category: Bilingual; description: Bilingual }[] = [
    { id: 'long-call', label: 'Long Call', category: { fr: 'Vanille', en: 'Vanilla' }, description: { fr: "Droit d'acheter au strike K. Gain illimité, perte limitée à la prime.", en: 'Right to buy at strike K. Unlimited upside, loss limited to premium.' } },
    { id: 'long-put', label: 'Long Put', category: { fr: 'Vanille', en: 'Vanilla' }, description: { fr: 'Droit de vendre au strike K. Profite de la baisse, perte limitée à la prime.', en: 'Right to sell at strike K. Profits from decline, loss limited to premium.' } },
    { id: 'short-call', label: 'Short Call', category: { fr: 'Vanille', en: 'Vanilla' }, description: { fr: 'Obligation de vendre au strike K. Gain limité à la prime, risque illimité.', en: 'Obligation to sell at strike K. Gain limited to premium, unlimited risk.' } },
    { id: 'short-put', label: 'Short Put', category: { fr: 'Vanille', en: 'Vanilla' }, description: { fr: "Obligation d'acheter au strike K. Gain limité à la prime, risque de perte élevé.", en: 'Obligation to buy at strike K. Gain limited to premium, high downside risk.' } },
    { id: 'bull-spread', label: 'Bull Call Spread', category: { fr: 'Stratégie', en: 'Strategy' }, description: { fr: 'Long Call K₁ + Short Call K₂. Gain et perte limités. Vue modérément haussière.', en: 'Long Call K₁ + Short Call K₂. Capped gain and loss. Moderately bullish view.' } },
    { id: 'bear-spread', label: 'Bear Put Spread', category: { fr: 'Stratégie', en: 'Strategy' }, description: { fr: 'Long Put K₂ + Short Put K₁. Gain et perte limités. Vue modérément baissière.', en: 'Long Put K₂ + Short Put K₁. Capped gain and loss. Moderately bearish view.' } },
    { id: 'straddle', label: 'Long Straddle', category: { fr: 'Stratégie', en: 'Strategy' }, description: { fr: 'Long Call + Long Put même strike. Profite de la volatilité (hausse ou baisse forte).', en: 'Long Call + Long Put same strike. Profits from volatility (strong move either way).' } },
    { id: 'collar', label: 'Collar', category: { fr: 'Stratégie', en: 'Strategy' }, description: { fr: 'Long stock + Long Put K₁ + Short Call K₂. Protection avec coût réduit.', en: 'Long stock + Long Put K₁ + Short Call K₂. Protection at reduced cost.' } },
    { id: 'capital-garanti', label: 'Capital Garanti', category: { fr: 'Structuré', en: 'Structured' }, description: { fr: 'ZC + Call = protection du capital + participation à la hausse.', en: 'ZC + Call = capital protection + upside participation.' } },
    { id: 'reverse-convertible', label: 'Reverse Convertible', category: { fr: 'Structuré', en: 'Structured' }, description: { fr: 'ZC + Short Put = coupon élevé avec risque de perte en capital.', en: 'ZC + Short Put = high coupon with capital loss risk.' } },
    { id: 'autocall', label: 'Autocall', category: { fr: 'Structuré', en: 'Structured' }, description: { fr: 'Payoff conditionnel avec barrière de protection et coupon.', en: 'Conditional payoff with protection barrier and coupon.' } },
];

function computePayoff(strategy: Strategy, spot: number, params: { strike: number; strike2: number; premium: number; premium2: number; barrier: number; coupon: number; participation: number }) {
    const { strike, strike2, premium, premium2, barrier, coupon, participation } = params;
    const S = spot;
    const K = strike;
    const K2 = strike2;

    switch (strategy) {
        case 'long-call': return Math.max(S - K, 0) - premium;
        case 'long-put': return Math.max(K - S, 0) - premium;
        case 'short-call': return premium - Math.max(S - K, 0);
        case 'short-put': return premium - Math.max(K - S, 0);
        case 'bull-spread': return Math.max(S - K, 0) - Math.max(S - K2, 0) - (premium - premium2);
        case 'bear-spread': return Math.max(K2 - S, 0) - Math.max(K - S, 0) - (premium - premium2);
        case 'straddle': return Math.max(S - K, 0) + Math.max(K - S, 0) - premium - premium2;
        case 'collar': return (S - 100) + Math.max(K - S, 0) - Math.max(S - K2, 0);
        case 'capital-garanti': return participation / 100 * Math.max(S / 100 - 1, 0) * 100;
        case 'reverse-convertible': return S >= K ? coupon : (S - 100) + coupon;
        case 'autocall': return S >= K ? coupon : (S >= barrier ? 0 : S - 100);
        default: return 0;
    }
}

export default function VisualisationPage() {
    const { t } = useLanguage();
    const [strategy, setStrategy] = useState<Strategy>('long-call');
    const [strike, setStrike] = useState(100);
    const [strike2, setStrike2] = useState(120);
    const [premium, setPremium] = useState(5);
    const [premium2, setPremium2] = useState(3);
    const [barrier, setBarrier] = useState(70);
    const [coupon, setCoupon] = useState(8);
    const [participation, setParticipation] = useState(80);

    const params = { strike, strike2, premium, premium2, barrier, coupon, participation };
    const currentStrategy = strategies.find(s => s.id === strategy)!;

    const data = useMemo(() => {
        const points = [];
        for (let s = 50; s <= 150; s += 1) {
            points.push({
                spot: s,
                payoff: computePayoff(strategy, s, params),
            });
        }
        return points;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [strategy, strike, strike2, premium, premium2, barrier, coupon, participation]);

    const needsStrike2 = ['bull-spread', 'bear-spread', 'collar'].includes(strategy);
    const needsPremium2 = ['straddle', 'bull-spread', 'bear-spread'].includes(strategy);
    const needsBarrier = ['autocall'].includes(strategy);
    const needsCoupon = ['reverse-convertible', 'autocall'].includes(strategy);
    const needsParticipation = ['capital-garanti'].includes(strategy);
    const isStructured = ['capital-garanti', 'reverse-convertible', 'autocall'].includes(strategy);

    // Unique category list preserving order
    const categories = [...new Map(strategies.map(s => [JSON.stringify(s.category), s.category])).values()];

    return (
        <div className="page-container">
            <h1 className="page-title">{t({ fr: 'Visualisation 2D', en: '2D Visualization' })}</h1>
            <p className="page-subtitle">{t({ fr: 'Diagrammes de payoff interactifs pour options et produits structurés.', en: 'Interactive payoff diagrams for options and structured products.' })}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Strategy Selector */}
                    <div className="glass-card-static" style={{ padding: '1rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                            {t({ fr: 'Stratégie', en: 'Strategy' })}
                        </label>
                        {categories.map(cat => (
                            <div key={JSON.stringify(cat)} style={{ marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{t(cat)}</div>
                                {strategies.filter(s => JSON.stringify(s.category) === JSON.stringify(cat)).map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStrategy(s.id)}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '0.4rem 0.6rem',
                                            background: strategy === s.id ? 'rgba(59,130,246,0.12)' : 'transparent',
                                            border: strategy === s.id ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                                            borderRadius: 6,
                                            color: strategy === s.id ? '#60a5fa' : 'var(--text-secondary)',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontFamily: 'inherit',
                                            marginBottom: 2,
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Parameters */}
                    <div className="glass-card-static" style={{ padding: '1rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.75rem' }}>
                            {t({ fr: 'Paramètres', en: 'Parameters' })}
                        </label>

                        <SliderControl label={isStructured ? t({ fr: 'Strike / Barrière autocall', en: 'Strike / Autocall Barrier' }) : t({ fr: 'Strike K', en: 'Strike K' })} value={strike} onChange={setStrike} min={70} max={130} />
                        {!isStructured && <SliderControl label={t({ fr: 'Prime', en: 'Premium' })} value={premium} onChange={setPremium} min={0} max={20} step={0.5} />}
                        {needsStrike2 && <SliderControl label={t({ fr: 'Strike K₂', en: 'Strike K₂' })} value={strike2} onChange={setStrike2} min={80} max={140} />}
                        {needsPremium2 && <SliderControl label={t({ fr: 'Prime 2', en: 'Premium 2' })} value={premium2} onChange={setPremium2} min={0} max={20} step={0.5} />}
                        {needsBarrier && <SliderControl label={t({ fr: 'Barrière protection', en: 'Protection Barrier' })} value={barrier} onChange={setBarrier} min={50} max={100} />}
                        {needsCoupon && <SliderControl label={t({ fr: 'Coupon (%)', en: 'Coupon (%)' })} value={coupon} onChange={setCoupon} min={1} max={20} />}
                        {needsParticipation && <SliderControl label={t({ fr: 'Participation (%)', en: 'Participation (%)' })} value={participation} onChange={setParticipation} min={20} max={150} />}
                    </div>
                </div>

                {/* Chart */}
                <div className="glass-card-static">
                    <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentStrategy.label}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t(currentStrategy.description)}</p>
                    </div>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis
                                    dataKey="spot"
                                    stroke="rgba(255,255,255,0.2)"
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    label={{ value: t({ fr: 'Spot à maturité', en: 'Spot at Maturity' }), position: 'insideBottom', offset: -5, style: { fill: '#64748b', fontSize: 11 } }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    label={{ value: 'P&L', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 11 } }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 8,
                                        fontSize: 12,
                                        color: '#f1f5f9',
                                    }}
                                    formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(2)}`, 'P&L']}
                                    labelFormatter={(label) => `Spot: ${label}`}
                                />
                                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                                <ReferenceLine x={strike} stroke="rgba(59,130,246,0.3)" strokeDasharray="4 4" />
                                <defs>
                                    <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="payoff"
                                    stroke="#3b82f6"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SliderControl({ label, value, onChange, min, max, step = 1 }: {
    label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number;
}) {
    return (
        <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                    width: '100%',
                    height: 4,
                    borderRadius: 2,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    outline: 'none',
                    cursor: 'pointer',
                    accentColor: '#3b82f6',
                }}
            />
        </div>
    );
}
