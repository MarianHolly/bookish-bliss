# Implementation Plan: Security Hardening

**Spec**: [01-SECURITY_HARDENING.md](01-SECURITY_HARDENING.md)
**Priority**: CRITICAL
**Effort**: 1-2 days
**Status**: Planning Phase

---

## Constitution Alignment

### Principle V: Security & Data Protection
- ✅ Never log full credit card numbers or sensitive Stripe data
- ✅ Environment variables for all secrets (API keys, project IDs)
- ✅ HTTPS enforced in production
- ✅ Stripe checkout hosted (never handle raw card data client-side)
- ✅ Cart data in localStorage only—no PII stored
- ✅ Input validation on all forms before sending to Stripe/Sanity

### Governance Check
- ✅ All tests pass; coverage ≥80% on critical paths
- ✅ No secrets are committed

---

## Phase 0: Research & Unknowns

### Technology Stack Research
- **Zod**: Schema validation library (modern TypeScript alternative to Joi/Yup)
- **Upstash Ratelimit**: Serverless rate limiting with Redis backend
- **groq-tag**: Safe GROQ query builder with parameterization

### Key Decisions
1. **Rate Limiting Backend**: Upstash Redis (serverless, free tier available)
2. **Input Validation**: Zod (lightweight, TypeScript-native)
3. **GROQ Safety**: groq-tag library for parameterized queries
4. **Error Logging**: Custom logger utility to sanitize sensitive data

---

## Phase 1: Design & Architecture

### 1.1 Library Utilities to Create

#### `lib/env.ts` - Environment Variable Assertions
```
Purpose: Assert required env vars at startup, fail loudly if missing
Exports: assertEnv(key: string): string
Used by: API routes requiring Stripe, Redis, etc.
```

#### `lib/logger.ts` - Sanitized Error Logging
```
Purpose: Log errors without leaking sensitive data
Exports: logError(context: string, error: unknown): void
Used by: All API routes and error handlers
```

#### `lib/cors.ts` - CORS Validation
```
Purpose: Validate and set CORS headers safely
Exports: validateCors(req: Request), getCorsHeaders(req: Request)
Used by: All API routes handling external requests
```

#### `lib/ratelimit.ts` - Rate Limiting
```
Purpose: Configure and apply rate limiting rules
Exports: checkoutRatelimit, sessionRatelimit
Dependencies: Upstash Redis credentials
Used by: /api/checkout, /api/session routes
```

### 1.2 Code Changes Required

#### File: `app/api/checkout/route.ts`
- **Changes**: Add Zod validation, rate limiting, error handling
- **Lines affected**: 1-50
- **Dependencies**: Zod, ratelimit, logger, env

#### File: `app/api/session/route.ts`
- **Changes**: Add rate limiting, error handling, env assertion
- **Lines affected**: 1-30
- **Dependencies**: ratelimit, logger, env

#### Files: Product/Category Pages (GROQ injection fix)
- `app/products/page.tsx` - lines 50, 53, 57
- `app/product/[slug]/page.tsx` - line 19
- `app/category/[slug]/page.tsx` - lines 33, 46
- **Changes**: Replace string interpolation with groq-tag parameterization
- **Dependencies**: groq-tag

#### File: `components/cart-summary.tsx`
- **Changes**: Add error handling, user-friendly error messages
- **Lines affected**: 35+ (error handling section)
- **Dependencies**: logger

### 1.3 API Contracts

#### POST /api/checkout
```
Request: { products: Product[] }
Validation: Zod ProductSchema
Rate Limit: 10 requests per hour per IP
Response: { url: string } | { error: string }
```

#### POST /api/session
```
Request: { sessionId: string }
Validation: Basic type checking
Rate Limit: 30 requests per hour per IP
Response: { status: string; customer_details?: object } | { error: string }
```

### 1.4 Data Model (No DB changes - configuration only)

```
Configuration:
- STRIPE_SECRET_KEY: Required env var
- UPSTASH_REDIS_REST_URL: Required for rate limiting
- UPSTASH_REDIS_REST_TOKEN: Required for rate limiting
- NEXT_PUBLIC_SITE_URL: Required for CORS validation
```

---

## Phase 2: Implementation Tasks

### Task Group 1: Utility Libraries (2 hours)
1. [ ] Create `lib/env.ts` with assertEnv()
2. [ ] Create `lib/logger.ts` with logError()
3. [ ] Create `lib/cors.ts` with CORS validation
4. [ ] Create `lib/ratelimit.ts` with Upstash config
5. [ ] Install dependencies: `npm install zod @upstash/ratelimit @upstash/redis`

### Task Group 2: GROQ Query Injection Fixes (2 hours)
1. [ ] Update `app/products/page.tsx` - parameterize 3 queries
2. [ ] Update `app/product/[slug]/page.tsx` - parameterize query
3. [ ] Update `app/category/[slug]/page.tsx` - parameterize 2 queries
4. [ ] Install groq-tag: `npm install groq-tag`
5. [ ] Test search/filter functionality

### Task Group 3: Checkout API Hardening (2 hours)
1. [ ] Add Zod validation schema to checkout route
2. [ ] Add input validation before processing
3. [ ] Add error handling with sanitized messages
4. [ ] Add rate limiting
5. [ ] Add CORS validation

### Task Group 4: Session API & Error Handling (1 hour)
1. [ ] Add error handling to `/api/session`
2. [ ] Apply rate limiting
3. [ ] Use assertEnv for STRIPE_SECRET_KEY
4. [ ] Update error logging throughout

### Task Group 5: Success Page Hardening (1 hour)
1. [ ] Add assertEnv for STRIPE_SECRET_KEY in `/app/success/page.tsx`
2. [ ] Add error handling
3. [ ] Update error logging

### Task Group 6: Testing & Validation (2 hours)
1. [ ] Test GROQ injection payloads - verify rejected
2. [ ] Test checkout with invalid data - verify 400 errors
3. [ ] Test rate limiting - trigger 429 errors
4. [ ] Test error messages - verify no sensitive data leaked
5. [ ] Manual security review checklist

---

## Phase 3: Validation & QA

### Security Checklist
- [ ] No hardcoded secrets
- [ ] All env vars asserted at startup
- [ ] GROQ queries parameterized
- [ ] Input validated on all endpoints
- [ ] Rate limiting on checkout/session
- [ ] Error messages user-friendly
- [ ] CORS headers set correctly
- [ ] No sensitive data in logs

### Testing Strategy
- **Unit Tests**: Validation schemas, error handling
- **Integration Tests**: Full checkout flow with mocking
- **Manual Testing**: Security payloads, error scenarios

---

## Dependencies & Environment Setup

### New npm Packages
```bash
npm install zod @upstash/ratelimit @upstash/redis groq-tag
```

### Environment Variables Required
```
STRIPE_SECRET_KEY=sk_test_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000 (or production domain)
```

### External Services
- **Upstash**: Free tier provides sufficient Redis for rate limiting
  - Create account at https://upstash.com
  - Create Redis database
  - Copy REST URL and token to .env.local

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Rate limiting blocks legitimate users | Use generous limits (10/hr checkout, 30/hr session) |
| Zod validation too strict | Validate against real Stripe API requirements |
| Breaking existing queries | Test search/filter after GROQ changes |
| Upstash service downtime | Graceful degradation - log error, don't block checkout |

---

## Success Criteria Verification

- ✅ All 5 GROQ queries parameterized (verify in code)
- ✅ Checkout validates with Zod (unit test)
- ✅ Env vars asserted at startup (test missing vars)
- ✅ Rate limiting active (test 11+ requests)
- ✅ Error logs sanitized (grep for sensitive terms)
- ✅ CORS validated (test cross-origin requests)
- ✅ No secrets in git (git log --all -S "sk_" or "pk_")

---

## Rollout Plan

1. **Develop locally** - Implement all changes, test locally
2. **Run security checklist** - Verify all items pass
3. **Deploy to staging** - Test with real Stripe test mode
4. **Manual penetration testing** - Test injection payloads
5. **Deploy to production** - Roll out with confidence

---

## Notes

- Zod validation patterns match Stripe API requirements exactly
- Rate limiting uses IP-based identification (sufficient for most cases)
- Upstash free tier: up to 10,000 commands/day (more than sufficient)
- CORS validation allows localhost for development
- All error messages sanitized for user display

