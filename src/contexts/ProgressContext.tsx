'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

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
    addXP: (amount: number) => void;
    checkAndUpdateStreak: () => void;
    resetProgress: () => void;
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
    const [progress, setProgress] = useState<ProgressData>(defaultProgress);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setProgress({ ...defaultProgress, ...parsed });
            }
        } catch { /* ignore */ }
        setLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        }
    }, [progress, loaded]);

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
            addXP,
            checkAndUpdateStreak,
            resetProgress,
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
