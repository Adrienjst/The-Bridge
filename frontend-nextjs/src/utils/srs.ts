/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo-2 algorithm by Piotr Wozniak.
 * 
 * Quality ratings:
 *   0 - Complete blackout (Again)
 *   1 - Incorrect, but remembered upon seeing answer
 *   2 - Incorrect, but answer seemed easy to recall
 *   3 - Correct with serious difficulty (Hard)
 *   4 - Correct after hesitation (Good)
 *   5 - Perfect response (Easy)
 */

export interface SRSCardData {
    interval: number;       // days until next review
    easeFactor: number;     // ease factor (≥ 1.3)
    repetitions: number;    // consecutive correct reviews
    nextReview: string;     // ISO date string "YYYY-MM-DD"
}

export const DEFAULT_SRS: SRSCardData = {
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReview: new Date().toISOString().slice(0, 10),
};

/**
 * Calculate the next review state for a flashcard based on quality rating.
 * @param quality Rating 0-5 (0=Again, 3=Hard, 4=Good, 5=Easy)
 * @param current Current SRS state of the card
 * @returns Updated SRS state
 */
export function calculateNextReview(
    quality: number,
    current: SRSCardData
): SRSCardData {
    // Clamp quality to 0-5
    const q = Math.max(0, Math.min(5, Math.round(quality)));

    let { interval, easeFactor, repetitions } = current;

    if (q < 3) {
        // Failed review: reset repetitions, short interval
        repetitions = 0;
        interval = 1;
    } else {
        // Successful review
        repetitions += 1;
        if (repetitions === 1) {
            interval = 1;
        } else if (repetitions === 2) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
    }

    // Update ease factor using SM-2 formula
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    // Ease factor floor at 1.3
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Calculate next review date
    const now = new Date();
    const next = new Date(now);
    next.setDate(next.getDate() + interval);
    const nextReview = next.toISOString().slice(0, 10);

    return {
        interval,
        easeFactor: Math.round(easeFactor * 100) / 100,
        repetitions,
        nextReview,
    };
}

/**
 * Check if a card is due for review.
 */
export function isDue(card: SRSCardData): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return card.nextReview <= today;
}

/**
 * Get the number of days until next review.
 */
export function daysUntilReview(card: SRSCardData): number {
    const today = new Date();
    const next = new Date(card.nextReview);
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}
