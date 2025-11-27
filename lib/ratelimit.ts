/**
 * Rate limiting configuration using Upstash Redis
 * Provides rate limiters for checkout and session endpoints
 *
 * Requires environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

/**
 * Checkout rate limiter: 10 requests per hour per IP
 */
export const checkoutRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
});

/**
 * Session rate limiter: 30 requests per hour per IP
 */
export const sessionRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, '1 h'),
  analytics: true,
});
