'use client';

import Link from 'next/link';
import { BookOpen, CreditCard, HelpCircle, Brain, BarChart3, Box, Calculator, Dices, TrendingUp, Sparkles, Shield, Zap, UserCog, ArrowRight, Star, Trophy } from 'lucide-react';
import { courses } from '@/data/courses';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import { ui } from '@/data/translations';
import { flashcards } from '@/data/flashcards';
import { quizzes } from '@/data/quizzes';
import { exercises } from '@/data/exercises';
import DailyStreak from '@/components/DailyStreak';

export default function HomePage() {
  const { t } = useLanguage();
  const { progress, getOverallProgress, getLevel, getEarnedBadges } = useProgress();

  const level = getLevel();
  const badges = getEarnedBadges();

  const features = [
    { href: '/cours', icon: BookOpen, label: t(ui['nav.courses']), desc: t({ fr: `${courses.length} modules complets`, en: `${courses.length} full modules` }), color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { href: '/flashcards', icon: CreditCard, label: t(ui['nav.flashcards']), desc: t({ fr: `${flashcards.length} cartes de révision`, en: `${flashcards.length} review cards` }), color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { href: '/quiz', icon: HelpCircle, label: t(ui['nav.quiz']), desc: t({ fr: `${quizzes.length} questions`, en: `${quizzes.length} questions` }), color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { href: '/exercices', icon: Brain, label: t(ui['nav.exercises']), desc: t({ fr: `${exercises.length} exercices guidés`, en: `${exercises.length} guided exercises` }), color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { href: '/brainteasers', icon: UserCog, label: 'Brainteasers', desc: t({ fr: 'Énigmes & Logique avec Timer', en: 'Puzzles & Logic with Timer' }), color: '#4f46e5', gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)' },
    { href: '/case-structuration', icon: Brain, label: t({ fr: 'Case Study', en: 'Case Study' }), desc: t({ fr: '17 cas réels avec scoring IA', en: '17 real cases with AI scoring' }), color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { href: '/visualisation', icon: BarChart3, label: t(ui['nav.viz2d']), desc: t({ fr: 'Diagrammes interactifs', en: 'Interactive diagrams' }), color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { href: '/visualisation-3d', icon: Box, label: t(ui['nav.viz3d']), desc: t({ fr: 'Volatilité & Greeks', en: 'Volatility & Greeks' }), color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { href: '/montecarlo', icon: Calculator, label: t({ fr: 'Monte Carlo', en: 'Monte Carlo' }), desc: t({ fr: 'Génération de trajectoires', en: 'Path generation' }), color: '#14b8a6', gradient: 'linear-gradient(135deg, #2dd4bf, #0f766e)' },
    { href: '/strategies-paris', icon: Dices, label: t({ fr: 'Stratégies de Paris', en: 'Betting Strategies' }), desc: t({ fr: 'Martingale, Fibonacci', en: 'Martingale, Fibonacci' }), color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #be123c)' },
  ];

  const stats = [
    { icon: TrendingUp, value: `${progress.completedLessons.length}/${courses.reduce((s, c) => s + c.lessons.length, 0)}`, label: t({ fr: 'Leçons', en: 'Lessons' }), color: '#3b82f6' },
    { icon: Sparkles, value: `${progress.knownFlashcards.length}/${flashcards.length}`, label: t({ fr: 'Flashcards', en: 'Flashcards' }), color: '#8b5cf6' },
    { icon: Shield, value: `${Object.keys(progress.quizScores).length}`, label: t({ fr: 'Quiz', en: 'Quizzes' }), color: '#ec4899' },
    { icon: Zap, value: `${progress.solvedBrainteasers.length}`, label: t({ fr: 'Brainteasers', en: 'Brainteasers' }), color: '#10b981' },
  ];

  // Learning tracks
  const tracks = [
    {
      label: { fr: '🟢 Fondations', en: '🟢 Foundations' },
      desc: { fr: 'Options vanilles, Greeks, Volatilité', en: 'Vanilla options, Greeks, Volatility' },
      moduleIds: ['module1', 'module2', 'module3'],
    },
    {
      label: { fr: '🟡 Exotiques & Structuration', en: '🟡 Exotics & Structuring' },
      desc: { fr: 'Produits exotiques, structurés, barrières', en: 'Exotic products, structured products, barriers' },
      moduleIds: ['module4', 'module5', 'module6'],
    },
    {
      label: { fr: '🔵 Quantitatif', en: '🔵 Quantitative' },
      desc: { fr: 'Calcul stochastique, Probabilités', en: 'Stochastic calculus, Probability' },
      moduleIds: ['module7', 'module8', 'module9', 'module10'],
    },
    {
      label: { fr: '🟣 Code & Pratique', en: '🟣 Code & Practice' },
      desc: { fr: 'Python quantitatif, C++ pour le pricing', en: 'Quantitative Python, C++ for pricing' },
      moduleIds: ['coding-python', 'coding-cpp'],
    },
  ];

  return (
    <div className="page-container">
      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '3rem 0 2rem',
        marginBottom: '2.5rem',
        overflow: 'hidden',
      }}>
        <div className="gradient-orb" style={{ width: 400, height: 400, top: -100, right: -50, background: 'rgba(59, 130, 246, 0.12)' }} />
        <div className="gradient-orb" style={{ width: 300, height: 300, bottom: -80, left: '20%', background: 'rgba(139, 92, 246, 0.08)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
              <Sparkles size={12} style={{ marginRight: 4 }} />
              {t({ fr: 'Préparation Stage Structuration', en: 'Structuring Internship Prep' })}
            </span>
          </div>
          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            background: 'linear-gradient(135deg, #f8fafc 0%, #60a5fa 50%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            maxWidth: 600,
          }}>
            {t({ fr: 'Maîtrisez la Structuration de Produits', en: 'Master Product Structuring' })}
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: '1.5rem',
          }}>
            {t({
              fr: 'Cours interactifs, flashcards, quiz et visualisations pour apprendre la structuration equity exotiques et vous préparer pour votre stage.',
              en: 'Interactive courses, flashcards, quizzes and visualizations to learn exotic equity structuring and prepare for your internship.'
            })}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/cours" className="btn btn-primary btn-lg">
              {t({ fr: 'Commencer les cours', en: 'Start learning' })}
              <ArrowRight size={18} />
            </Link>
            <Link href="/interview" className="btn btn-secondary btn-lg">
              {t({ fr: 'Simuler un entretien', en: 'Simulate an interview' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Activity + XP Section */}
      <section className="glass-card-static" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {t({ fr: 'Ton activité', en: 'Your activity' })}
            </h3>
            <DailyStreak />
          </div>

          {/* XP & Level */}
          <div style={{ textAlign: 'right', minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Star size={16} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t({ fr: 'Niveau', en: 'Level' })} {level.level}
              </span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.3rem' }}>
              {progress.totalXP} XP
            </div>
            {/* XP Progress Bar */}
            <div style={{
              width: '100%', height: 6, background: 'rgba(255,255,255,0.06)',
              borderRadius: 3, overflow: 'hidden',
            }}>
              <div style={{
                width: `${level.progress}%`, height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                borderRadius: 3, transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {level.currentXP}/{level.xpForNext} XP → {t({ fr: 'Niv.', en: 'Lv.' })} {level.level + 1}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              {t({ fr: 'Progression globale', en: 'Overall progress' })}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>
              {getOverallProgress()}%
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      {badges.length > 0 && (
        <section className="glass-card-static" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Trophy size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t({ fr: `${badges.length} Badges obtenus`, en: `${badges.length} Badges earned` })}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {badges.map(b => (
              <div key={b.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.65rem', borderRadius: 20,
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                fontSize: '0.72rem', fontWeight: 600,
                color: '#fbbf24',
              }}>
                <span>{b.icon}</span>
                <span>{t(b.label)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card-static" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '1rem 1.25rem',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
              }}>
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <h2 className="section-title">{t({ fr: "Outils d'apprentissage", en: 'Learning tools' })}</h2>
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <Link key={feat.href} href={feat.href} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: feat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '1rem',
                  boxShadow: `0 0 20px ${feat.color}30`,
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 650, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                  {feat.label}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{feat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Learning Tracks */}
      <h2 className="section-title">{t({ fr: 'Parcours de formation', en: 'Learning Tracks' })}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {tracks.map((track, ti) => {
          const trackCourses = courses.filter(c => track.moduleIds.includes(c.id));
          const totalLessons = trackCourses.reduce((s, c) => s + c.lessons.length, 0);
          const completedInTrack = trackCourses.reduce((s, c) => {
            return s + c.lessons.filter(l => progress.completedLessons.includes(`${c.id}:${l.id}`)).length;
          }, 0);
          const trackProgress = totalLessons > 0 ? Math.round((completedInTrack / totalLessons) * 100) : 0;

          return (
            <div key={ti} className="glass-card-static" style={{ padding: '1.25rem 1.5rem' }}>
              {/* Track Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.15rem' }}>{t(track.label)}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t(track.desc)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: trackProgress === 100 ? '#34d399' : '#60a5fa' }}>
                    {trackProgress}%
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {completedInTrack}/{totalLessons} {t({ fr: 'leçons', en: 'lessons' })}
                  </div>
                </div>
              </div>

              {/* Track Progress Bar */}
              <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: '0.75rem' }}>
                <div style={{
                  width: `${trackProgress}%`, height: '100%',
                  background: trackProgress === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  borderRadius: 2, transition: 'width 0.4s ease',
                }} />
              </div>

              {/* Modules in track */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {trackCourses.map((course) => {
                  const courseLessons = course.lessons.length;
                  const courseDone = course.lessons.filter(l => progress.completedLessons.includes(`${course.id}:${l.id}`)).length;
                  return (
                    <Link key={course.id} href={`/cours/${course.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.5rem 0.75rem', borderRadius: 8,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer',
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{course.icon}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {t(course.title)}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: courseDone === courseLessons && courseLessons > 0 ? '#34d399' : 'var(--text-muted)', fontWeight: 600 }}>
                          {courseDone}/{courseLessons}
                        </span>
                        <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Interview Prep Track (special — links to tools) */}
        <div className="glass-card-static" style={{ padding: '1.25rem 1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.15rem' }}>
            {t({ fr: '🔴 Préparation Entretien', en: '🔴 Interview Prep' })}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {t({ fr: 'Entretiens IA, brainteasers, études de cas', en: 'AI interviews, brainteasers, case studies' })}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { href: '/interview', icon: '🎤', label: { fr: 'Entretien IA', en: 'AI Interview' }, stat: `${progress.interviewCount} ${t({ fr: 'sessions', en: 'sessions' })}` },
              { href: '/brainteasers', icon: '🧩', label: { fr: 'Brainteasers', en: 'Brainteasers' }, stat: `${progress.solvedBrainteasers.length} ${t({ fr: 'résolus', en: 'solved' })}` },
              { href: '/case-structuration', icon: '🏗️', label: { fr: 'Case Studies', en: 'Case Studies' }, stat: '17 cas' },
              { href: '/playground', icon: '💻', label: { fr: 'Playground Code', en: 'Code Playground' }, stat: 'Python, C++, JS' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.5rem 0.75rem', borderRadius: 8,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t(item.label)}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.stat}</span>
                  <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
