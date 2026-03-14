/**
 * Analytics utility — event tracking abstraction.
 * 
 * Currently logs to console in development.
 * Ready to be wired to PostHog, Umami, Plausible, or any analytics backend.
 * 
 * To connect a real provider, replace the `send` function.
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

interface AnalyticsProvider {
    track: (event: string, properties?: EventProperties) => void;
    identify?: (userId: string, traits?: EventProperties) => void;
    page?: (name: string, properties?: EventProperties) => void;
}

// ─── Default provider (console in dev, no-op in prod) ───────────────
const consoleProvider: AnalyticsProvider = {
    track: (event, properties) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 [analytics] ${event}`, properties || '');
        }
    },
    identify: (userId, traits) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 [analytics] identify: ${userId}`, traits || '');
        }
    },
    page: (name, properties) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 [analytics] page: ${name}`, properties || '');
        }
    },
};

// ─── Active provider (swap for PostHog/Umami/etc.) ───────────────
let provider: AnalyticsProvider = consoleProvider;

export function setAnalyticsProvider(p: AnalyticsProvider) {
    provider = p;
}

// ─── Public API ───────────────

export function trackEvent(event: string, properties?: EventProperties) {
    provider.track(event, properties);
}

export function identifyUser(userId: string, traits?: EventProperties) {
    provider.identify?.(userId, traits);
}

export function trackPageView(name: string, properties?: EventProperties) {
    provider.page?.(name, properties);
}

// ─── Pre-defined events ───────────────

export const Events = {
    LESSON_COMPLETE: 'lesson_complete',
    FLASHCARD_REVIEW: 'flashcard_review',
    QUIZ_FINISH: 'quiz_finish',
    INTERVIEW_START: 'interview_start',
    INTERVIEW_END: 'interview_end',
    BRAINTEASER_SOLVE: 'brainteaser_solve',
    CASE_STUDY_SUBMIT: 'case_study_submit',
    CODE_EXECUTE: 'code_execute',
    BADGE_EARNED: 'badge_earned',
    LEVEL_UP: 'level_up',
} as const;
