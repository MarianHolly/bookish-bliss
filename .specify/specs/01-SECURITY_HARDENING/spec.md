# Security Hardening Spec

**ID**: SECURITY-001
**Priority**: CRITICAL
**Estimated Effort**: 1-2 days
**Success Criteria**: All 3 CRITICAL + 5 HIGH security issues resolved, security checklist 100% pass

---

## Overview

Bookish Bliss has three critical security vulnerabilities that block production deployment:
1. GROQ query injection in product search/filtering
2. Missing input validation in Stripe checkout API
3. Unsafe environment variable handling
4. Missing rate limiting on API endpoints
5. Sensitive data in error logs

This spec addresses these issues to make the application production-ready.

---

## Goals

- **Primary**: Eliminate CRITICAL security vulnerabilities before any production deployment
- **Secondary**: Add defensive programming patterns across all API routes
- **Tertiary**: Establish security review checklist for future development

---

## Success Criteria

### Checklist
- [ ] All 5 GROQ queries parameterized (no string interpolation)
- [ ] Checkout API validates all input with schema validation
- [ ] Environment variables asserted at startup (error if missing)
- [ ] Rate limiting middleware on all API endpoints
- [ ] All console.log/error statements sanitized (no sensitive data)
- [ ] Stripe error responses don't leak API details
- [ ] Security tests pass (manual security review completed)
- [ ] CORS headers validated on all API routes
- [ ] No hardcoded secrets in version control

---

## Requirements

### 1. Fix GROQ Query Injection (CRITICAL)

**Files to Fix**:
- `app/products/page.tsx` - lines 50, 53, 57
- `app/product/[slug]/page.tsx` - line 19
- `app/category/[slug]/page.tsx` - lines 33, 46

**Current Vulnerable Code** (example):
```typescript
// VULNERABLE: String interpolation
const query = `*[_type=="product" && name match "${search}"]`;
const data = await client.fetch(query);
```

**Fixed Implementation**:
```typescript
// SECURE: Use Sanity parameters
import groq from 'groq-tag';

const query = groq`
  *[_type=="product" && name match $search] {
    _id, name, price, image, slug
  }
`;
const data = await client.fetch(query, { search });
```

**Acceptance Criteria**:
- All GROQ queries use parameter passing (no string interpolation)
- No GROQ injection possible with malicious search input
- Search params validated and sanitized on client before sending

---

### 2. Add Input Validation to Checkout API (CRITICAL)

**File**: `app/api/checkout/route.ts`

**Current Issue** (line 20):
```typescript
const { products } = await request.json();
// No validation - accepts anything
```

**Implementation**: Use Zod for schema validation

**New Validation Schema**:
```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1).max(200),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be positive'),
  image: z.string().url().optional(),
});

const CheckoutSchema = z.object({
  products: z.array(ProductSchema).min(1, 'At least one product required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products } = CheckoutSchema.parse(body);
    // Safe to use products now
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    // Handle other errors
  }
}
```

**Acceptance Criteria**:
- All product fields validated
- Negative/zero prices rejected
- Missing fields rejected
- Invalid data returns 400 Bad Request
- Error message doesn't leak internal details

---

### 3. Fix Unsafe Environment Variable Handling (CRITICAL)

**Files to Fix**:
- `app/api/checkout/route.ts` - line 5
- `app/api/session/route.ts` - line 4
- `app/success/page.tsx` - line 5

**Current Issue**:
```typescript
// UNSAFE: Falls back to empty string
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-04-10",
});
```

**Fixed Implementation**:

Create `lib/env.ts`:
```typescript
export function assertEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Environment variable ${key} is not set. ` +
      `Check .env.local and restart the server.`
    );
  }
  return value;
}
```

Use in API routes:
```typescript
import { assertEnv } from '@/lib/env';

const stripe = new Stripe(assertEnv('STRIPE_SECRET_KEY'), {
  apiVersion: "2024-04-10",
});
```

**Acceptance Criteria**:
- Stripe key asserted at module load time
- Missing key throws error immediately with helpful message
- Server won't start without valid configuration
- No fallback to empty string

---

### 4. Add Rate Limiting to API Routes (HIGH)

**Files to Add Rate Limiting**:
- `app/api/checkout/route.ts`
- `app/api/session/route.ts`

**Implementation**: Use Upstash Ratelimit

**Setup Steps**:
```bash
npm install @upstash/ratelimit @upstash/redis
```

Create `lib/ratelimit.ts`:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const checkoutRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 checkouts per hour per IP
  analytics: true,
});

export const sessionRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "1 h"), // 30 requests per hour per IP
});
```

Use in API routes:
```typescript
import { checkoutRatelimit } from '@/lib/ratelimit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await checkoutRatelimit.limit(ip);

  if (!success) {
    return Response.json(
      { error: 'Too many checkout requests. Try again later.' },
      { status: 429 }
    );
  }
  // Continue with checkout...
}
```

**Acceptance Criteria**:
- 10 checkout requests per hour per IP
- 30 session requests per hour per IP
- 429 response when rate limited
- User-friendly error message

---

### 5. Remove Sensitive Data from Logs (HIGH)

**Files to Fix**:
- `app/api/checkout/route.ts` - line 46
- `components/cart-summary.tsx` - line 35
- Any other console.log/error statements

**Current Issue** (line 46):
```typescript
} catch (error) {
  console.log("Error in creating a new product", error);
  // Logs entire error object with sensitive API details
}
```

**Fixed Implementation**:

Create `lib/logger.ts`:
```typescript
export function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`[${context}] ${error.message}`);
    // Log stack trace only in development
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
  } else {
    console.error(`[${context}] Unknown error`);
  }
}
```

Use in API routes:
```typescript
import { logError } from '@/lib/logger';

try {
  const product = await stripe.products.create({...});
} catch (error) {
  logError('stripe.products.create', error);
  // Return generic response to client
  return Response.json(
    { error: 'Failed to process checkout' },
    { status: 500 }
  );
}
```

**Acceptance Criteria**:
- Error messages logged without sensitive data
- Stack traces only in development
- Client receives generic error messages
- No Stripe API response details leaked

---

### 6. Add CORS Validation (HIGH)

**File**: `app/api/checkout/route.ts` - line 22

**Current State**:
```typescript
const origin = request.headers.get("origin");
// Origin header extracted but not validated
```

**Fixed Implementation**:

Create `lib/cors.ts`:
```typescript
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
];

export function validateCors(request: Request): boolean {
  const origin = request.headers.get('origin');
  return origin ? ALLOWED_ORIGINS.includes(origin) : true;
}

export function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
```

Use in API routes:
```typescript
import { validateCors, getCorsHeaders } from '@/lib/cors';

export async function POST(request: Request) {
  if (!validateCors(request)) {
    return new Response('CORS policy violation', { status: 403 });
  }

  // Process request...

  return Response.json(data, {
    headers: getCorsHeaders(request),
  });
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    headers: getCorsHeaders(request),
  });
}
```

**Acceptance Criteria**:
- Only requests from allowed origins accepted
- CORS headers properly set on responses
- OPTIONS preflight requests handled
- Localhost allowed for development

---

## Implementation Steps

### Step 1: Create Security Utility Files (1 hour)
- [ ] Create `lib/env.ts` with assertEnv()
- [ ] Create `lib/logger.ts` with logError()
- [ ] Create `lib/cors.ts` with CORS validation
- [ ] Create `lib/ratelimit.ts` with rate limiter

### Step 2: Fix GROQ Query Injection (2 hours)
- [ ] Update `app/products/page.tsx` queries
- [ ] Update `app/product/[slug]/page.tsx` query
- [ ] Update `app/category/[slug]/page.tsx` queries
- [ ] Test all search/filter functionality

### Step 3: Add Input Validation (2 hours)
- [ ] Install Zod: `npm install zod`
- [ ] Create validation schemas in `app/api/checkout/route.ts`
- [ ] Update checkout handler with validation
- [ ] Test with invalid data

### Step 4: Fix Environment Variables (1 hour)
- [ ] Update `app/api/checkout/route.ts` to use assertEnv()
- [ ] Update `app/api/session/route.ts` to use assertEnv()
- [ ] Update `app/success/page.tsx` to use assertEnv()
- [ ] Test server startup without env vars

### Step 5: Add Rate Limiting (2 hours)
- [ ] Set up Upstash account and Redis
- [ ] Install @upstash/ratelimit
- [ ] Add rate limiting to checkout endpoint
- [ ] Add rate limiting to session endpoint
- [ ] Test rate limit behavior

### Step 6: Sanitize Error Logging (1 hour)
- [ ] Remove all console.log of error objects
- [ ] Use logError() utility consistently
- [ ] Update cart-summary.tsx error handling
- [ ] Verify no sensitive data logged

### Step 7: Security Review & Testing (2 hours)
- [ ] Manual security review of all changes
- [ ] Test CORS validation
- [ ] Test rate limiting
- [ ] Verify error messages are user-friendly
- [ ] Check for any remaining vulnerabilities

---

## Dependencies to Install

```bash
npm install zod @upstash/ratelimit @upstash/redis
```

**Environment Variables Required**:
```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Testing Strategy

### Manual Testing
- [ ] Test search with GROQ injection payload: `"); count()`
- [ ] Test checkout with negative price: `{ price: -100 }`
- [ ] Test checkout with 0 quantity: `{ quantity: 0 }`
- [ ] Test checkout without required fields
- [ ] Test rate limiting (make 11 requests in 1 hour)
- [ ] Verify error messages don't contain Stripe details
- [ ] Check logs don't contain sensitive data

### Security Checklist
- [ ] No hardcoded secrets
- [ ] All env vars asserted at startup
- [ ] GROQ queries parameterized
- [ ] Input validated on all endpoints
- [ ] Rate limiting on checkout/session
- [ ] Error messages user-friendly
- [ ] CORS headers set correctly
- [ ] No sensitive data in logs

---

## Rollout Plan

1. **Deploy to staging** for security review
2. **Run manual penetration testing**
3. **Monitor for errors** in staging for 24 hours
4. **Deploy to production** with feature flags if possible
5. **Monitor production** for rate limiting/CORS issues

---

## Success Metrics

- ✅ All CRITICAL vulnerabilities fixed
- ✅ Zero security issues in manual review
- ✅ All tests pass
- ✅ No regression in functionality
- ✅ Error messages user-friendly
- ✅ Production deployment successful

---

## Notes

- This spec addresses security only; testing framework and code refactoring are separate specs
- Rate limiting requires Upstash Redis account (free tier available)
- Consider hiring security auditor to review before production
- Add security testing to CI/CD pipeline (see Testing Framework spec)
