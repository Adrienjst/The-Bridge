'use client';

import Link from 'next/link';
import { BookOpen, CreditCard, HelpCircle, Brain, BarChart3, Box, Calculator, Dices, TrendingUp, Sparkles, Shield, Zap, UserCog, ArrowRight } from 'lucide-react';
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
  const { progress, getOverallProgress } = useProgress();

  const features = [
    { href: '/cours', icon: BookOpen, label: t(ui['nav.courses']), desc: t({ fr: '5 modules complets', en: '5 full modules' }), color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { href: '/flashcards', icon: CreditCard, label: t(ui['nav.flashcards']), desc: t({ fr: `${flashcards.length} cartes de révision`, en: `${flashcards.length} review cards` }), color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { href: '/quiz', icon: HelpCircle, label: t(ui['nav.quiz']), desc: t({ fr: `${quizzes.length} questions`, en: `${quizzes.length} questions` }), color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { href: '/exercices', icon: Brain, label: t(ui['nav.exercises']), desc: t({ fr: `${exercises.length} exercices guidés`, en: `${exercises.length} guided exercises` }), color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { href: '/brainteasers', icon: UserCog, label: t({ fr: 'Brainteasers (Nouveau)', en: 'Brainteasers (New)' }), desc: t({ fr: 'Énigmes & Logique avec Timer', en: 'Puzzles & Logic with Timer' }), color: '#4f46e5', gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)' },
    { href: '/case-structuration', icon: Brain, label: t({ fr: 'Case Structuration', en: 'Case Study' }), desc: t({ fr: '17 cas réels avec scoring IA', en: '17 real cases with AI scoring' }), color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { href: '/visualisation', icon: BarChart3, label: t(ui['nav.viz2d']), desc: t({ fr: 'Diagrammes interactifs', en: 'Interactive diagrams' }), color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { href: '/visualisation-3d', icon: Box, label: t(ui['nav.viz3d']), desc: t({ fr: 'Volatilité & Greeks', en: 'Volatility & Greeks' }), color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { href: '/montecarlo', icon: Calculator, label: t({ fr: 'Simulateur Monte Carlo', en: 'Monte Carlo Simulator' }), desc: t({ fr: 'Génération de trajectoires', en: 'Path generation' }), color: '#14b8a6', gradient: 'linear-gradient(135deg, #2dd4bf, #0f766e)' },
    { href: '/strategies-paris', icon: Dices, label: t({ fr: 'Stratégies de Paris', en: 'Betting Strategies' }), desc: t({ fr: 'Martingale, Fibonacci', en: 'Martingale, Fibonacci' }), color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #be123c)' },
  ];

  const stats = [
    { icon: TrendingUp, value: `${progress.completedLessons.length}/${courses.reduce((s, c) => s + c.lessons.length, 0)}`, label: t({ fr: 'Leçons complétées', en: 'Lessons completed' }), color: '#3b82f6' },
    { icon: Sparkles, value: `${progress.knownFlashcards.length}/${flashcards.length}`, label: t({ fr: 'Flashcards connues', en: 'Flashcards known' }), color: '#8b5cf6' },
    { icon: Shield, value: `${Object.keys(progress.quizScores).length}`, label: t({ fr: 'Quiz complétés', en: 'Quizzes completed' }), color: '#ec4899' },
    { icon: Zap, value: `${progress.solvedBrainteasers.length}`, label: t({ fr: 'Brainteasers résolus', en: 'Brainteasers solved' }), color: '#10b981' },
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
            <Link href="/visualisation" className="btn btn-secondary btn-lg">
              {t({ fr: 'Explorer les payoffs', en: 'Explore payoffs' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Activity Section */}
      <section className="glass-card-static" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {t({ fr: 'Ton activité', en: 'Your activity' })}
            </h3>
            <DailyStreak />
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

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
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

      {/* Course Modules */}
      <h2 className="section-title">{t({ fr: 'Parcours de formation', en: 'Learning path' })}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {courses.map((course) => (
          <Link key={course.id} href={`/cours/${course.id}`} style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${course.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0,
              }}>
                {course.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: course.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Module {course.number}
                  </span>
                  <span className={`badge difficulty-${course.difficulty}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>
                    {course.difficulty}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                  {t(course.title)}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {t(course.subtitle)} · {t(course.duration)}
                </p>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          h1 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
