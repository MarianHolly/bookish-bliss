# Implementation Plan: Testing Framework Setup

**Spec**: [02-TESTING_FRAMEWORK_SETUP.md](02-TESTING_FRAMEWORK_SETUP.md)
**Priority**: HIGH
**Effort**: 3-4 weeks (framework + initial tests)
**Status**: Planning Phase

---

## Constitution Alignment

### Principle VI: Test-Driven Development (TDD)
- ✅ Write failing tests before implementation
- ✅ Unit tests for business logic
- ✅ Integration tests for feature interactions
- ✅ E2E tests for critical user journeys
- ✅ Aim for 80%+ coverage on critical paths

### Principle VII: Testing Stack Standardization
- ✅ Vitest for unit/integration tests
- ✅ Playwright for E2E tests
- ✅ Coverage reports generated on every test run
- ✅ Mocking strategy for external services
- ✅ CI/CD integration with blocking tests

### Principle VIII: Code Quality & Testability
- ✅ Business logic separated from React components
- ✅ Custom hooks testable in isolation
- ✅ API routes with isolated logic
- ✅ Sanity/Stripe clients mockable

---

## Phase 0: Research & Unknowns

### Testing Framework Decisions
- **Vitest**: Modern, Next.js-optimized unit test runner (faster than Jest)
- **jsdom**: DOM simulation for component testing
- **@testing-library/react**: Industry-standard component testing utilities
- **Playwright**: Industry-standard E2E testing framework
- **Coverage**: v8 provider (built into Vitest)

### Key Assumptions
- Tests run in isolated environments (jsdom for unit, real browser for E2E)
- Mock Sanity client and Stripe API for unit/integration tests
- E2E tests use test data in Sanity (separate dataset or fixtures)
- CI/CD pipeline available (GitHub Actions)

---

## Phase 1: Design & Setup

### 1.1 Directory Structure

```
project-root/
├── __tests__/
│   ├── unit/
│   │   ├── context/
│   │   │   └── useCart.test.ts
│   │   ├── lib/
│   │   │   ├── utils.test.ts
│   │   │   └── env.test.ts
│   │   ├── hooks/
│   │   │   └── use-local-storage.test.ts
│   │   └── sanity/
│   │       └── queries.test.ts
│   ├── integration/
│   │   ├── cart.test.ts
│   │   └── checkout.test.ts
│   ├── e2e/
│   │   ├── product-browsing.spec.ts
│   │   ├── shopping-cart.spec.ts
│   │   └── checkout-flow.spec.ts
│   ├── fixtures/
│   │   ├── mock-product.ts
│   │   ├── mock-cart.ts
│   │   ├── mock-stripe.ts
│   │   └── mock-sanity.ts
│   └── utils/
│       ├── test-helpers.ts
│       └── test-setup.ts
├── vitest.config.ts
├── vitest.setup.ts
├── playwright.config.ts
└── .github/workflows/test.yml
```

### 1.2 Configuration Files

#### `vitest.config.ts`
- Global test environment setup
- jsdom configuration for DOM testing
- Coverage thresholds (60% minimum, 80% target)
- Path aliases (@/ → project root)

#### `vitest.setup.ts`
- Mock Next.js router and navigation
- Mock localStorage
- Setup testing-library/jest-dom matchers

#### `playwright.config.ts`
- Multi-browser testing (Chromium, Firefox, WebKit)
- Parallel test execution
- HTML report generation
- Dev server auto-start

#### `.github/workflows/test.yml`
- Run on: push to main/develop, pull requests
- Steps: install, unit tests, coverage, E2E tests
- Artifact uploads: coverage reports, Playwright reports

### 1.3 Mock Strategies

#### Sanity Client Mock
```
Location: __tests__/fixtures/mock-sanity.ts
Purpose: Mock GROQ queries and client.fetch()
Exports: mockSanityClient, mockProducts
```

#### Stripe API Mock
```
Location: __tests__/fixtures/mock-stripe.ts
Purpose: Mock checkout sessions and product creation
Exports: mockStripe, mockCheckoutSession
```

#### localStorage Mock
```
Location: __tests__/fixtures/mock-storage.ts
Purpose: Simulate browser storage for cart tests
Exports: createMockStorage()
```

### 1.4 Test Utilities

#### `__tests__/utils/test-helpers.ts`
- Render helpers for components
- Wait utilities for async operations
- Custom matchers for domain objects

#### `__tests__/utils/test-setup.ts`
- Common beforeEach/afterEach hooks
- Global test configuration

---

## Phase 2: Implementation Tasks

### Task Group 1: Framework Setup (1 day)
1. [ ] Install Vitest: `npm install --save-dev vitest @vitest/ui @vitest/coverage-v8`
2. [ ] Install testing libraries: `npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react`
3. [ ] Create `vitest.config.ts` with Next.js support
4. [ ] Create `vitest.setup.ts` with mocks
5. [ ] Create `__tests__/` directory structure
6. [ ] Update `package.json` with test scripts
7. [ ] Install Playwright: `npm install --save-dev @playwright/test`
8. [ ] Run: `npx playwright install`
9. [ ] Create `playwright.config.ts`

### Task Group 2: Mock Fixtures (1 day)
1. [ ] Create `__tests__/fixtures/mock-sanity.ts`
2. [ ] Create `__tests__/fixtures/mock-stripe.ts`
3. [ ] Create `__tests__/fixtures/mock-storage.ts`
4. [ ] Create `__tests__/utils/test-helpers.ts`
5. [ ] Create `__tests__/utils/test-setup.ts`

### Task Group 3: Unit Tests - Cart (2 days)
1. [ ] Create `__tests__/unit/context/useCart.test.ts` (8 tests)
   - Initialize empty cart
   - Add product to cart
   - Increment quantity if exists
   - Remove product
   - Increment quantity
   - Decrement quantity
   - Remove on zero quantity
   - Reset cart

2. [ ] Create `__tests__/unit/lib/utils.test.ts` (5 tests)
   - cn() class merging
   - Undefined handling
   - Empty string handling
   - Conditional classes

3. [ ] Create `__tests__/unit/lib/env.test.ts` (2 tests)
   - assertEnv succeeds with valid env
   - assertEnv throws with missing env

### Task Group 4: Unit Tests - Sanity & Utilities (2 days)
1. [ ] Create `__tests__/unit/sanity/queries.test.ts` (5 tests)
   - GROQ query builders
   - Parameter passing
   - Query result types

2. [ ] Create `__tests__/unit/hooks/use-local-storage.test.ts` (4 tests)
   - Set/get from localStorage
   - Sync across instances
   - Handle JSON serialization

### Task Group 5: Integration Tests (2 days)
1. [ ] Create `__tests__/integration/cart.test.ts` (5 tests)
   - Persist cart to localStorage
   - Restore from localStorage
   - Multiple product additions
   - Calculate totals

2. [ ] Create `__tests__/integration/checkout.test.ts` (4 tests)
   - Validate products before checkout
   - Format cart for Stripe
   - Handle API errors
   - Redirect to Stripe

### Task Group 6: E2E Tests - Critical Journeys (3 days)
1. [ ] Create `__tests__/e2e/product-browsing.spec.ts` (5 tests)
   - Display product grid
   - Filter by category
   - Search products
   - Navigate to product detail
   - Sort products

2. [ ] Create `__tests__/e2e/shopping-cart.spec.ts` (4 tests)
   - Add product to cart
   - View cart items
   - Update quantity
   - Remove item

3. [ ] Create `__tests__/e2e/checkout-flow.spec.ts` (3 tests)
   - Display checkout button
   - Redirect to Stripe
   - Display success page

### Task Group 7: CI/CD Configuration (1 day)
1. [ ] Create `.github/workflows/test.yml`
2. [ ] Configure test execution on PR
3. [ ] Setup coverage report uploads
4. [ ] Configure Playwright artifact uploads
5. [ ] Test GitHub Actions workflow locally

---

## Phase 3: Validation & QA

### Test Coverage Goals
- Unit tests: 20+ tests, targeting 60%+ coverage
- Integration tests: 5+ tests for critical flows
- E2E tests: 3+ tests for complete user journeys
- Overall: 50%+ coverage on critical paths (cart, checkout, Sanity)

### Checklist Before Merging
- [ ] All tests pass locally
- [ ] Coverage reports generated
- [ ] No flaky tests
- [ ] CI/CD pipeline passes
- [ ] Playwright reports generated

---

## Dependencies & Installation

### npm Packages
```bash
npm install --save-dev \
  vitest \
  @vitest/ui \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  @vitejs/plugin-react \
  @playwright/test
```

### npm Scripts (update package.json)
```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:ci": "npm run test:run && npm run test:coverage && npm run test:e2e"
}
```

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Tests slow down development | Run tests in parallel, use --watch mode |
| Flaky E2E tests | Use stable selectors, add wait conditions |
| High maintenance burden | Keep tests focused on behavior, not implementation |
| CI/CD timeout | Optimize test count, run in parallel (CI allows this) |

---

## Success Criteria Verification

- ✅ Vitest runs with `npm run test` (watch mode)
- ✅ Playwright runs with `npm run test:e2e`
- ✅ Coverage reports generated in `coverage/`
- ✅ 20+ unit tests passing
- ✅ 5+ integration tests passing
- ✅ 3+ E2E tests passing
- ✅ GitHub Actions CI/CD configured and passing
- ✅ Tests run in <30s (unit), <5m (E2E)

---

## Rollout Plan

1. **Week 1**: Setup framework, create directory structure, add mocks
2. **Week 2**: Write unit tests for cart, utilities, Sanity queries
3. **Week 3**: Write integration and E2E tests
4. **Week 4**: CI/CD configuration, documentation, team training

---

## Notes

- Tests follow TDD principles: write tests first, implement second
- Mock all external services (Sanity, Stripe) for unit/integration tests
- E2E tests use real application code path (no mocks)
- Coverage thresholds are minimum targets, aim higher
- Test naming convention: `describe()` blocks mirror file structure

