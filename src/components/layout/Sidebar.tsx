'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CreditCard, Layers, Brain, HelpCircle, BarChart3, Box, Home, GraduationCap, Globe, MessageSquare, Calculator, Dices } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import { ui } from '@/data/translations';
import { courses } from '@/data/courses';
import ProgressBar from '@/components/ProgressBar';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { locale, toggleLocale, t } = useLanguage();
  const { getOverallProgress } = useProgress();

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallProgress = getOverallProgress(totalLessons);

  const navItems = [
    { href: '/', label: t(ui['nav.home']), icon: Home },
    { href: '/cours', label: t(ui['nav.courses']), icon: BookOpen },
    { href: '/flashcards', label: t(ui['nav.flashcards']), icon: CreditCard },
    { href: '/quiz', label: t(ui['nav.quiz']), icon: HelpCircle },
    { href: '/exercices', label: t(ui['nav.exercises']), icon: Brain },
    { href: '/interview', label: t(ui['nav.interview']), icon: MessageSquare },
    { href: '/brainteasers', label: t({ fr: 'Brainteasers', en: 'Brainteasers' }), icon: Brain },
    { href: '/visualisation', label: t(ui['nav.viz2d']), icon: BarChart3 },
    { href: '/visualisation-3d', label: t(ui['nav.viz3d']), icon: Box },
    { href: '/montecarlo', label: t({ fr: 'Monte Carlo', en: 'Monte Carlo' }), icon: Calculator },
    { href: '/strategies-paris', label: t({ fr: 'Stratégies Paris', en: 'Betting Strategies' }), icon: Dices },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoIcon}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div className={styles.sidebarTitle}>StructLab</div>
            <div className={styles.sidebarSubtitle}>{t(ui['nav.structuredProducts'])}</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div style={{ padding: '0 1rem', marginBottom: '0.25rem' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
          {t({ fr: 'Progression', en: 'Progress' })}
        </div>
        <ProgressBar value={overallProgress} size="sm" />
      </div>

      <nav className={styles.sidebarNav}>
        <div className={styles.sidebarNavLabel}>{t(ui['nav.navigation'])}</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && <div className={styles.sidebarActiveIndicator} />}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button
          onClick={toggleLocale}
          className={styles.langToggle}
          aria-label="Toggle language"
        >
          <Globe size={16} />
          <span>{locale === 'fr' ? '🇫🇷 FR → EN' : '🇬🇧 EN → FR'}</span>
        </button>
        <div className={styles.sidebarFooterCard}>
          <Layers size={16} />
          <span>{t(ui['nav.equityExotics'])}</span>
        </div>
      </div>
    </aside>
  );
}
