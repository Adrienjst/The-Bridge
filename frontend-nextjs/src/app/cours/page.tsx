'use client';

import Link from 'next/link';
import { courses } from '@/data/courses';
import { ArrowRight, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';

export default function CoursPage() {
    const { t } = useLanguage();
    const { getModuleProgress } = useProgress();

    return (
        <div className="page-container">
            <h1 className="page-title">{t({ fr: 'Cours', en: 'Courses' })}</h1>
            <p className="page-subtitle">{t({ fr: '5 modules progressifs pour maîtriser la structuration de produits structurés equity exotiques.', en: '5 progressive modules to master exotic equity structured products.' })}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {courses.map((course) => (
                    <Link key={course.id} href={`/cours/${course.id}`} style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 14,
                                    background: `${course.color}15`,
                                    border: `1px solid ${course.color}25`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.75rem',
                                    flexShrink: 0,
                                }}>
                                    {course.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: course.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Module {course.number}
                                        </span>
                                        <span className={`badge difficulty-${course.difficulty}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                                            {course.difficulty}
                                        </span>
                                    </div>
                                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                                        {t(course.title)}
                                    </h2>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                        {t(course.description)}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            <Clock size={14} />
                                            {t(course.duration)}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            <BookOpen size={14} />
                                            {course.lessons.length} {t({ fr: 'leçons', en: 'lessons' })}
                                        </div>
                                        {(() => {
                                            const progress = getModuleProgress(course.id, course.lessons.length);
                                            return (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: progress === 100 ? '#34d399' : 'var(--text-muted)' }}>
                                                    {progress === 100 && <CheckCircle size={14} />}
                                                    {progress}%
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Module progress bar */}
                                    {(() => {
                                        const progress = getModuleProgress(course.id, course.lessons.length);
                                        return progress > 0 ? (
                                            <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                                                <div className="progress-bar-fill" style={{ width: `${progress}%`, background: course.color }} />
                                            </div>
                                        ) : null;
                                    })()}

                                    <div style={{ marginTop: '0.75rem' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            {t({ fr: 'Objectifs', en: 'Objectives' })}
                                        </h4>
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                            {course.objectives.slice(0, 3).map((obj, i) => (
                                                <li key={i} style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.2rem 0.6rem',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    borderRadius: 6,
                                                    color: 'var(--text-secondary)',
                                                }}>
                                                    {t(obj)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 4 }} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
