'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SRSCardData, DEFAULT_SRS, calculateNextReview, isDue } from '@/utils/srs';
import { trackEvent, Events } from '@/utils/analytics';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface ProgressData {
    completedLessons: string[];   // "moduleId:lessonId"
    knownFlashcards: string[];     // flashcard ids
    quizScores: Record<string, { score: number; total: number; date: string }>;  // moduleId -> best score
    completedExercises: string[];  // exercise ids
    solvedBrainteasers: string[]; // brainteaser ids
    interviewCount: number;       // number of interviews completed
    // Gamification (Phase 3)
    streakDays: number;
    lastActiveDate: string;       // "YYYY-MM-DD"
    totalXP: number;
    badges: string[];
    flashcardSRS: Record<string, SRSCardData>;
}

interface ProgressContextType {
    progress: ProgressData;
    markLessonComplete: (moduleId: string, lessonId: string) => void;
    isLessonComplete: (moduleId: string, lessonId: string) => boolean;
    markFlashcardKnown: (id: string) => void;
    unmarkFlashcardKnown: (id: string) => void;
    isFlashcardKnown: (id: string) => boolean;
    saveQuizScore: (moduleId: string, score: number, total: number) => void;
    getQuizScore: (moduleId: string) => { score: number; total: number; date: string } | null;
    markExerciseComplete: (id: string) => void;
    isExerciseComplete: (id: string) => boolean;
    markBrainteaserSolved: (id: string) => void;
    isBrainteaserSolved: (id: string) => boolean;
    incrementInterviewCount: () => void;
    getModuleProgress: (moduleId: string, totalLessons: number) => number;
    getOverallProgress: () => number;
    getFlashcardProgress: (total: number) => number;
    getLevel: () => { level: number; currentXP: number; xpForNext: number; progress: number };
    getEarnedBadges: () => { id: string; label: { fr: string; en: string }; icon: string }[];
    addXP: (amount: number) => void;
    checkAndUpdateStreak: () => void;
    resetProgress: () => void;
    reviewFlashcard: (id: string, quality: number) => void;
    getDueFlashcards: (allIds: string[]) => string[];
    getSRSStats: (allIds: string[]) => { due: number; learning: number; mastered: number };
}

const STORAGE_KEY = 'structlab-progress';

const defaultProgress: ProgressData = {
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
    flashcardSRS: {},
};

// XP rewards
const XP_VALUES = {
    lesson: 20,
    flashcard: 5,
    quiz: 30,
    exercise: 25,
    brainteaser: 15,
    interview: 50,
};

const XP_PER_LEVEL = 200;

const BADGE_DEFINITIONS: { id: string; label: { fr: string; en: string }; icon: string; check: (p: ProgressData) => boolean }[] = [
    { id: 'first-lesson', label: { fr: 'Premier Pas', en: 'First Step' }, icon: '🎯', check: p => p.completedLessons.length >= 1 },
    { id: 'five-lessons', label: { fr: 'Étudiant Assidu', en: 'Diligent Student' }, icon: '📖', check: p => p.completedLessons.length >= 5 },
    { id: 'ten-lessons', label: { fr: 'Scholar', en: 'Scholar' }, icon: '🎓', check: p => p.completedLessons.length >= 10 },
    { id: 'twenty-lessons', label: { fr: 'Expert Modules', en: 'Module Expert' }, icon: '🏅', check: p => p.completedLessons.length >= 20 },
    { id: 'flashcard-25', label: { fr: 'Mémoire Vive', en: 'Quick Memory' }, icon: '🧠', check: p => p.knownFlashcards.length >= 25 },
    { id: 'flashcard-100', label: { fr: 'Encyclopédie', en: 'Encyclopedia' }, icon: '📚', check: p => p.knownFlashcards.length >= 100 },
    { id: 'quiz-3', label: { fr: 'Quizz Master', en: 'Quiz Master' }, icon: '✅', check: p => Object.keys(p.quizScores).length >= 3 },
    { id: 'brainteaser-10', label: { fr: 'Logicien', en: 'Logician' }, icon: '🧩', check: p => p.solvedBrainteasers.length >= 10 },
    { id: 'brainteaser-50', label: { fr: 'Brainteaser Hunter', en: 'Brainteaser Hunter' }, icon: '🏹', check: p => p.solvedBrainteasers.length >= 50 },
    { id: 'brainteaser-200', label: { fr: 'Monte Carlo Wizard', en: 'Monte Carlo Wizard' }, icon: '🧙', check: p => p.solvedBrainteasers.length >= 200 },
    { id: 'interview-1', label: { fr: 'Premier Entretien', en: 'First Interview' }, icon: '🎤', check: p => p.interviewCount >= 1 },
    { id: 'interview-5', label: { fr: 'Candidat Aguerri', en: 'Seasoned Candidate' }, icon: '💼', check: p => p.interviewCount >= 5 },
    { id: 'exercise-5', label: { fr: 'Praticien', en: 'Practitioner' }, icon: '⚡', check: p => p.completedExercises.length >= 5 },
    { id: 'streak-3', label: { fr: 'Régulier', en: 'Consistent' }, icon: '🔥', check: p => p.streakDays >= 3 },
    { id: 'streak-7', label: { fr: 'Marathonien', en: 'Marathon Runner' }, icon: '🏃', check: p => p.streakDays >= 7 },
    { id: 'xp-1000', label: { fr: 'Millénaire', en: 'Millennial' }, icon: '💎', check: p => p.totalXP >= 1000 },
    { id: 'xp-5000', label: { fr: 'Légende', en: 'Legend' }, icon: '👑', check: p => p.totalXP >= 5000 },
];

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function getTodayStr() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getYesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

export function ProgressProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [progress, setProgress] = useState<ProgressData>(defaultProgress);
    const [loaded, setLoaded] = useState(false);

    // Initial Load: DB if authenticated, else localStorage
    useEffect(() => {
        let isMounted = true;
        const loadProgress = async () => {
            if (user) {
                try {
                    const { data, error } = await supabase.from('user_progress').select('*').eq('user_id', user.id).single();
                    if (!error && data && isMounted) {
                        setProgress({
                            completedLessons: data.completed_lessons || [],
                            knownFlashcards: data.known_flashcards || [],
                            quizScores: data.quiz_scores || {},
                            completedExercises: data.completed_exercises || [],
                            solvedBrainteasers: data.solved_brainteasers || [],
                            interviewCount: data.interview_count || 0,
                            streakDays: data.streak_days || 0,
                            lastActiveDate: data.last_active_date || '',
                            totalXP: data.total_xp || 0,
                            badges: defaultProgress.badges, // recompute later if needed
                            flashcardSRS: data.flashcard_srs || {},
                        });
                        setLoaded(true);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to load cloud progress", e);
                }
            } 
            
            // Fallback to local storage
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved && isMounted) {
                    const parsed = JSON.parse(saved);
                    setProgress({ ...defaultProgress, ...parsed });
                }
            } catch { /* ignore */ }
            if (isMounted) setLoaded(true);
        };

        loadProgress();
        return () => { isMounted = false; };
    }, [user]);

    // Save on change: DB if authenticated, else localStorage
    useEffect(() => {
        if (!loaded) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

        if (user) {
            const syncToDb = async () => {
                const dbPayload = {
                    user_id: user.id,
                    completed_lessons: progress.completedLessons,
                    known_flashcards: progress.knownFlashcards,
                    quiz_scores: progress.quizScores,
                    completed_exercises: progress.completedExercises,
                    solved_brainteasers: progress.solvedBrainteasers,
                    interview_count: progress.interviewCount,
                    streak_days: progress.streakDays,
                    last_active_date: progress.lastActiveDate,
                    total_xp: progress.totalXP,
                    flashcard_srs: progress.flashcardSRS,
                    updated_at: new Date().toISOString()
                };
                await supabase.from('user_progress').upsert(dbPayload, { onConflict: 'user_id' });
            };
            syncToDb();
        }
    }, [progress, loaded, user]);

    const checkAndUpdateStreak = useCallback(() => {
        const today = getTodayStr();
        setProgress(prev => {
            if (prev.lastActiveDate === today) return prev; // already active today
            const yesterday = getYesterdayStr();
            const newStreak = prev.lastActiveDate === yesterday ? prev.streakDays + 1 : 1;
            return { ...prev, streakDays: newStreak, lastActiveDate: today };
        });
    }, []);

    const addXP = useCallback((amount: number) => {
        setProgress(prev => ({ ...prev, totalXP: prev.totalXP + amount }));
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const markLessonComplete = useCallback((moduleId: string, lessonId: string) => {
        const key = `${moduleId}:${lessonId}`;
        setProgress(prev => {
            if (prev.completedLessons.includes(key)) return prev;
            
            // Fire analytics event
            trackEvent(Events.LESSON_COMPLETE, { moduleId, lessonId });

            return {
                ...prev,
                completedLessons: [...prev.completedLessons, key],
                totalXP: prev.totalXP + XP_VALUES.lesson,
            };
        });
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const isLessonComplete = useCallback((moduleId: string, lessonId: string) => {
        return progress.completedLessons.includes(`${moduleId}:${lessonId}`);
    }, [progress.completedLessons]);

    const markFlashcardKnown = useCallback((id: string) => {
        setProgress(prev => {
            if (prev.knownFlashcards.includes(id)) return prev;
            return {
                ...prev,
                knownFlashcards: [...prev.knownFlashcards, id],
                totalXP: prev.totalXP + XP_VALUES.flashcard,
            };
        });
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const unmarkFlashcardKnown = useCallback((id: string) => {
        setProgress(prev => ({
            ...prev,
            knownFlashcards: prev.knownFlashcards.filter(f => f !== id),
        }));
    }, []);

    const isFlashcardKnown = useCallback((id: string) => {
        return progress.knownFlashcards.includes(id);
    }, [progress.knownFlashcards]);

    const saveQuizScore = useCallback((moduleId: string, score: number, total: number) => {
        setProgress(prev => {
            const existing = prev.quizScores[moduleId];
            // Only save if it's a new best score
            if (existing && existing.score / existing.total >= score / total) return prev;
            
            // Track quiz finish
            trackEvent(Events.QUIZ_FINISH, { moduleId, score, total });

            return {
                ...prev,
                quizScores: {
                    ...prev.quizScores,
                    [moduleId]: { score, total, date: new Date().toISOString() },
                },
                totalXP: prev.totalXP + XP_VALUES.quiz,
            };
        });
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const getQuizScore = useCallback((moduleId: string) => {
        return progress.quizScores[moduleId] || null;
    }, [progress.quizScores]);

    const markExerciseComplete = useCallback((id: string) => {
        setProgress(prev => {
            if (prev.completedExercises.includes(id)) return prev;
            return {
                ...prev,
                completedExercises: [...prev.completedExercises, id],
                totalXP: prev.totalXP + XP_VALUES.exercise,
            };
        });
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const isExerciseComplete = useCallback((id: string) => {
        return progress.completedExercises.includes(id);
    }, [progress.completedExercises]);

    const markBrainteaserSolved = useCallback((id: string) => {
        setProgress(prev => {
            if (prev.solvedBrainteasers.includes(id)) return prev;

            trackEvent(Events.BRAINTEASER_SOLVE, { id });

            return {
                ...prev,
                solvedBrainteasers: [...prev.solvedBrainteasers, id],
                totalXP: prev.totalXP + XP_VALUES.brainteaser,
            };
        });
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const isBrainteaserSolved = useCallback((id: string) => {
        return progress.solvedBrainteasers.includes(id);
    }, [progress.solvedBrainteasers]);

    const incrementInterviewCount = useCallback(() => {
        trackEvent(Events.INTERVIEW_END);
        setProgress(prev => ({
            ...prev,
            interviewCount: prev.interviewCount + 1,
            totalXP: prev.totalXP + XP_VALUES.interview,
        }));
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const getModuleProgress = useCallback((moduleId: string, totalLessons: number) => {
        if (totalLessons === 0) return 0;
        const completed = progress.completedLessons.filter(l => l.startsWith(`${moduleId}:`)).length;
        return Math.round((completed / totalLessons) * 100);
    }, [progress.completedLessons]);

    // Overall progress: weighted across all activity types
    const getOverallProgress = useCallback(() => {
        const lessonWeight = 40; // 40% of progress
        const flashcardWeight = 20;
        const quizWeight = 20;
        const exerciseWeight = 10;
        const brainteaserWeight = 10;

        // Estimate totals (use reasonable targets)
        const totalLessons = 45; // ~45 lessons across 5 modules
        const totalFlashcards = 147;
        const totalQuizModules = 5;
        const totalExercises = 10;
        const brainteaserTarget = 100; // Target: solve 100 out of 1058

        const lessonPct = Math.min(100, (progress.completedLessons.length / totalLessons) * 100);
        const flashcardPct = Math.min(100, (progress.knownFlashcards.length / totalFlashcards) * 100);
        const quizPct = Math.min(100, (Object.keys(progress.quizScores).length / totalQuizModules) * 100);
        const exercisePct = Math.min(100, (progress.completedExercises.length / totalExercises) * 100);
        const brainteaserPct = Math.min(100, (progress.solvedBrainteasers.length / brainteaserTarget) * 100);

        const overall = (
            (lessonPct * lessonWeight +
                flashcardPct * flashcardWeight +
                quizPct * quizWeight +
                exercisePct * exerciseWeight +
                brainteaserPct * brainteaserWeight) / 100
        );

        return Math.round(overall);
    }, [progress.completedLessons, progress.knownFlashcards, progress.quizScores, progress.completedExercises, progress.solvedBrainteasers]);

    const getFlashcardProgress = useCallback((total: number) => {
        if (total === 0) return 0;
        return Math.round((progress.knownFlashcards.length / total) * 100);
    }, [progress.knownFlashcards]);

    const getLevel = useCallback(() => {
        const level = Math.floor(progress.totalXP / XP_PER_LEVEL) + 1;
        const currentXP = progress.totalXP % XP_PER_LEVEL;
        return { level, currentXP, xpForNext: XP_PER_LEVEL, progress: Math.round((currentXP / XP_PER_LEVEL) * 100) };
    }, [progress.totalXP]);

    const getEarnedBadges = useCallback(() => {
        return BADGE_DEFINITIONS.filter(b => b.check(progress)).map(b => ({ id: b.id, label: b.label, icon: b.icon }));
    }, [progress]);

    const reviewFlashcard = useCallback((id: string, quality: number) => {
        setProgress(prev => {
            const current = prev.flashcardSRS[id] || DEFAULT_SRS;
            const updated = calculateNextReview(quality, current);
            const isNew = !prev.flashcardSRS[id];
            
            trackEvent(Events.FLASHCARD_REVIEW, { id, quality, nextReview: updated.nextReview });

            // Also mark as known if quality >= 3
            const newKnown = quality >= 3 && !prev.knownFlashcards.includes(id)
                ? [...prev.knownFlashcards, id]
                : prev.knownFlashcards;
            // Remove from known if quality < 3
            const finalKnown = quality < 3
                ? newKnown.filter(f => f !== id)
                : newKnown;
            return {
                ...prev,
                flashcardSRS: { ...prev.flashcardSRS, [id]: updated },
                knownFlashcards: finalKnown,
                totalXP: prev.totalXP + (isNew ? XP_VALUES.flashcard : 0),
            };
        });
        checkAndUpdateStreak();
    }, [checkAndUpdateStreak]);

    const getDueFlashcards = useCallback((allIds: string[]) => {
        return allIds.filter(id => {
            const srs = progress.flashcardSRS[id];
            if (!srs) return true; // never reviewed = due
            return isDue(srs);
        });
    }, [progress.flashcardSRS]);

    const getSRSStats = useCallback((allIds: string[]) => {
        let due = 0;
        let learning = 0;
        let mastered = 0;
        for (const id of allIds) {
            const srs = progress.flashcardSRS[id];
            if (!srs) { due++; continue; }
            if (isDue(srs)) { due++; }
            if (srs.repetitions >= 3 && srs.interval >= 21) { mastered++; }
            else if (srs.repetitions > 0) { learning++; }
        }
        return { due, learning, mastered };
    }, [progress.flashcardSRS]);

    const resetProgress = useCallback(() => {
        setProgress(defaultProgress);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <ProgressContext.Provider value={{
            progress,
            markLessonComplete,
            isLessonComplete,
            markFlashcardKnown,
            unmarkFlashcardKnown,
            isFlashcardKnown,
            saveQuizScore,
            getQuizScore,
            markExerciseComplete,
            isExerciseComplete,
            markBrainteaserSolved,
            isBrainteaserSolved,
            incrementInterviewCount,
            getModuleProgress,
            getOverallProgress,
            getFlashcardProgress,
            getLevel,
            getEarnedBadges,
            addXP,
            checkAndUpdateStreak,
            resetProgress,
            reviewFlashcard,
            getDueFlashcards,
            getSRSStats,
        }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
    return ctx;
}
