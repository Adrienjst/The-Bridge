/**
 * Unit tests for ProgressContext pure logic.
 * We test the plain functions and data flow, not React rendering.
 */
import { describe, it, expect } from 'vitest';

// ─── XP Values (mirrored from ProgressContext) ───────────────
const XP_VALUES = {
    lesson: 20,
    flashcard: 5,
    quiz: 30,
    exercise: 25,
    brainteaser: 15,
    interview: 50,
};

const XP_PER_LEVEL = 200;

// ─── Badge logic (extracted for testing) ───────────────
interface ProgressData {
    completedLessons: string[];
    knownFlashcards: string[];
    quizScores: Record<string, { score: number; total: number; date: string }>;
    completedExercises: string[];
    solvedBrainteasers: string[];
    interviewCount: number;
    streakDays: number;
    lastActiveDate: string;
    totalXP: number;
    badges: string[];
}

const BADGE_CHECKS: { id: string; check: (p: ProgressData) => boolean }[] = [
    { id: 'first-lesson', check: p => p.completedLessons.length >= 1 },
    { id: 'five-lessons', check: p => p.completedLessons.length >= 5 },
    { id: 'ten-lessons', check: p => p.completedLessons.length >= 10 },
    { id: 'twenty-lessons', check: p => p.completedLessons.length >= 20 },
    { id: 'flashcard-25', check: p => p.knownFlashcards.length >= 25 },
    { id: 'flashcard-100', check: p => p.knownFlashcards.length >= 100 },
    { id: 'quiz-3', check: p => Object.keys(p.quizScores).length >= 3 },
    { id: 'brainteaser-10', check: p => p.solvedBrainteasers.length >= 10 },
    { id: 'brainteaser-50', check: p => p.solvedBrainteasers.length >= 50 },
    { id: 'interview-1', check: p => p.interviewCount >= 1 },
    { id: 'interview-5', check: p => p.interviewCount >= 5 },
    { id: 'exercise-5', check: p => p.completedExercises.length >= 5 },
    { id: 'streak-3', check: p => p.streakDays >= 3 },
    { id: 'streak-7', check: p => p.streakDays >= 7 },
    { id: 'xp-1000', check: p => p.totalXP >= 1000 },
    { id: 'xp-5000', check: p => p.totalXP >= 5000 },
];

function getLevel(totalXP: number) {
    const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
    const currentXP = totalXP % XP_PER_LEVEL;
    return { level, currentXP, xpForNext: XP_PER_LEVEL, progress: Math.round((currentXP / XP_PER_LEVEL) * 100) };
}

function getOverallProgress(p: ProgressData) {
    const totalLessons = 45;
    const totalFlashcards = 147;
    const totalQuizModules = 5;
    const totalExercises = 10;
    const brainteaserTarget = 100;

    const lessonPct = Math.min(100, (p.completedLessons.length / totalLessons) * 100);
    const flashcardPct = Math.min(100, (p.knownFlashcards.length / totalFlashcards) * 100);
    const quizPct = Math.min(100, (Object.keys(p.quizScores).length / totalQuizModules) * 100);
    const exercisePct = Math.min(100, (p.completedExercises.length / totalExercises) * 100);
    const brainteaserPct = Math.min(100, (p.solvedBrainteasers.length / brainteaserTarget) * 100);

    const overall = (
        (lessonPct * 40 + flashcardPct * 20 + quizPct * 20 + exercisePct * 10 + brainteaserPct * 10) / 100
    );
    return Math.round(overall);
}

function getStreak(lastActiveDate: string, currentStreak: number): { newStreak: number } {
    const today = new Date().toISOString().slice(0, 10);
    if (lastActiveDate === today) return { newStreak: currentStreak };
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    return { newStreak: lastActiveDate === yesterdayStr ? currentStreak + 1 : 1 };
}

const emptyProgress: ProgressData = {
    completedLessons: [],
    knownFlashcards: [],
    quizScores: {},
    completedExercises: [],
    solvedBrainteasers: [],
    interviewCount: 0,
    streakDays: 0,
    lastActiveDate: '',
    totalXP: 0,
    badges: [],
};

describe('Progress Logic', () => {
    describe('XP Calculations', () => {
        it('should award correct XP for each activity type', () => {
            expect(XP_VALUES.lesson).toBe(20);
            expect(XP_VALUES.flashcard).toBe(5);
            expect(XP_VALUES.quiz).toBe(30);
            expect(XP_VALUES.exercise).toBe(25);
            expect(XP_VALUES.brainteaser).toBe(15);
            expect(XP_VALUES.interview).toBe(50);
        });

        it('should calculate level correctly', () => {
            expect(getLevel(0)).toEqual({ level: 1, currentXP: 0, xpForNext: 200, progress: 0 });
            expect(getLevel(199)).toEqual({ level: 1, currentXP: 199, xpForNext: 200, progress: 100 });
            expect(getLevel(200)).toEqual({ level: 2, currentXP: 0, xpForNext: 200, progress: 0 });
            expect(getLevel(1000)).toEqual({ level: 6, currentXP: 0, xpForNext: 200, progress: 0 });
            expect(getLevel(5250)).toEqual({ level: 27, currentXP: 50, xpForNext: 200, progress: 25 });
        });
    });

    describe('Badge Conditions', () => {
        it('should award no badges for empty progress', () => {
            const earned = BADGE_CHECKS.filter(b => b.check(emptyProgress));
            expect(earned.length).toBe(0);
        });

        it('should award first-lesson badge after 1 lesson', () => {
            const p = { ...emptyProgress, completedLessons: ['m1:l1'] };
            const earned = BADGE_CHECKS.filter(b => b.check(p));
            expect(earned.map(b => b.id)).toContain('first-lesson');
        });

        it('should award interview badge after 1 interview', () => {
            const p = { ...emptyProgress, interviewCount: 1 };
            const earned = BADGE_CHECKS.filter(b => b.check(p));
            expect(earned.map(b => b.id)).toContain('interview-1');
        });

        it('should award streak badges at correct thresholds', () => {
            const p3 = { ...emptyProgress, streakDays: 3 };
            expect(BADGE_CHECKS.filter(b => b.check(p3)).map(b => b.id)).toContain('streak-3');
            expect(BADGE_CHECKS.filter(b => b.check(p3)).map(b => b.id)).not.toContain('streak-7');

            const p7 = { ...emptyProgress, streakDays: 7 };
            expect(BADGE_CHECKS.filter(b => b.check(p7)).map(b => b.id)).toContain('streak-7');
        });

        it('should award XP badges at thresholds', () => {
            const p1000 = { ...emptyProgress, totalXP: 1000 };
            expect(BADGE_CHECKS.filter(b => b.check(p1000)).map(b => b.id)).toContain('xp-1000');
            expect(BADGE_CHECKS.filter(b => b.check(p1000)).map(b => b.id)).not.toContain('xp-5000');
        });
    });

    describe('Overall Progress', () => {
        it('should return 0 for empty progress', () => {
            expect(getOverallProgress(emptyProgress)).toBe(0);
        });

        it('should weight lessons at 40%', () => {
            const p = { ...emptyProgress, completedLessons: Array.from({ length: 45 }, (_, i) => `m:l${i}`) };
            // 100% lessons = 40% of total
            expect(getOverallProgress(p)).toBe(40);
        });

        it('should cap at 100% per category', () => {
            const p = { ...emptyProgress, completedLessons: Array.from({ length: 100 }, (_, i) => `m:l${i}`) };
            // More than total lessons, should still cap at 40%
            expect(getOverallProgress(p)).toBe(40);
        });

        it('should return 100 when everything is maxed', () => {
            const p: ProgressData = {
                ...emptyProgress,
                completedLessons: Array.from({ length: 45 }, (_, i) => `m:l${i}`),
                knownFlashcards: Array.from({ length: 147 }, (_, i) => `f${i}`),
                quizScores: { m1: { score: 10, total: 10, date: '' }, m2: { score: 10, total: 10, date: '' }, m3: { score: 10, total: 10, date: '' }, m4: { score: 10, total: 10, date: '' }, m5: { score: 10, total: 10, date: '' } },
                completedExercises: Array.from({ length: 10 }, (_, i) => `e${i}`),
                solvedBrainteasers: Array.from({ length: 100 }, (_, i) => `b${i}`),
            };
            expect(getOverallProgress(p)).toBe(100);
        });
    });

    describe('Streak Logic', () => {
        it('should keep streak if already active today', () => {
            const today = new Date().toISOString().slice(0, 10);
            const result = getStreak(today, 5);
            expect(result.newStreak).toBe(5);
        });

        it('should increment streak if last active yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const result = getStreak(yesterday.toISOString().slice(0, 10), 3);
            expect(result.newStreak).toBe(4);
        });

        it('should reset streak if last active > 1 day ago', () => {
            const result = getStreak('2020-01-01', 10);
            expect(result.newStreak).toBe(1);
        });

        it('should reset streak from empty lastActiveDate', () => {
            const result = getStreak('', 0);
            expect(result.newStreak).toBe(1);
        });
    });
});
