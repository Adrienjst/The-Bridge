'use client';

import React, { useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer
} from 'recharts';
import { Settings2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InteractiveChartProps {
    config: {
        strategy: string; // 'call', 'put', 'straddle', 'bull-spread'
        params: Record<string, number>; // { strike: 100, premium: 5, etc. }
    };
}

export function InteractiveChart({ config }: InteractiveChartProps) {
    const { t } = useLanguage();
    
    // Local state to override initial params
    const [params, setParams] = useState<Record<string, number>>(config.params);

    const handleParamChange = (key: string, value: number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    // Generate data points
    const data = useMemo(() => {
        const points = [];
        // Determine plausible range based on strike (usually spot is around strike)
        const center = params.strike || 100;
        const minSpot = Math.max(0, center * 0.5);
        const maxSpot = center * 1.5;
        const steps = 50;
        const step = (maxSpot - minSpot) / steps;

        for (let s = minSpot; s <= maxSpot; s += step) {
            let payoff = 0;
            const k = params.strike || 100;
            const p = params.premium || 0;

            switch (config.strategy) {
                case 'call':
                    payoff = Math.max(0, s - k) - p;
                    break;
                case 'put':
                    payoff = Math.max(0, k - s) - p;
                    break;
                case 'straddle':
                    payoff = Math.max(0, s - k) + Math.max(0, k - s) - p; // simplified premium for straddle
                    break;
                case 'bull-spread':
                    const k2 = params.strike2 || k * 1.1; // short call strike
                    const longCall = Math.max(0, s - k);
                    const shortCall = -Math.max(0, s - k2);
                    payoff = longCall + shortCall - p;
                    break;
                default:
                    payoff = s - k; // linear by default
            }

            points.push({
                spot: Number(s.toFixed(2)),
                payoff: Number(payoff.toFixed(2))
            });
        }
        return points;
    }, [config.strategy, params]);

    // Format strategy name
    const titleMap: Record<string, string> = {
        'call': 'Long Call Payoff',
        'put': 'Long Put Payoff',
        'straddle': 'Straddle Payoff',
        'bull-spread': 'Bull Call Spread'
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings2 size={18} className="text-accent" />
                    {titleMap[config.strategy] || 'Interactive Payoff'}
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Controls */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 8 }}>
                    {Object.entries(params).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 150, flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <label style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{key}</label>
                                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{value}</span>
                            </div>
                            <input
                                type="range"
                                min={key === 'premium' ? 1 : 50}
                                max={key === 'premium' ? 50 : 200}
                                step={key === 'premium' ? 1 : 5}
                                value={value}
                                onChange={(e) => handleParamChange(key, Number(e.target.value))}
                                style={{ accentColor: 'var(--accent)' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer>
                        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                                dataKey="spot" 
                                stroke="var(--text-muted)" 
                                fontSize={12}
                                tickFormatter={(val) => val.toFixed(0)}
                                domain={['dataMin', 'dataMax']}
                                type="number"
                                label={{ value: 'Prix du Sous-Jacent (Spot)', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)' }}
                            />
                            <YAxis 
                                stroke="var(--text-muted)" 
                                fontSize={12}
                                label={{ value: 'Payoff (P&L)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }}
                            />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.85rem' }}
                                labelStyle={{ color: 'var(--text-muted)', marginBottom: 5 }}
                                formatter={(value: any) => [<span style={{ color: (value as number) >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{value}</span>, 'P&L']}
                                labelFormatter={(label: any) => `Spot: ${label}`}
                            />
                            <ReferenceLine y={0} stroke="var(--text-muted)" />
                            <ReferenceLine x={params.strike} stroke="var(--blue)" strokeDasharray="3 3" label={{ position: 'top', value: 'Strike', fill: 'var(--blue)', fontSize: 10 }} />
                            
                            <Line
                                type="monotone"
                                dataKey="payoff"
                                stroke="var(--accent)"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: 'var(--bg)', stroke: 'var(--accent)', strokeWidth: 2 }}
                                animationDuration={300}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
