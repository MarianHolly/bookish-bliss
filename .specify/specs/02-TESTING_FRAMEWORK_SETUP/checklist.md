# Testing Framework Setup - Implementation Checklist

**Status**: NOT STARTED
**Last Updated**: 2025-11-28
**Progress**: 0% (Prerequisite: Phase 1 Security must be complete first)

---

## Dependencies

**Prerequisite**: ✅ Phase 1 (Security Hardening) COMPLETE

---

## Phase 1: Framework Setup (1 day)

### Task 1.1: Install Vitest & Dependencies
- [ ] Run: `npm install --save-dev vitest @vitest/ui @vitest/coverage-v8`
- [ ] Run: `npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react`
- [ ] Verify: `npm list vitest @vitest/ui @testing-library/react`
- [ ] No peer dependency warnings
- [ ] devDependencies updated in package.json

**Acceptance Criteria**:
- [ ] 10+ packages installed
- [ ] vitest 1.0+, @vitest/ui, @testing-library packages available
- [ ] npm run test command works

**Status**: ⏳ PENDING

---

### Task 1.2: Create `vitest.config.ts`
- [ ] File created at project root
- [ ] defineConfig imported from vitest/config
- [ ] react plugin added
- [ ] jsdom environment configured
- [ ] setupFiles points to vitest.setup.ts
- [ ] Coverage thresholds set (60% minimum)
- [ ] @ alias configured to project root
- [ ] No syntax errors

**Acceptance Criteria**:
- [ ] vitest.config.ts exists at project root
- [ ] Valid TypeScript configuration
- [ ] @ alias resolves to correct path
- [ ] Coverage reports will generate

**Status**: ⏳ PENDING

---

### Task 1.3: Create `vitest.setup.ts`
- [ ] File created at project root
- [ ] @testing-library/jest-dom imported
- [ ] next/navigation mocked globally
- [ ] useRouter returns mock methods
- [ ] useSearchParams returns empty URLSearchParams
- [ ] usePathname returns empty string
- [ ] localStorage mocked globally
- [ ] No syntax errors

**Acceptance Criteria**:
- [ ] vitest.setup.ts exists
- [ ] All Next.js features mocked
- [ ] localStorage available in tests
- [ ] Tests don't fail on router usage

**Status**: ⏳ PENDING

---

### Task 1.4: Update `package.json` Scripts
- [ ] Add "test": "vitest"
- [ ] Add "test:ui": "vitest --ui"
- [ ] Add "test:run": "vitest run"
- [ ] Add "test:coverage": "vitest run --coverage"
- [ ] Add "test:e2e": "playwright test"
- [ ] Add "test:e2e:ui": "playwright test --ui"
- [ ] Add "test:ci": "npm run test:run && npm run test:coverage && npm run test:e2e"
- [ ] JSON is valid

**Acceptance Criteria**:
- [ ] `npm run test` works (shows watch mode)
- [ ] `npm run test:run` completes without errors
- [ ] `npm run test:coverage` generates reports
- [ ] All scripts are executable

**Status**: ⏳ PENDING

---

### Task 1.5: Create Test Directory Structure
- [ ] `__tests__/` directory created
- [ ] `unit/`, `integration/`, `e2e/` subdirectories created
- [ ] `unit/context/`, `unit/lib/`, `unit/hooks/`, `unit/sanity/` created
- [ ] `fixtures/` directory created
- [ ] `utils/` directory created
- [ ] All directories exist

**Acceptance Criteria**:
- [ ] Full test directory structure in place
- [ ] All 8 directories created
- [ ] Ready for test files

**Status**: ⏳ PENDING

---

### Task 1.6: Install Playwright
- [ ] `npm install --save-dev @playwright/test`
- [ ] `npx playwright install` completes
- [ ] Chromium, Firefox, WebKit browsers installed
- [ ] playwright.config.ts ready to be created

**Acceptance Criteria**:
- [ ] @playwright/test in devDependencies
- [ ] playwright package directory created
- [ ] Browsers downloaded (~1-2 GB)
- [ ] No errors from install

**Status**: ⏳ PENDING

---

### Task 1.7: Create `playwright.config.ts`
- [ ] File created at project root
- [ ] testDir points to e2e folder
- [ ] 3 browser configurations included
- [ ] webServer configured (auto-starts dev server)
- [ ] HTML reporter enabled
- [ ] Trace enabled for debugging
- [ ] No syntax errors

**Acceptance Criteria**:
- [ ] playwright.config.ts exists
- [ ] Valid TypeScript config
- [ ] 3 browsers configured
- [ ] Dev server auto-start configured

**Status**: ⏳ PENDING

---

## Phase 2: Mock Fixtures (1 day)

### Task 2.1: Create `__tests__/fixtures/mock-sanity.ts`
- [ ] File created
- [ ] mockSanityClient has fetch method
- [ ] fetch is vi.fn (Vitest mock)
- [ ] mockProducts array has 2 items
- [ ] Both products have required fields
- [ ] Types match actual Product interface
- [ ] Exports are available

**Status**: ⏳ PENDING

---

### Task 2.2: Create `__tests__/fixtures/mock-stripe.ts`
- [ ] File created
- [ ] mockStripe has checkout and products
- [ ] All methods are vi.fn (mock functions)
- [ ] create and retrieve methods return realistic data
- [ ] mockCheckoutSession has required fields
- [ ] Exports available

**Status**: ⏳ PENDING

---

### Task 2.3: Create `__tests__/fixtures/mock-storage.ts`
- [ ] File created
- [ ] createMockStorage function returns storage object
- [ ] getItem, setItem, removeItem implemented
- [ ] clear resets all data
- [ ] length property works
- [ ] key method works
- [ ] All Storage API methods present

**Status**: ⏳ PENDING

---

### Task 2.4: Create `__tests__/utils/test-helpers.ts`
- [ ] File created
- [ ] CartProvider wrapper included
- [ ] customRender function wraps with providers
- [ ] Re-exports testing-library utilities
- [ ] Exports render as default render

**Status**: ⏳ PENDING

---

### Task 2.5: Create `__tests__/utils/test-setup.ts`
- [ ] File created
- [ ] beforeEach hook sets up mock storage
- [ ] beforeEach clears all mocks
- [ ] afterEach restores mocks
- [ ] Can be imported in test files

**Status**: ⏳ PENDING

---

## Phase 3: Unit Tests (3-4 days)

### Task 3.1: Create `__tests__/unit/context/useCart.test.ts`
- [ ] File created at __tests__/unit/context/useCart.test.ts
- [ ] Test: should initialize with empty cart
- [ ] Test: should add product to cart
- [ ] Test: should increment quantity if product already in cart
- [ ] Test: should remove product from cart
- [ ] Test: should increment product quantity
- [ ] Test: should decrement product quantity
- [ ] Test: should remove product when quantity reaches 0
- [ ] Test: should reset cart
- [ ] beforeEach clears localStorage
- [ ] Tests are isolated

**Acceptance Criteria**:
- [ ] `npm run test:run` shows 8 passing tests
- [ ] Each test title describes expected behavior
- [ ] All tests pass consistently

**Status**: ⏳ PENDING

---

### Task 3.2: Create `__tests__/unit/lib/utils.test.ts`
- [ ] File created at __tests__/unit/lib/utils.test.ts
- [ ] Test: should merge Tailwind classes correctly
- [ ] Test: should handle undefined values
- [ ] Test: should handle empty strings
- [ ] Test: should handle conditional classes
- [ ] Test: should override conflicting classes
- [ ] All assertions present

**Acceptance Criteria**:
- [ ] 5 tests pass for cn() utility
- [ ] Confirms Tailwind class merging works
- [ ] Verifies no conflicts remain

**Status**: ⏳ PENDING

---

### Task 3.3: Create `__tests__/unit/lib/env.test.ts`
- [ ] File created at __tests__/unit/lib/env.test.ts
- [ ] Environment preserved/restored in tests
- [ ] Test: should return env variable if set
- [ ] Test: should throw error if env variable missing
- [ ] Error message verified

**Acceptance Criteria**:
- [ ] 2 tests pass
- [ ] Error handling verified
- [ ] Environment isolation confirmed

**Status**: ⏳ PENDING

---

### Task 3.4: Create `__tests__/unit/hooks/use-local-storage.test.ts`
- [ ] File created at __tests__/unit/hooks/use-local-storage.test.ts
- [ ] Test: should read from localStorage
- [ ] Test: should write to localStorage
- [ ] Test: should update when storage changes
- [ ] Test: should handle JSON serialization
- [ ] Tests use renderHook pattern
- [ ] localStorage operations verified
- [ ] JSON serialization tested

**Status**: ⏳ PENDING

---

### Task 3.5: Create `__tests__/unit/sanity/queries.test.ts`
- [ ] File created at __tests__/unit/sanity/queries.test.ts
- [ ] Test: should build getAll query
- [ ] Test: should build getBySlug query
- [ ] Test: should build getCategories query
- [ ] Test: should include all required fields
- [ ] Test: should parameterize queries safely
- [ ] Query builders verified
- [ ] Parameterization tested
- [ ] No string interpolation in queries

**Status**: ⏳ PENDING

---

## Phase 4: Integration Tests (2-3 days)

### Task 4.1: Create `__tests__/integration/cart.test.ts`
- [ ] File created at __tests__/integration/cart.test.ts
- [ ] Test: should persist cart to localStorage
- [ ] Test: should restore cart from localStorage on mount
- [ ] Test: should handle multiple product additions
- [ ] Test: should calculate cart total correctly
- [ ] Test: should maintain cart state across re-renders
- [ ] Tests verify localStorage persistence
- [ ] Tests use waitFor for async operations
- [ ] Cart state transitions tested

**Status**: ⏳ PENDING

---

### Task 4.2: Create `__tests__/integration/checkout.test.ts`
- [ ] File created at __tests__/integration/checkout.test.ts
- [ ] Test: should validate products before checkout
- [ ] Test: should format cart for Stripe API
- [ ] Test: should handle API errors gracefully
- [ ] Test: should return checkout session URL
- [ ] Uses mockStripe for API mocking
- [ ] Validation tested
- [ ] Error handling verified

**Status**: ⏳ PENDING

---

## Phase 5: E2E Tests (2-3 days)

### Task 5.1: Create `__tests__/e2e/product-browsing.spec.ts`
- [ ] File created at __tests__/e2e/product-browsing.spec.ts
- [ ] Test: should display product grid on products page
- [ ] Test: should filter products by category
- [ ] Test: should search for products
- [ ] Test: should navigate to product detail
- [ ] Test: should sort products by price
- [ ] Uses Playwright syntax
- [ ] Tests user-visible behavior
- [ ] Assertions verify expected results

**Status**: ⏳ PENDING

---

### Task 5.2: Create `__tests__/e2e/shopping-cart.spec.ts`
- [ ] File created at __tests__/e2e/shopping-cart.spec.ts
- [ ] Test: should add product to cart
- [ ] Test: should view cart items
- [ ] Test: should update quantity in cart
- [ ] Test: should remove item from cart
- [ ] Cart operations verified
- [ ] UI updates tested

**Status**: ⏳ PENDING

---

### Task 5.3: Create `__tests__/e2e/checkout-flow.spec.ts`
- [ ] File created at __tests__/e2e/checkout-flow.spec.ts
- [ ] Test: should display checkout button on cart page
- [ ] Test: should redirect to Stripe checkout
- [ ] Test: should display success page after payment
- [ ] Checkout flow verified
- [ ] Success/cancel pages tested

**Status**: ⏳ PENDING

---

## Phase 6: CI/CD Setup (1 day)

### Task 6.1: Create `.github/workflows/test.yml`
- [ ] File created at .github/workflows/test.yml
- [ ] Triggers on push/PR to main and develop
- [ ] Node setup included
- [ ] Dependencies installed with npm ci
- [ ] Unit tests run first
- [ ] Coverage generated and uploaded
- [ ] Playwright installed with system deps
- [ ] E2E tests run
- [ ] Artifacts uploaded

**Acceptance Criteria**:
- [ ] .github/workflows/test.yml exists
- [ ] Valid GitHub Actions YAML
- [ ] All test commands included
- [ ] Artifact uploads configured

**Status**: ⏳ PENDING

---

### Task 6.2: Test GitHub Actions Locally
- [ ] Run `npm run test:run` - all tests pass
- [ ] Run `npm run test:coverage` - reports generate
- [ ] Run `npm run test:e2e` - E2E tests pass
- [ ] No local environment issues
- [ ] Ready for PR

**Acceptance Criteria**:
- [ ] All tests pass locally
- [ ] Coverage reports generated
- [ ] No environment issues
- [ ] Ready to push

**Status**: ⏳ PENDING

---

## Summary

| Phase | Status | Tasks | Progress |
|-------|--------|-------|----------|
| **1. Framework Setup** | ⏳ PENDING | 7 | 0% |
| **2. Mock Fixtures** | ⏳ PENDING | 5 | 0% |
| **3. Unit Tests** | ⏳ PENDING | 5 | 0% |
| **4. Integration Tests** | ⏳ PENDING | 2 | 0% |
| **5. E2E Tests** | ⏳ PENDING | 3 | 0% |
| **6. CI/CD Setup** | ⏳ PENDING | 2 | 0% |
| **TOTAL** | ⏳ **0% COMPLETE** | **24 tasks** | **0/24** |

---

## Test Statistics (When Complete)

- **Total Test Files**: 10 files
- **Unit Tests**: 22 tests
- **Integration Tests**: 9 tests
- **E2E Tests**: 12 tests
- **Total Tests**: 43+ tests
- **Target Coverage**: 50%+ critical paths
- **Execution Time**: <30s unit, <5min E2E

---

## Next Steps

1. ✅ Ensure Security Hardening (Phase 1) is complete
2. Start with Phase 1: Framework Setup
3. Follow phases in order: 1 → 2 → 3 → 4 → 5 → 6
4. Run local tests frequently
5. Push to GitHub when all phases complete

---

**Created**: 2025-11-28
**Start Date**: TBD (after Phase 1 Security is complete)
**Estimated Completion**: 3-4 weeks
**Status**: ⏳ **NOT STARTED (WAITING FOR PREREQUISITE)**
