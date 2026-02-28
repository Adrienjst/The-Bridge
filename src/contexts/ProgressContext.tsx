'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ProgressData {
    completedLessons: string[];   // "moduleId:lessonId"
    knownFlashcards: string[];     // flashcard ids
    quizScores: Record<string, { score: number; total: number; date: string }>;  // moduleId -> best score
    completedExercises: string[];  // exercise ids
}

interface ProgressContextType {
    progress: ProgressData;
    markLessonComplete: (moduleId: string, lessonId: string) => void;
    isLessonComplete: (moduleId: string, lessonId: string) => boolean;
    markFlashcardKnown: (id: string) => void;
    unmarkFlashcardKnown: (id: string) => void;
    isFlashcardKnown: (id: string) => boolean;
    saveQuizScore: (moduleId: string, score: number, total: number) => void;
    markExerciseComplete: (id: string) => void;
    isExerciseComplete: (id: string) => boolean;
    getModuleProgress: (moduleId: string, totalLessons: number) => number;
    getOverallProgress: (totalLessons: number) => number;
    getFlashcardProgress: (total: number) => number;
    resetProgress: () => void;
}

const STORAGE_KEY = 'structlab-progress';

const defaultProgress: ProgressData = {
    completedLessons: [],
    knownFlashcards: [],
    quizScores: {},
    completedExercises: [],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

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

    const markLessonComplete = useCallback((moduleId: string, lessonId: string) => {
        const key = `${moduleId}:${lessonId}`;
        setProgress(prev => {
            if (prev.completedLessons.includes(key)) return prev;
            return { ...prev, completedLessons: [...prev.completedLessons, key] };
        });
    }, []);

    const isLessonComplete = useCallback((moduleId: string, lessonId: string) => {
        return progress.completedLessons.includes(`${moduleId}:${lessonId}`);
    }, [progress.completedLessons]);

    const markFlashcardKnown = useCallback((id: string) => {
        setProgress(prev => {
            if (prev.knownFlashcards.includes(id)) return prev;
            return { ...prev, knownFlashcards: [...prev.knownFlashcards, id] };
        });
    }, []);

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
            if (existing && existing.score / existing.total >= score / total) return prev;
            return {
                ...prev,
                quizScores: {
                    ...prev.quizScores,
                    [moduleId]: { score, total, date: new Date().toISOString() },
                },
            };
        });
    }, []);

    const markExerciseComplete = useCallback((id: string) => {
        setProgress(prev => {
            if (prev.completedExercises.includes(id)) return prev;
            return { ...prev, completedExercises: [...prev.completedExercises, id] };
        });
    }, []);

    const isExerciseComplete = useCallback((id: string) => {
        return progress.completedExercises.includes(id);
    }, [progress.completedExercises]);

    const getModuleProgress = useCallback((moduleId: string, totalLessons: number) => {
        if (totalLessons === 0) return 0;
        const completed = progress.completedLessons.filter(l => l.startsWith(`${moduleId}:`)).length;
        return Math.round((completed / totalLessons) * 100);
    }, [progress.completedLessons]);

    const getOverallProgress = useCallback((totalLessons: number) => {
        if (totalLessons === 0) return 0;
        return Math.round((progress.completedLessons.length / totalLessons) * 100);
    }, [progress.completedLessons]);

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
            markExerciseComplete,
            isExerciseComplete,
            getModuleProgress,
            getOverallProgress,
            getFlashcardProgress,
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
