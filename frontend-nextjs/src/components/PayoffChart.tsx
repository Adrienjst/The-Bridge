'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export type PayoffType = 'call' | 'put';

export interface PayoffPayload {
    type: PayoffType;
    strike: number;
    notional?: number;
    spot?: number;
    underlying?: string;
    label?: string;
    data?: Array<{ spot: number; pnl: number }>;
}

interface PayoffChartProps {
    payload: PayoffPayload;
}

const computePayoffSeries = (payload: PayoffPayload) => {
    const { strike, type, notional = 1 } = payload;
    const lower = Math.max(strike * 0.75, 0);
    const upper = strike * 1.4;
    const points = 50;
    const step = (upper - lower) / points;
    const data: Array<{ spot: number; pnl: number }> = [];

    for (let i = 0; i <= points; i += 1) {
        const spotLevel = Number((lower + step * i).toFixed(2));
        const intrinsic = type === 'call' ? Math.max(spotLevel - strike, 0) : Math.max(strike - spotLevel, 0);
        data.push({ spot: spotLevel, pnl: Number((intrinsic * notional).toFixed(2)) });
    }

    return data;
};

const formatLabel = (payload: PayoffPayload) => {
    const option = payload.type === 'call' ? 'Call' : 'Put';
    return payload.label || `${option} payoff (${payload.strike})`;
};

export default function PayoffChart({ payload }: PayoffChartProps) {
    const { type } = payload;
    const chartData = payload.data && payload.data.length ? payload.data : computePayoffSeries(payload);
    const color = type === 'call' ? '#60a5fa' : '#f87171';

    return (
        <div
            style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: 18,
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(96, 165, 250, 0.2)',
                boxShadow: '0 20px 60px rgba(2,6,23,0.35)',
                minHeight: 220,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                <span>{formatLabel(payload)}</span>
                <span style={{ color: color }}>{payload.underlying ?? 'Underlying'}</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                    <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
                    <XAxis dataKey="spot" stroke="rgba(148,163,184,0.8)" />
                    <YAxis stroke="rgba(148,163,184,0.8)" />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.4)' }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(value) => `${value} PnL`}
                    />
                    <Line type="monotone" dataKey="pnl" stroke={color} strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
