'use client';

import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DailyStreak() {
    const { progress } = useProgress();
    const { t } = useLanguage();

    const today = new Date();
    const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    // Get the start of the current week (Monday)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    // Check which days of the week are active (simplified: only today if active)
    const todayStr = today.toISOString().slice(0, 10);
    const isActiveToday = progress.lastActiveDate === todayStr;

    return (
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {/* Streak flame */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '2rem',
                    filter: progress.streakDays > 0 ? 'none' : 'grayscale(1)',
                    transition: 'filter 0.3s ease',
                }}>
                    🔥
                </div>
                <div style={{
                    fontSize: '1.2rem', fontWeight: 800,
                    color: progress.streakDays > 0 ? '#f59e0b' : 'var(--text-muted)',
                }}>
                    {progress.streakDays}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {t({ fr: 'jours', en: 'days' })}
                </div>
            </div>

            {/* Week calendar */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
                {dayNames.map((name, i) => {
                    const dayDate = new Date(startOfWeek);
                    dayDate.setDate(startOfWeek.getDate() + i);
                    const dateStr = dayDate.toISOString().slice(0, 10);
                    const isToday = dateStr === todayStr;
                    const isActive = dateStr === progress.lastActiveDate || (isActiveToday && isToday);
                    const isPast = dayDate < today && !isToday;

                    return (
                        <div key={i} style={{
                            width: 28, height: 36, borderRadius: 6,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            background: isActive
                                ? 'rgba(245, 158, 11, 0.15)'
                                : isToday
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isActive
                                ? 'rgba(245, 158, 11, 0.3)'
                                : isToday
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : 'rgba(255,255,255,0.06)'
                                }`,
                        }}>
                            <span style={{
                                fontSize: '0.55rem', fontWeight: 600,
                                color: isActive ? '#f59e0b' : 'var(--text-muted)',
                            }}>
                                {name}
                            </span>
                            <span style={{
                                fontSize: '0.6rem',
                                color: isActive ? '#fbbf24' : isPast ? 'var(--text-muted)' : 'var(--text-secondary)',
                            }}>
                                {isActive ? '✓' : '·'}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* XP */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8b5cf6' }}>
                    {progress.totalXP}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    XP
                </div>
            </div>
        </div>
    );
}
