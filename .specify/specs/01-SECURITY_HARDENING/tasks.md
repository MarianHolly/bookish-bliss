# Tasks: Security Hardening

**Spec**: [01-SECURITY_HARDENING.md](01-SECURITY_HARDENING.md)
**Plan**: [plan.md](plan.md)
**Priority**: CRITICAL
**Total Effort**: 1-2 days
**Status**: Ready for Implementation

---

## Task Groups & Dependencies

```
Phase 1: Utility Libraries (2h)
├── lib/env.ts
├── lib/logger.ts
├── lib/cors.ts
├── lib/ratelimit.ts
└── Dependencies installed

Phase 2: GROQ Injection Fixes (2h)
├── app/products/page.tsx
├── app/product/[slug]/page.tsx
├── app/category/[slug]/page.tsx
└── groq-tag installed

Phase 3: Checkout API (2h)
├── Add Zod validation
├── Add error handling
├── Add rate limiting
└── Add CORS validation

Phase 4: Session & Error Handling (1h)
├── app/api/session/route.ts
├── app/success/page.tsx
└── Error logging updated

Phase 5: Testing & Validation (2h)
├── Security manual tests
├── GROQ injection tests
├── Rate limiting tests
└── Error message verification
```

---

## Phase 1: Utility Libraries (2 hours)

### Task 1.1: Install Dependencies
**Effort**: 15 minutes
**Files Modified**: `package.json`

- [ ] Run: `npm install zod @upstash/ratelimit @upstash/redis groq-tag`
- [ ] Verify installation: `npm list zod @upstash/ratelimit @upstash/redis groq-tag`
- [ ] Commit: "chore: add security hardening dependencies"

**Acceptance Criteria**:
- ✅ All 4 packages installed successfully
- ✅ package.json updated with versions
- ✅ npm list shows all packages

---

### Task 1.2: Create `lib/env.ts`
**Effort**: 30 minutes
**Files Created**: `lib/env.ts`

**Implementation**:
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

**Checklist**:
- [ ] File created at `lib/env.ts`
- [ ] assertEnv function accepts key parameter
- [ ] Returns string value if exists
- [ ] Throws error with helpful message if missing
- [ ] Error message instructs user to check .env.local
- [ ] Export function is available

**Acceptance Criteria**:
- ✅ assertEnv('STRIPE_SECRET_KEY') returns the key
- ✅ assertEnv('MISSING_KEY') throws error
- ✅ Error message contains env var name
- ✅ Error message contains .env.local instruction

---

### Task 1.3: Create `lib/logger.ts`
**Effort**: 30 minutes
**Files Created**: `lib/logger.ts`

**Implementation**:
```typescript
export function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`[${context}] ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
  } else {
    console.error(`[${context}] Unknown error`);
  }
}
```

**Checklist**:
- [ ] File created at `lib/logger.ts`
- [ ] logError function accepts context and error
- [ ] Logs formatted as `[context] message`
- [ ] Stack trace only in development
- [ ] Handles non-Error objects gracefully
- [ ] No sensitive data logged
- [ ] Export function is available

**Acceptance Criteria**:
- ✅ logError('checkout', new Error('Failed')) logs properly
- ✅ Stack traces NOT shown in production
- ✅ Stack traces shown in development
- ✅ Non-Error objects handled without throwing

---

### Task 1.4: Create `lib/cors.ts`
**Effort**: 30 minutes
**Files Created**: `lib/cors.ts`

**Implementation**:
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

**Checklist**:
- [ ] File created at `lib/cors.ts`
- [ ] validateCors function validates origin
- [ ] getCorsHeaders returns appropriate headers
- [ ] Localhost always allowed for development
- [ ] Production URL from NEXT_PUBLIC_SITE_URL
- [ ] Exports both functions
- [ ] No credentials leaked

**Acceptance Criteria**:
- ✅ validateCors allows localhost
- ✅ validateCors allows production URL
- ✅ validateCors rejects invalid origins
- ✅ getCorsHeaders returns empty object for invalid origin
- ✅ CORS headers include required fields

---

### Task 1.5: Create `lib/ratelimit.ts`
**Effort**: 30 minutes
**Files Created**: `lib/ratelimit.ts`
**Depends On**: Upstash account setup

**Implementation**:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const checkoutRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
});

export const sessionRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  analytics: true,
});
```

**Pre-requisites**:
- [ ] Create Upstash account at https://upstash.com
- [ ] Create Redis database (free tier)
- [ ] Copy REST URL and token
- [ ] Add to .env.local:
  ```
  UPSTASH_REDIS_REST_URL=...
  UPSTASH_REDIS_REST_TOKEN=...
  ```

**Checklist**:
- [ ] File created at `lib/ratelimit.ts`
- [ ] checkoutRatelimit configured (10/hour)
- [ ] sessionRatelimit configured (30/hour)
- [ ] Both use Upstash Redis
- [ ] Analytics enabled
- [ ] Environment variables required

**Acceptance Criteria**:
- ✅ Ratelimit objects created without error
- ✅ checkoutRatelimit limits to 10 requests/hour
- ✅ sessionRatelimit limits to 30 requests/hour
- ✅ Uses Upstash Redis backend
- ✅ Graceful error handling if Redis unavailable

---

## Phase 2: GROQ Query Injection Fixes (2 hours)

### Task 2.1: Fix GROQ Queries in `app/products/page.tsx`
**Effort**: 30 minutes
**Files Modified**: `app/products/page.tsx`
**Lines**: 50, 53, 57

**Current Issues**:
```typescript
// ❌ VULNERABLE: String interpolation allows injection
const query = `*[_type=="product" && name match "${search}"]`;
```

**Implementation**:
```typescript
// ✅ SECURE: Use groq-tag with parameters
import groq from 'groq-tag';

const query = groq`
  *[_type=="product" && name match $search] {
    _id, name, price, image, slug
  }
`;
const data = await client.fetch(query, { search });
```

**Checklist**:
- [ ] Import groq-tag at top of file
- [ ] Replace 3 vulnerable queries with groq-tag
- [ ] Add search parameter to client.fetch()
- [ ] Remove string interpolation from all queries
- [ ] No backticks in query strings
- [ ] Test search functionality locally

**Acceptance Criteria**:
- ✅ All 3 queries use groq-tag syntax
- ✅ Parameters passed to client.fetch()
- ✅ Search still returns results
- ✅ Injection payload blocked (test: `"); count()`)
- ✅ No breaking changes to UI

---

### Task 2.2: Fix GROQ Query in `app/product/[slug]/page.tsx`
**Effort**: 15 minutes
**Files Modified**: `app/product/[slug]/page.tsx`
**Lines**: 19

**Current Issues**:
```typescript
// ❌ VULNERABLE: String interpolation
const product = await client.fetch(
  `*[_type=="product" && slug.current=="${slug}"][0]`
);
```

**Implementation**:
```typescript
// ✅ SECURE: Use groq-tag with parameters
import groq from 'groq-tag';

const query = groq`
  *[_type=="product" && slug.current==$slug][0] {
    _id, name, price, image, slug, description
  }
`;
const product = await client.fetch(query, { slug });
```

**Checklist**:
- [ ] Import groq-tag
- [ ] Replace vulnerable query
- [ ] Add slug parameter to client.fetch()
- [ ] Test product detail pages load
- [ ] Verify slug filtering works

**Acceptance Criteria**:
- ✅ Query uses groq-tag syntax
- ✅ Parameter passed to client.fetch()
- ✅ Product pages load correctly
- ✅ Injection payload rejected
- ✅ No UI changes

---

### Task 2.3: Fix GROQ Queries in `app/category/[slug]/page.tsx`
**Effort**: 30 minutes
**Files Modified**: `app/category/[slug]/page.tsx`
**Lines**: 33, 46

**Current Issues**:
```typescript
// ❌ VULNERABLE: String interpolation in 2 places
const category = await client.fetch(
  `*[_type=="category" && slug.current=="${slug}"][0]`
);

const products = await client.fetch(
  `*[_type=="product" && references("${category._id}")]`
);
```

**Implementation**:
```typescript
// ✅ SECURE: Use groq-tag with parameters
import groq from 'groq-tag';

const categoryQuery = groq`*[_type=="category" && slug.current==$slug][0]`;
const category = await client.fetch(categoryQuery, { slug });

const productsQuery = groq`
  *[_type=="product" && references($categoryId)] {
    _id, name, price, image, slug
  }
`;
const products = await client.fetch(productsQuery, { categoryId: category._id });
```

**Checklist**:
- [ ] Import groq-tag
- [ ] Replace both vulnerable queries
- [ ] Add parameters to both client.fetch() calls
- [ ] Test category pages load
- [ ] Verify product filtering works
- [ ] Check category listing displays correctly

**Acceptance Criteria**:
- ✅ Both queries use groq-tag syntax
- ✅ Parameters passed correctly
- ✅ Category pages render
- ✅ Products filtered by category
- ✅ Injection payloads rejected
- ✅ No layout changes

---

### Task 2.4: Test GROQ Injection Protection
**Effort**: 30 minutes
**Manual Testing**: Search/Filter functionality

**Test Cases**:
1. [ ] Test search with normal input: `"JavaScript"` → returns books
2. [ ] Test search with injection: `"); count()"` → rejected or escaped
3. [ ] Test category filter with normal input: `fiction` → returns fiction books
4. [ ] Test category filter with injection payload → rejected
5. [ ] Test all pages load without GROQ errors
6. [ ] Verify no console errors in browser

**Acceptance Criteria**:
- ✅ Normal searches work perfectly
- ✅ Injection payloads don't execute
- ✅ No error 500s from malformed GROQ
- ✅ All UI functions normally

---

## Phase 3: Checkout API Hardening (2 hours)

### Task 3.1: Add Zod Validation to `app/api/checkout/route.ts`
**Effort**: 45 minutes
**Files Modified**: `app/api/checkout/route.ts`

**Current Issue**:
```typescript
// ❌ NO VALIDATION - accepts anything
const { products } = await request.json();
```

**Implementation**:
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

**Checklist**:
- [ ] Import Zod at top
- [ ] Create ProductSchema with all fields
- [ ] Create CheckoutSchema with validation rules
- [ ] Add validation to POST handler
- [ ] Catch ZodError specifically
- [ ] Return 400 with user-friendly error
- [ ] Test with invalid data locally

**Acceptance Criteria**:
- ✅ Valid products pass validation
- ✅ Negative prices rejected
- ✅ Zero quantity rejected
- ✅ Missing fields rejected
- ✅ Invalid URLs rejected
- ✅ Returns 400 Bad Request on error
- ✅ Error message is user-friendly

---

### Task 3.2: Add Rate Limiting to Checkout
**Effort**: 30 minutes
**Files Modified**: `app/api/checkout/route.ts`

**Implementation**:
```typescript
import { checkoutRatelimit } from '@/lib/ratelimit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success } = await checkoutRatelimit.limit(ip);

    if (!success) {
      return Response.json(
        { error: 'Too many checkout requests. Try again later.' },
        { status: 429 }
      );
    }

    // Continue with validation and checkout...
  } catch (error) {
    // Error handling
  }
}
```

**Checklist**:
- [ ] Import checkoutRatelimit
- [ ] Extract IP from request headers
- [ ] Call checkoutRatelimit.limit(ip)
- [ ] Return 429 if rate limit exceeded
- [ ] User-friendly error message
- [ ] Test rate limiting (11 requests should fail)

**Acceptance Criteria**:
- ✅ First 10 requests succeed
- ✅ 11th request returns 429
- ✅ Error message user-friendly
- ✅ IP-based identification works

---

### Task 3.3: Add CORS Validation to Checkout
**Effort**: 30 minutes
**Files Modified**: `app/api/checkout/route.ts`

**Implementation**:
```typescript
import { validateCors, getCorsHeaders } from '@/lib/cors';

export async function POST(request: Request) {
  if (!validateCors(request)) {
    return new Response('CORS policy violation', { status: 403 });
  }

  try {
    // Validation and checkout logic...

    return Response.json(data, {
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    // Error handling
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    headers: getCorsHeaders(request),
  });
}
```

**Checklist**:
- [ ] Import validateCors and getCorsHeaders
- [ ] Add CORS validation at start of POST
- [ ] Return 403 if validation fails
- [ ] Add CORS headers to all responses
- [ ] Add OPTIONS handler for preflight
- [ ] Test cross-origin requests

**Acceptance Criteria**:
- ✅ Valid origins accepted
- ✅ Invalid origins rejected with 403
- ✅ CORS headers in responses
- ✅ OPTIONS preflight works
- ✅ Localhost always allowed

---

### Task 3.4: Add Error Handling to Checkout
**Effort**: 30 minutes
**Files Modified**: `app/api/checkout/route.ts`

**Implementation**:
```typescript
import { logError } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    // Validation logic...

    const session = await stripe.checkout.sessions.create({
      // Configuration
    });

    return Response.json({ url: session.url }, {
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    logError('checkout', error);

    // Return generic error to client
    return Response.json(
      { error: 'Failed to process checkout' },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}
```

**Checklist**:
- [ ] Import logError utility
- [ ] Wrap all logic in try-catch
- [ ] Call logError with context
- [ ] Return generic error to client
- [ ] Include CORS headers in error response
- [ ] Test error path

**Acceptance Criteria**:
- ✅ Errors logged with context
- ✅ No sensitive data in error logs
- ✅ Client gets generic error message
- ✅ CORS headers included
- ✅ No server crashes

---

## Phase 4: Session & Error Handling (1 hour)

### Task 4.1: Harden `app/api/session/route.ts`
**Effort**: 30 minutes
**Files Modified**: `app/api/session/route.ts`

**Implementation**:
```typescript
import { Stripe } from 'stripe';
import { assertEnv } from '@/lib/env';
import { logError } from '@/lib/logger';
import { sessionRatelimit } from '@/lib/ratelimit';
import { validateCors, getCorsHeaders } from '@/lib/cors';

const stripe = new Stripe(assertEnv('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-04-10',
});

export async function POST(request: Request) {
  if (!validateCors(request)) {
    return new Response('CORS policy violation', { status: 403 });
  }

  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success } = await sessionRatelimit.limit(ip);

    if (!success) {
      return Response.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429, headers: getCorsHeaders(request) }
      );
    }

    const { sessionId } = await request.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return Response.json(
        { error: 'Invalid session ID' },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return Response.json(
      {
        status: session.payment_status,
        customer: session.customer_details,
      },
      { headers: getCorsHeaders(request) }
    );
  } catch (error) {
    logError('session', error);
    return Response.json(
      { error: 'Failed to retrieve session' },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}
```

**Checklist**:
- [ ] Import all security utilities
- [ ] Use assertEnv for STRIPE_SECRET_KEY
- [ ] Add CORS validation
- [ ] Add rate limiting
- [ ] Validate sessionId input
- [ ] Use logError for errors
- [ ] CORS headers on all responses
- [ ] Test with rate limiting
- [ ] Test with invalid sessionId

**Acceptance Criteria**:
- ✅ All security measures in place
- ✅ Rate limiting working
- ✅ CORS validation working
- ✅ Input validation working
- ✅ Errors logged without sensitive data

---

### Task 4.2: Update Success Page Error Handling
**Effort**: 15 minutes
**Files Modified**: `app/success/page.tsx`

**Implementation**:
```typescript
import { assertEnv } from '@/lib/env';
import { Stripe } from 'stripe';

const stripe = new Stripe(assertEnv('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-04-10',
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  try {
    if (!searchParams.session_id) {
      return <div>Invalid session</div>;
    }

    const session = await stripe.checkout.sessions.retrieve(
      searchParams.session_id
    );

    return (
      <div>
        <h1>Thank you for your purchase!</h1>
        <p>Order ID: {session.id}</p>
        {/* Rest of success page */}
      </div>
    );
  } catch (error) {
    return <div>Error retrieving order details</div>;
  }
}
```

**Checklist**:
- [ ] Import assertEnv
- [ ] Wrap logic in try-catch
- [ ] Validate session_id parameter
- [ ] Show generic error on failure
- [ ] No sensitive data in errors
- [ ] Test with missing session_id
- [ ] Test with invalid session_id

**Acceptance Criteria**:
- ✅ assertEnv throws if key missing
- ✅ Missing session_id handled gracefully
- ✅ Invalid session_id shows error page
- ✅ No sensitive data exposed

---

## Phase 5: Testing & Validation (2 hours)

### Task 5.1: Manual Security Testing
**Effort**: 1 hour
**Manual Testing**: All 5 success criteria

**Test Case 1: GROQ Injection**
- [ ] Navigate to products page
- [ ] Search for: `"; count()`
- [ ] Verify: No injection, results normally handled
- [ ] Search for: `* UNION SELECT`
- [ ] Verify: No error, injection prevented

**Test Case 2: Input Validation**
- [ ] Open browser DevTools
- [ ] Intercept checkout request
- [ ] Modify price to `-100`
- [ ] Verify: 400 Bad Request returned
- [ ] Modify quantity to `0`
- [ ] Verify: 400 Bad Request returned

**Test Case 3: Rate Limiting**
- [ ] Make 10 checkout requests rapidly
- [ ] Verify: All 10 succeed
- [ ] Make 11th request
- [ ] Verify: 429 response (Too Many Requests)
- [ ] Wait 1 hour (or adjust limit for testing)
- [ ] Verify: New requests succeed

**Test Case 4: Error Logging**
- [ ] Force an error in checkout (e.g., invalid Stripe key)
- [ ] Check server logs
- [ ] Verify: Error logged with context `[checkout]`
- [ ] Verify: No Stripe API keys in logs
- [ ] Verify: No full error objects in logs

**Test Case 5: CORS Validation**
- [ ] Open browser console from different domain
- [ ] Make request to /api/checkout
- [ ] Verify: Preflight OPTIONS succeeds
- [ ] Verify: CORS headers present
- [ ] Verify: localhost allowed

**Checklist**:
- [ ] All 5 test cases passed
- [ ] No errors in console
- [ ] No sensitive data in logs
- [ ] Rate limiting working
- [ ] Injection prevention verified

---

### Task 5.2: Verify All Files Modified
**Effort**: 15 minutes
**Code Review**: Check all 9 files

**Files to Verify**:
- [ ] `lib/env.ts` - Created ✓
- [ ] `lib/logger.ts` - Created ✓
- [ ] `lib/cors.ts` - Created ✓
- [ ] `lib/ratelimit.ts` - Created ✓
- [ ] `app/products/page.tsx` - 3 queries fixed ✓
- [ ] `app/product/[slug]/page.tsx` - 1 query fixed ✓
- [ ] `app/category/[slug]/page.tsx` - 2 queries fixed ✓
- [ ] `app/api/checkout/route.ts` - All hardening ✓
- [ ] `app/api/session/route.ts` - All hardening ✓
- [ ] `app/success/page.tsx` - Error handling ✓

**Checklist**:
- [ ] All 9 files exist and modified
- [ ] No syntax errors
- [ ] All imports correct
- [ ] All exports available
- [ ] Types match usage

---

### Task 5.3: Environment Variables Setup
**Effort**: 15 minutes
**Documentation**: .env.local template

**Checklist**:
- [ ] Verify STRIPE_SECRET_KEY in .env.local
- [ ] Verify UPSTASH_REDIS_REST_URL in .env.local
- [ ] Verify UPSTASH_REDIS_REST_TOKEN in .env.local
- [ ] Verify NEXT_PUBLIC_SITE_URL in .env.local
- [ ] Test: `npm run dev` starts without errors
- [ ] Test: Missing vars throw helpful errors

**Required Environment Variables**:
```
STRIPE_SECRET_KEY=sk_test_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000 (dev) or production URL
```

---

### Task 5.4: Security Checklist Sign-Off
**Effort**: 15 minutes
**Final Validation**: All criteria met

**Security Checklist**:
- [ ] All 5 GROQ queries parameterized
- [ ] No string interpolation in any query
- [ ] Checkout API validates all input (Zod)
- [ ] Invalid data returns 400 errors
- [ ] Environment variables asserted at startup
- [ ] Missing vars throw errors (server won't start)
- [ ] Rate limiting on /api/checkout (10/hour)
- [ ] Rate limiting on /api/session (30/hour)
- [ ] Rate limit returns 429 errors
- [ ] All console.log statements sanitized
- [ ] No Stripe API keys in logs
- [ ] No full error objects logged
- [ ] Error messages are user-friendly
- [ ] CORS validation on all endpoints
- [ ] CORS headers set correctly
- [ ] OPTIONS preflight handled
- [ ] No hardcoded secrets in code
- [ ] No hardcoded secrets in git

**Final Sign-Off**:
- [ ] All 18 criteria verified
- [ ] No outstanding issues
- [ ] Ready for production deployment

---

## Summary

**Total Tasks**: 23 actionable items
**Total Effort**: 9-10 hours
**Deliverables**:
- 4 utility libraries (env, logger, cors, ratelimit)
- 5 GROQ query fixes
- 2 API routes hardened
- 1 page component updated
- Comprehensive security testing

**Success Criteria**:
- ✅ All CRITICAL vulnerabilities fixed
- ✅ No GROQ injection possible
- ✅ All input validated
- ✅ Rate limiting active
- ✅ Error logs sanitized
- ✅ CORS validated
- ✅ No secrets in git

