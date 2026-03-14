import { describe, it, expect } from 'vitest';
import { calculateNextReview, isDue, daysUntilReview, DEFAULT_SRS, SRSCardData } from './srs';

describe('SM-2 Algorithm', () => {
    describe('calculateNextReview', () => {
        it('should set interval to 1 day on first successful review', () => {
            const result = calculateNextReview(4, DEFAULT_SRS);
            expect(result.interval).toBe(1);
            expect(result.repetitions).toBe(1);
        });

        it('should set interval to 6 days on second successful review', () => {
            const after1 = calculateNextReview(4, DEFAULT_SRS);
            const after2 = calculateNextReview(4, after1);
            expect(after2.interval).toBe(6);
            expect(after2.repetitions).toBe(2);
        });

        it('should multiply interval by easeFactor on subsequent reviews', () => {
            let card = DEFAULT_SRS;
            card = calculateNextReview(4, card); // rep 1: interval=1
            card = calculateNextReview(4, card); // rep 2: interval=6
            card = calculateNextReview(4, card); // rep 3: interval=6*EF
            expect(card.repetitions).toBe(3);
            expect(card.interval).toBeGreaterThan(6);
        });

        it('should reset to interval=1 on quality < 3 (failed review)', () => {
            let card = DEFAULT_SRS;
            card = calculateNextReview(5, card);
            card = calculateNextReview(5, card);
            card = calculateNextReview(5, card);
            expect(card.repetitions).toBe(3);

            // Fail
            const failed = calculateNextReview(0, card);
            expect(failed.repetitions).toBe(0);
            expect(failed.interval).toBe(1);
        });

        it('should decrease ease factor on low quality', () => {
            const result = calculateNextReview(0, DEFAULT_SRS);
            expect(result.easeFactor).toBeLessThan(DEFAULT_SRS.easeFactor);
        });

        it('should increase ease factor on high quality (5)', () => {
            const result = calculateNextReview(5, DEFAULT_SRS);
            expect(result.easeFactor).toBeGreaterThan(DEFAULT_SRS.easeFactor);
        });

        it('should never let ease factor go below 1.3', () => {
            let card = DEFAULT_SRS;
            // Multiple failures to drive EF down
            for (let i = 0; i < 20; i++) {
                card = calculateNextReview(0, card);
            }
            expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
        });

        it('should clamp quality to 0-5 range', () => {
            const neg = calculateNextReview(-1, DEFAULT_SRS);
            expect(neg.repetitions).toBe(0); // treated as quality=0

            const over = calculateNextReview(10, DEFAULT_SRS);
            expect(over.repetitions).toBe(1); // treated as quality=5
        });

        it('should set a valid nextReview date string', () => {
            const result = calculateNextReview(4, DEFAULT_SRS);
            expect(result.nextReview).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            const reviewDate = new Date(result.nextReview);
            expect(reviewDate.getTime()).toBeGreaterThan(Date.now() - 86400000);
        });
    });

    describe('isDue', () => {
        it('should return true for cards with nextReview in the past', () => {
            const card: SRSCardData = {
                ...DEFAULT_SRS,
                nextReview: '2020-01-01',
            };
            expect(isDue(card)).toBe(true);
        });

        it('should return true for cards due today', () => {
            const card: SRSCardData = {
                ...DEFAULT_SRS,
                nextReview: new Date().toISOString().slice(0, 10),
            };
            expect(isDue(card)).toBe(true);
        });

        it('should return false for cards with nextReview in the future', () => {
            const future = new Date();
            future.setDate(future.getDate() + 5);
            const card: SRSCardData = {
                ...DEFAULT_SRS,
                nextReview: future.toISOString().slice(0, 10),
            };
            expect(isDue(card)).toBe(false);
        });
    });

    describe('daysUntilReview', () => {
        it('should return 0 for past/today dates', () => {
            const card: SRSCardData = {
                ...DEFAULT_SRS,
                nextReview: '2020-01-01',
            };
            expect(daysUntilReview(card)).toBe(0);
        });

        it('should return positive days for future dates', () => {
            const future = new Date();
            future.setDate(future.getDate() + 10);
            const card: SRSCardData = {
                ...DEFAULT_SRS,
                nextReview: future.toISOString().slice(0, 10),
            };
            expect(daysUntilReview(card)).toBeGreaterThan(0);
            expect(daysUntilReview(card)).toBeLessThanOrEqual(10);
        });
    });
});
