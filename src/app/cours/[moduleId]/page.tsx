'use client';

import { use } from 'react';
import Link from 'next/link';
import { courses } from '@/data/courses';
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb, AlertTriangle, Calculator, Beaker, Info, FileText, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import Latex from '@/components/Latex';

const sectionIcons: Record<string, React.ReactNode> = {
    'text': <BookOpen size={16} />,
    'key-concept': <Lightbulb size={16} />,
    'warning': <AlertTriangle size={16} />,
    'formula': <Calculator size={16} />,
    'example': <Beaker size={16} />,
    'diagram': <Info size={16} />,
    'case-study': <FileText size={16} />,
    'table': <Info size={16} />,
};

const sectionColors: Record<string, { bg: string; border: string; accent: string }> = {
    'text': { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', accent: 'var(--text-secondary)' },
    'key-concept': { bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.15)', accent: '#60a5fa' },
    'warning': { bg: 'rgba(245, 158, 11, 0.05)', border: 'rgba(245, 158, 11, 0.15)', accent: '#fbbf24' },
    'formula': { bg: 'rgba(139, 92, 246, 0.05)', border: 'rgba(139, 92, 246, 0.15)', accent: '#a78bfa' },
    'example': { bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.15)', accent: '#34d399' },
    'diagram': { bg: 'rgba(6, 182, 212, 0.05)', border: 'rgba(6, 182, 212, 0.15)', accent: '#22d3ee' },
    'case-study': { bg: 'rgba(236, 72, 153, 0.05)', border: 'rgba(236, 72, 153, 0.15)', accent: '#ec4899' },
    'table': { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.08)', accent: 'var(--text-secondary)' },
};

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = use(params);
    const { t } = useLanguage();
    const { markLessonComplete, isLessonComplete, getModuleProgress } = useProgress();
    const course = courses.find(c => c.id === moduleId);

    const sectionLabels: Record<string, string> = {
        'text': '',
        'key-concept': t({ fr: 'Concept clé', en: 'Key concept' }),
        'warning': t({ fr: 'Attention', en: 'Warning' }),
        'formula': t({ fr: 'Formule', en: 'Formula' }),
        'example': t({ fr: 'Exemple', en: 'Example' }),
        'diagram': t({ fr: 'Diagramme', en: 'Diagram' }),
        'case-study': t({ fr: 'Étude de cas', en: 'Case study' }),
        'table': t({ fr: 'Tableau', en: 'Table' }),
    };

    if (!course) {
        return (
            <div className="page-container">
                <h1 className="page-title">{t({ fr: 'Module non trouvé', en: 'Module not found' })}</h1>
                <Link href="/cours" className="btn btn-secondary"><ArrowLeft size={16} /> {t({ fr: 'Retour aux cours', en: 'Back to courses' })}</Link>
            </div>
        );
    }

    const courseIndex = courses.findIndex(c => c.id === moduleId);
    const prevCourse = courseIndex > 0 ? courses[courseIndex - 1] : null;
    const nextCourse = courseIndex < courses.length - 1 ? courses[courseIndex + 1] : null;

    return (
        <div className="page-container">
            <Link href="/cours" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> {t({ fr: 'Retour aux cours', en: 'Back to courses' })}
            </Link>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: course.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Module {course.number}
                    </span>
                    <span className={`badge difficulty-${course.difficulty}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                        {course.difficulty}
                    </span>
                </div>
                <h1 className="page-title">{t(course.title)}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 600 }}>{t(course.subtitle)}</p>
                {/* Module Progress */}
                <div style={{ marginTop: '0.75rem', maxWidth: 300 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        <span>{t({ fr: 'Progression', en: 'Progress' })}</span>
                        <span>{getModuleProgress(moduleId, course.lessons.length)}%</span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${getModuleProgress(moduleId, course.lessons.length)}%`, background: course.color }} />
                    </div>
                </div>
            </div>

            {/* Objectives */}
            <div className="glass-card-static" style={{ marginBottom: '2rem', borderLeft: `3px solid ${course.color}` }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: course.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t({ fr: 'Objectifs du module', en: 'Module objectives' })}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {course.objectives.map((obj, i) => (
                        <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '1rem', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, color: course.color }}>•</span>
                            {t(obj)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Lessons */}
            {course.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1.25rem',
                    }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: isLessonComplete(moduleId, lesson.id) ? 'rgba(16, 185, 129, 0.2)' : `${course.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isLessonComplete(moduleId, lesson.id) ? '#34d399' : course.color,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                        }}>
                            {isLessonComplete(moduleId, lesson.id) ? <CheckCircle size={18} /> : lessonIndex + 1}
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, flex: 1 }}>{t(lesson.title)}</h2>
                        {!isLessonComplete(moduleId, lesson.id) && (
                            <button
                                onClick={() => markLessonComplete(moduleId, lesson.id)}
                                className="btn btn-ghost"
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', color: '#34d399' }}
                            >
                                <CheckCircle size={14} />
                                {t({ fr: 'Terminé', en: 'Done' })}
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {lesson.content.map((section, i) => {
                            const colors = sectionColors[section.type] || sectionColors['text'];
                            const label = sectionLabels[section.type] || '';
                            const sectionTitle = section.title ? t(section.title) : '';
                            const sectionBody = t(section.body);

                            return (
                                <div key={i} style={{
                                    background: colors.bg,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 12,
                                    padding: '1.25rem',
                                }}>
                                    {(sectionTitle || label) && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                                            <span style={{ color: colors.accent }}>{sectionIcons[section.type]}</span>
                                            {label && <span style={{ fontSize: '0.7rem', fontWeight: 600, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>}
                                            {sectionTitle && <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {label ? `— ${sectionTitle}` : sectionTitle}
                                            </span>}
                                        </div>
                                    )}
                                    <div style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.75,
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: section.type === 'formula' ? "'SF Mono', 'Fira Code', monospace" : 'inherit',
                                    }}>
                                        <Latex block>{sectionBody}</Latex>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border)',
                marginTop: '1rem',
            }}>
                {prevCourse ? (
                    <Link href={`/cours/${prevCourse.id}`} className="btn btn-secondary">
                        <ArrowLeft size={16} />
                        Module {prevCourse.number}
                    </Link>
                ) : <div />}
                {nextCourse ? (
                    <Link href={`/cours/${nextCourse.id}`} className="btn btn-primary">
                        Module {nextCourse.number}
                        <ArrowRight size={16} />
                    </Link>
                ) : (
                    <Link href="/flashcards" className="btn btn-primary">
                        {t({ fr: 'Passer aux flashcards', en: 'Go to flashcards' })}
                        <ArrowRight size={16} />
                    </Link>
                )}
            </div>
        </div>
    );
}
