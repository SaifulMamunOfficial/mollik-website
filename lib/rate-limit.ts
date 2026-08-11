// In-memory rate limiting utility for Next.js API routes (Serverless-compatible best-effort)
const tracker = new Map<string, number[]>();

// Clean up memory every 10 minutes
if (typeof global !== 'undefined') {
    const globalAny = global as any;
    if (!globalAny.rateLimitCleanupInterval) {
        globalAny.rateLimitCleanupInterval = setInterval(() => {
            const now = Date.now();
            tracker.forEach((timestamps, key) => {
                const valid = timestamps.filter((t: number) => now - t < 3600000); // keep only last 1 hour
                if (valid.length === 0) {
                    tracker.delete(key);
                } else {
                    tracker.set(key, valid);
                }
            });
        }, 600000);
    }
}

/**
 * Checks if a request should be rate-limited
 * @param identifier Unique identifier (IP, email, user ID, etc.)
 * @param limit Maximum number of allowed requests in the window
 * @param windowMs Time window in milliseconds
 * @returns boolean true if request is allowed, false if rate limited
 */
export function isRateLimited(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = tracker.get(identifier) || [];
    
    // Filter timestamps within the current window
    const windowStart = now - windowMs;
    const activeTimestamps = timestamps.filter((t: number) => t > windowStart);
    
    if (activeTimestamps.length >= limit) {
        return true; // Limit exceeded
    }
    
    // Add current timestamp and update tracker
    activeTimestamps.push(now);
    tracker.set(identifier, activeTimestamps);
    return false; // Request allowed
}

/**
 * Helper to extract client IP address from request headers
 */
export function getClientIp(req: Request): string {
    const headers = req.headers;
    const xForwardedFor = headers.get('x-forwarded-for');
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }
    const realIp = headers.get('x-real-ip');
    if (realIp) return realIp;
    
    return '127.0.0.1'; // Local fallback
}
