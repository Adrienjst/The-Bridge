'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
    value: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    color?: string;
    className?: string;
}

export default function ProgressBar({ value, size = 'md', showLabel = true, color, className }: ProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, value));

    const heights = { sm: 4, md: 8, lg: 12 };
    const height = heights[size];

    // Color coding based on percentage
    const getColor = () => {
        if (color) return color;
        if (clamped >= 80) return '#10b981';
        if (clamped >= 50) return '#3b82f6';
        if (clamped >= 25) return '#f59e0b';
        return '#64748b';
    };

    const barColor = getColor();

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <div style={{
                flex: 1,
                height,
                borderRadius: height / 2,
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clamped}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        height: '100%',
                        borderRadius: height / 2,
                        background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
                        boxShadow: clamped > 0 ? `0 0 8px ${barColor}40` : 'none',
                    }}
                />
            </div>
            {showLabel && (
                <span style={{
                    fontSize: size === 'sm' ? '0.65rem' : '0.75rem',
                    fontWeight: 600,
                    color: barColor,
                    minWidth: size === 'sm' ? 28 : 36,
                    textAlign: 'right',
                }}>
                    {clamped}%
                </span>
            )}
        </div>
    );
}
