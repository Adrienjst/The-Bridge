import { Bilingual } from '@/contexts/LanguageContext';

export interface ContentSection {
    type: 'text' | 'formula' | 'example' | 'diagram' | 'key-concept' | 'warning' | 'case-study' | 'table' | 'interactive';
    title?: Bilingual;
    body: Bilingual;
    tableData?: { headers: Bilingual[]; rows: Bilingual[][] };
    chartConfig?: { strategy: string; params: Record<string, number> };
}

export interface Lesson {
    id: string;
    title: Bilingual;
    content: ContentSection[];
}

export interface CourseModule {
    id: string;
    number: number;
    title: Bilingual;
    subtitle: Bilingual;
    description: Bilingual;
    difficulty: 'débutant' | 'intermédiaire' | 'avancé';
    duration: Bilingual;
    icon: string;
    color: string;
    lessons: Lesson[];
    objectives: Bilingual[];
}

export interface Flashcard {
    id: string;
    moduleId: string;
    lessonId: string;
    question: Bilingual;
    answer: Bilingual;
    difficulty: 'facile' | 'moyen' | 'difficile';
}

export interface QuizQuestion {
    id: string;
    moduleId: string;
    lessonId: string;
    question: Bilingual;
    options: Bilingual[];
    correctIndex: number;
    explanation: Bilingual;
    difficulty: 'facile' | 'moyen' | 'difficile';
}

export interface ExerciseStep {
    instruction: Bilingual;
    hint?: Bilingual;
    solution: Bilingual;
}

export interface Exercise {
    id: string;
    moduleId: string;
    lessonId: string;
    title: Bilingual;
    description: Bilingual;
    difficulty: 'facile' | 'moyen' | 'difficile';
    steps: ExerciseStep[];
}
