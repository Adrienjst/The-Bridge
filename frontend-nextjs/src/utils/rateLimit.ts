/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach with IP-based tracking.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    }
}, 60000); // cleanup every 60s

export interface RateLimitConfig {
    windowMs: number;   // time window in milliseconds
    maxRequests: number; // max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 60000,   // 1 minute
    maxRequests: 15,    // 15 requests per minute
};

/**
 * Check if a request should be rate-limited.
 * @param identifier - Usually the IP address or a unique client identifier
 * @param config - Rate limit configuration
 * @returns { limited: boolean, remaining: number, resetIn: number }
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { limited: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || now > entry.resetTime) {
        // New window
        store.set(identifier, { count: 1, resetTime: now + config.windowMs });
        return { limited: false, remaining: config.maxRequests - 1, resetIn: config.windowMs };
    }

    entry.count++;

    if (entry.count > config.maxRequests) {
        return {
            limited: true,
            remaining: 0,
            resetIn: entry.resetTime - now,
        };
    }

    return {
        limited: false,
        remaining: config.maxRequests - entry.count,
        resetIn: entry.resetTime - now,
    };
}

/**
 * Get client identifier from request headers.
 */
export function getClientId(headers: Headers): string {
    return (
        headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        headers.get('x-real-ip') ||
        'unknown'
    );
}
