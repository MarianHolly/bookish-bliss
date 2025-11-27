# Tasks: Testing Framework Setup

**Spec**: [02-TESTING_FRAMEWORK_SETUP.md](02-TESTING_FRAMEWORK_SETUP.md)
**Plan**: [plan.md](plan.md)
**Priority**: HIGH
**Total Effort**: 3-4 weeks
**Status**: Ready for Implementation

---

## Task Groups & Dependencies

```
Phase 1: Framework Setup (1 day)
├── Install dependencies
├── Create vitest.config.ts
├── Create vitest.setup.ts
├── Create directory structure
├── Update package.json scripts
├── Install Playwright
├── Create playwright.config.ts
└── Test npm scripts

Phase 2: Mock Fixtures (1 day)
├── mock-sanity.ts
├── mock-stripe.ts
├── mock-storage.ts
├── test-helpers.ts
└── test-setup.ts

Phase 3: Unit Tests (3-4 days)
├── useCart hook (8 tests)
├── Utility functions (5 tests)
├── Sanity queries (5 tests)
└── localStorage hook (4 tests)

Phase 4: Integration Tests (2-3 days)
├── Cart operations (5 tests)
└── Checkout flow (4 tests)

Phase 5: E2E Tests (2-3 days)
├── Product browsing (5 tests)
├── Shopping cart (4 tests)
└── Checkout flow (3 tests)

Phase 6: CI/CD Setup (1 day)
├── Create .github/workflows/test.yml
├── Configure test execution
├── Setup artifact uploads
└── Test locally
```

---

## Phase 1: Framework Setup (1 day)

### Task 1.1: Install Vitest & Dependencies
**Effort**: 1 hour
**Files Modified**: `package.json`

**Commands**:
```bash
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
npm list vitest @vitest/ui @testing-library/react
```

**Checklist**:
- [ ] All packages installed successfully
- [ ] `npm list` shows all packages
- [ ] No peer dependency warnings
- [ ] devDependencies updated in package.json

**Acceptance Criteria**:
- ✅ 10+ packages installed
- ✅ vitest 1.0+, @vitest/ui, @testing-library packages available
- ✅ npm run test command works (see Task 1.4)

---

### Task 1.2: Create `vitest.config.ts`
**Effort**: 30 minutes
**Files Created**: `vitest.config.ts`

**Implementation**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'vitest.config.ts',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Checklist**:
- [ ] File created at project root
- [ ] defineConfig imported from vitest/config
- [ ] react plugin added
- [ ] jsdom environment configured
- [ ] setupFiles points to vitest.setup.ts
- [ ] Coverage thresholds set (60% minimum)
- [ ] @ alias configured to project root
- [ ] No syntax errors

**Acceptance Criteria**:
- ✅ vitest.config.ts exists at project root
- ✅ Valid TypeScript configuration
- ✅ @ alias resolves to correct path
- ✅ Coverage reports will generate

---

### Task 1.3: Create `vitest.setup.ts`
**Effort**: 30 minutes
**Files Created**: `vitest.setup.ts`

**Implementation**:
```typescript
import '@testing-library/jest-dom';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

**Checklist**:
- [ ] File created at project root
- [ ] @testing-library/jest-dom imported
- [ ] next/navigation mocked globally
- [ ] useRouter returns mock methods
- [ ] useSearchParams returns empty URLSearchParams
- [ ] usePathname returns empty string
- [ ] localStorage mocked globally
- [ ] No syntax errors

**Acceptance Criteria**:
- ✅ vitest.setup.ts exists
- ✅ All Next.js features mocked
- ✅ localStorage available in tests
- ✅ Tests don't fail on router usage

---

### Task 1.4: Update `package.json` Scripts
**Effort**: 15 minutes
**Files Modified**: `package.json`

**Add to scripts section**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:ci": "npm run test:run && npm run test:coverage && npm run test:e2e"
  }
}
```

**Checklist**:
- [ ] All 7 npm scripts added
- [ ] `npm run test` triggers vitest watch mode
- [ ] `npm run test:ui` opens vitest UI
- [ ] `npm run test:run` runs tests once
- [ ] `npm run test:coverage` generates coverage
- [ ] `npm run test:e2e` runs Playwright
- [ ] `npm run test:ci` runs full suite
- [ ] JSON is valid

**Acceptance Criteria**:
- ✅ `npm run test` works (shows watch mode)
- ✅ `npm run test:run` completes without errors
- ✅ `npm run test:coverage` generates reports
- ✅ All scripts are executable

---

### Task 1.5: Create Test Directory Structure
**Effort**: 30 minutes
**Files Created**: Directory structure

**Commands**:
```bash
mkdir -p __tests__/unit/context
mkdir -p __tests__/unit/lib
mkdir -p __tests__/unit/hooks
mkdir -p __tests__/unit/sanity
mkdir -p __tests__/integration
mkdir -p __tests__/e2e
mkdir -p __tests__/fixtures
mkdir -p __tests__/utils
```

**Checklist**:
- [ ] `__tests__/` directory created
- [ ] `unit/`, `integration/`, `e2e/` subdirectories created
- [ ] `unit/context/`, `unit/lib/`, `unit/hooks/`, `unit/sanity/` created
- [ ] `fixtures/` directory created
- [ ] `utils/` directory created
- [ ] All directories exist

**Acceptance Criteria**:
- ✅ Full test directory structure in place
- ✅ All 8 directories created
- ✅ Ready for test files

---

### Task 1.6: Install Playwright
**Effort**: 1 hour
**Files Modified**: `package.json`

**Commands**:
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Checklist**:
- [ ] @playwright/test installed
- [ ] `npx playwright install` completes
- [ ] Chromium, Firefox, WebKit browsers installed
- [ ] playwright.config.ts ready to be created (Task 1.7)

**Acceptance Criteria**:
- ✅ @playwright/test in devDependencies
- ✅ playwright package directory created
- ✅ Browsers downloaded (~1-2 GB)
- ✅ No errors from install

---

### Task 1.7: Create `playwright.config.ts`
**Effort**: 30 minutes
**Files Created**: `playwright.config.ts`

**Implementation**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Checklist**:
- [ ] File created at project root
- [ ] testDir points to e2e folder
- [ ] 3 browser configurations included
- [ ] webServer configured (auto-starts dev server)
- [ ] HTML reporter enabled
- [ ] Trace enabled for debugging
- [ ] No syntax errors

**Acceptance Criteria**:
- ✅ playwright.config.ts exists
- ✅ Valid TypeScript config
- ✅ 3 browsers configured
- ✅ Dev server auto-start configured

---

## Phase 2: Mock Fixtures (1 day)

### Task 2.1: Create `__tests__/fixtures/mock-sanity.ts`
**Effort**: 30 minutes
**Files Created**: `__tests__/fixtures/mock-sanity.ts`

**Implementation**:
```typescript
import { vi } from 'vitest';

export const mockSanityClient = {
  fetch: vi.fn(async (query: string, params?: any) => {
    if (query.includes('bestseller')) {
      return [
        {
          _id: '1',
          name: 'Bestselling Book',
          price: 29.99,
          slug: { current: 'bestselling-book' },
        },
      ];
    }
    return [];
  }),
};

export const mockProducts = [
  {
    _id: '1',
    name: 'Test Book 1',
    price: 19.99,
    quantity: 1,
    image: 'https://example.com/book1.jpg',
    slug: { current: 'test-book-1' },
    author: 'Author One',
  },
  {
    _id: '2',
    name: 'Test Book 2',
    price: 24.99,
    quantity: 2,
    image: 'https://example.com/book2.jpg',
    slug: { current: 'test-book-2' },
    author: 'Author Two',
  },
];
```

**Checklist**:
- [ ] File created
- [ ] mockSanityClient has fetch method
- [ ] fetch is vi.fn (Vitest mock)
- [ ] mockProducts array has 2 items
- [ ] Both products have required fields
- [ ] Types match actual Product interface
- [ ] Exports are available

**Acceptance Criteria**:
- ✅ mockSanityClient.fetch is a mock function
- ✅ mockProducts array has correct structure
- ✅ Can be imported in tests

---

### Task 2.2: Create `__tests__/fixtures/mock-stripe.ts`
**Effort**: 30 minutes
**Files Created**: `__tests__/fixtures/mock-stripe.ts`

**Implementation**:
```typescript
import { vi } from 'vitest';

export const mockStripe = {
  checkout: {
    sessions: {
      create: vi.fn(async (params: any) => ({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
      })),
      retrieve: vi.fn(async (sessionId: string) => ({
        id: sessionId,
        status: 'complete',
        payment_status: 'paid',
      })),
    },
  },
  products: {
    create: vi.fn(async (params: any) => ({
      id: 'prod_test_123',
      name: params.name,
    })),
    retrieve: vi.fn(async (productId: string) => ({
      id: productId,
      name: 'Test Product',
    })),
  },
};

export const mockCheckoutSession = {
  id: 'cs_test_123',
  url: 'https://checkout.stripe.com/pay/cs_test_123',
  payment_status: 'unpaid',
};
```

**Checklist**:
- [ ] File created
- [ ] mockStripe has checkout and products
- [ ] All methods are vi.fn (mock functions)
- [ ] create and retrieve methods return realistic data
- [ ] mockCheckoutSession has required fields
- [ ] Exports available

**Acceptance Criteria**:
- ✅ mockStripe checkout/products methods are mocks
- ✅ Can be used in API route tests
- ✅ mockCheckoutSession matches Stripe API

---

### Task 2.3: Create `__tests__/fixtures/mock-storage.ts`
**Effort**: 20 minutes
**Files Created**: `__tests__/fixtures/mock-storage.ts`

**Implementation**:
```typescript
export function createMockStorage() {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
}
```

**Checklist**:
- [ ] File created
- [ ] createMockStorage function returns storage object
- [ ] getItem, setItem, removeItem implemented
- [ ] clear resets all data
- [ ] length property works
- [ ] key method works
- [ ] All Storage API methods present

**Acceptance Criteria**:
- ✅ Mock storage behaves like real localStorage
- ✅ Can persist and retrieve data
- ✅ Can be reset between tests

---

### Task 2.4: Create `__tests__/utils/test-helpers.ts`
**Effort**: 30 minutes
**Files Created**: `__tests__/utils/test-helpers.ts`

**Implementation**:
```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { CartProvider } from '@/context';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

**Checklist**:
- [ ] File created
- [ ] CartProvider wrapper included
- [ ] customRender function wraps with providers
- [ ] Re-exports testing-library utilities
- [ ] Exports render as default render

**Acceptance Criteria**:
- ✅ customRender automatically includes CartProvider
- ✅ All testing-library utilities available
- ✅ Reduces boilerplate in test files

---

### Task 2.5: Create `__tests__/utils/test-setup.ts`
**Effort**: 15 minutes
**Files Created**: `__tests__/utils/test-setup.ts`

**Implementation**:
```typescript
import { beforeEach, afterEach, vi } from 'vitest';
import { createMockStorage } from '@/__tests__/fixtures/mock-storage';

beforeEach(() => {
  // Reset localStorage before each test
  const mockStorage = createMockStorage();
  global.localStorage = mockStorage as any;
  vi.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
  vi.restoreAllMocks();
});
```

**Checklist**:
- [ ] File created
- [ ] beforeEach hook sets up mock storage
- [ ] beforeEach clears all mocks
- [ ] afterEach restores mocks
- [ ] Can be imported in test files

**Acceptance Criteria**:
- ✅ Test isolation configured
- ✅ localStorage reset between tests
- ✅ Mocks cleared between tests

---

## Phase 3: Unit Tests (3-4 days)

### Task 3.1: Create `__tests__/unit/context/useCart.test.ts`
**Effort**: 2 hours
**Files Created**: `__tests__/unit/context/useCart.test.ts`

**Tests to Implement** (8 tests):
1. [ ] should initialize with empty cart
2. [ ] should add product to cart
3. [ ] should increment quantity if product already in cart
4. [ ] should remove product from cart
5. [ ] should increment product quantity
6. [ ] should decrement product quantity
7. [ ] should remove product when quantity reaches 0
8. [ ] should reset cart

**Implementation Pattern**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context';
import { mockProducts } from '@/__tests__/fixtures/mock-product';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });
    expect(result.current.cart).toEqual([]);
  });

  // ... 7 more tests
});
```

**Checklist**:
- [ ] File created at __tests__/unit/context/useCart.test.ts
- [ ] All 8 tests implemented
- [ ] Each test uses renderHook with CartProvider wrapper
- [ ] Each test has clear assertion
- [ ] beforeEach clears localStorage
- [ ] Tests are isolated

**Acceptance Criteria**:
- ✅ `npm run test:run` shows 8 passing tests
- ✅ Each test title describes expected behavior
- ✅ All tests pass consistently

---

### Task 3.2: Create `__tests__/unit/lib/utils.test.ts`
**Effort**: 1 hour
**Files Created**: `__tests__/unit/lib/utils.test.ts`

**Tests to Implement** (5 tests):
1. [ ] should merge Tailwind classes correctly
2. [ ] should handle undefined values
3. [ ] should handle empty strings
4. [ ] should handle conditional classes
5. [ ] should override conflicting classes

**Implementation Pattern**:
```typescript
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn() - Class name utility', () => {
  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-2 py-1 bg-red-500', 'bg-blue-500');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('bg-red-500');
  });

  // ... 4 more tests
});
```

**Checklist**:
- [ ] File created at __tests__/unit/lib/utils.test.ts
- [ ] All 5 tests implemented
- [ ] Tests verify class merging behavior
- [ ] Tests verify Tailwind conflict resolution
- [ ] All assertions present

**Acceptance Criteria**:
- ✅ 5 tests pass for cn() utility
- ✅ Confirms Tailwind class merging works
- ✅ Verifies no conflicts remain

---

### Task 3.3: Create `__tests__/unit/lib/env.test.ts`
**Effort**: 45 minutes
**Files Created**: `__tests__/unit/lib/env.test.ts`

**Tests to Implement** (2 tests):
1. [ ] should return env variable if set
2. [ ] should throw error if env variable missing

**Implementation Pattern**:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { assertEnv } from '@/lib/env';

describe('assertEnv()', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return env variable if set', () => {
    process.env.TEST_VAR = 'test-value';
    expect(assertEnv('TEST_VAR')).toBe('test-value');
  });

  it('should throw error if env variable missing', () => {
    delete process.env.MISSING_VAR;
    expect(() => assertEnv('MISSING_VAR')).toThrow();
  });
});
```

**Checklist**:
- [ ] File created at __tests__/unit/lib/env.test.ts
- [ ] Environment preserved/restored in tests
- [ ] Both test cases implemented
- [ ] Error message verified

**Acceptance Criteria**:
- ✅ 2 tests pass
- ✅ Error handling verified
- ✅ Environment isolation confirmed

---

### Task 3.4: Create `__tests__/unit/hooks/use-local-storage.test.ts`
**Effort**: 1 hour
**Files Created**: `__tests__/unit/hooks/use-local-storage.test.ts`

**Tests to Implement** (4 tests):
1. [ ] should read from localStorage
2. [ ] should write to localStorage
3. [ ] should update when storage changes
4. [ ] should handle JSON serialization

**Implementation Pattern**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/use-local-storage'; // Or wherever it's defined

describe('useLocalStorage()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should read from localStorage', () => {
    localStorage.setItem('test', JSON.stringify({ value: 'hello' }));
    const { result } = renderHook(() => useLocalStorage('test', {}));
    expect(result.current[0]).toEqual({ value: 'hello' });
  });

  // ... 3 more tests
});
```

**Checklist**:
- [ ] File created at __tests__/unit/hooks/use-local-storage.test.ts
- [ ] All 4 tests implemented
- [ ] Tests use renderHook pattern
- [ ] localStorage operations verified
- [ ] JSON serialization tested

**Acceptance Criteria**:
- ✅ 4 tests pass
- ✅ localStorage integration verified
- ✅ Hook behavior confirmed

---

### Task 3.5: Create `__tests__/unit/sanity/queries.test.ts`
**Effort**: 1 hour
**Files Created**: `__tests__/unit/sanity/queries.test.ts`

**Tests to Implement** (5 tests):
1. [ ] should build getAll query
2. [ ] should build getBySlug query
3. [ ] should build getCategories query
4. [ ] should include all required fields
5. [ ] should parameterize queries safely

**Implementation Pattern**:
```typescript
import { describe, it, expect } from 'vitest';
import { productQueries } from '@/lib/queries';

describe('GROQ Queries', () => {
  it('should build getAll query', () => {
    const query = productQueries.getAll();
    expect(query).toContain('_type == "product"');
    expect(query).toContain('$search');
  });

  // ... 4 more tests
});
```

**Checklist**:
- [ ] File created at __tests__/unit/sanity/queries.test.ts
- [ ] All 5 tests implemented
- [ ] Query builders verified
- [ ] Parameterization tested
- [ ] No string interpolation in queries

**Acceptance Criteria**:
- ✅ 5 tests pass
- ✅ GROQ queries properly parameterized
- ✅ Query structure verified

---

## Phase 4: Integration Tests (2-3 days)

### Task 4.1: Create `__tests__/integration/cart.test.ts`
**Effort**: 2 hours
**Files Created**: `__tests__/integration/cart.test.ts`

**Tests to Implement** (5 tests):
1. [ ] should persist cart to localStorage
2. [ ] should restore cart from localStorage on mount
3. [ ] should handle multiple product additions
4. [ ] should calculate cart total correctly
5. [ ] should maintain cart state across re-renders

**Implementation Pattern**:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '@/context';
import { mockProducts } from '@/__tests__/fixtures/mock-product';

describe('Cart Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should persist cart to localStorage', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]);
    });

    await waitFor(() => {
      const stored = localStorage.getItem('cart');
      expect(stored).toBeDefined();
    });
  });

  // ... 4 more tests
});
```

**Checklist**:
- [ ] File created at __tests__/integration/cart.test.ts
- [ ] All 5 tests implemented
- [ ] Tests verify localStorage persistence
- [ ] Tests use waitFor for async operations
- [ ] Cart state transitions tested

**Acceptance Criteria**:
- ✅ 5 integration tests pass
- ✅ Cart persistence verified
- ✅ State management tested

---

### Task 4.2: Create `__tests__/integration/checkout.test.ts`
**Effort**: 2 hours
**Files Created**: `__tests__/integration/checkout.test.ts`

**Tests to Implement** (4 tests):
1. [ ] should validate products before checkout
2. [ ] should format cart for Stripe API
3. [ ] should handle API errors gracefully
4. [ ] should return checkout session URL

**Implementation Pattern**:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockStripe, mockCheckoutSession } from '@/__tests__/fixtures/mock-stripe';
import { mockProducts } from '@/__tests__/fixtures/mock-product';

describe('Checkout Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate products before checkout', async () => {
    const invalidProducts = [{ price: -100 }];
    // Test validation logic
    expect(() => validateProducts(invalidProducts)).toThrow();
  });

  // ... 3 more tests
});
```

**Checklist**:
- [ ] File created at __tests__/integration/checkout.test.ts
- [ ] All 4 tests implemented
- [ ] Uses mockStripe for API mocking
- [ ] Validation tested
- [ ] Error handling verified

**Acceptance Criteria**:
- ✅ 4 integration tests pass
- ✅ Checkout validation verified
- ✅ API integration confirmed

---

## Phase 5: E2E Tests (2-3 days)

### Task 5.1: Create `__tests__/e2e/product-browsing.spec.ts`
**Effort**: 2 hours
**Files Created**: `__tests__/e2e/product-browsing.spec.ts`

**Tests to Implement** (5 tests):
1. [ ] should display product grid on products page
2. [ ] should filter products by category
3. [ ] should search for products
4. [ ] should navigate to product detail
5. [ ] should sort products by price

**Implementation Pattern**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Product Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display product grid on products page', async ({ page }) => {
    await page.goto('/products');
    const products = await page.locator('[data-testid="product-card"]').all();
    expect(products.length).toBeGreaterThan(0);
  });

  // ... 4 more tests
});
```

**Checklist**:
- [ ] File created at __tests__/e2e/product-browsing.spec.ts
- [ ] All 5 tests implemented
- [ ] Uses Playwright syntax
- [ ] Tests user-visible behavior
- [ ] Assertions verify expected results

**Acceptance Criteria**:
- ✅ 5 E2E tests pass
- ✅ Product browsing flow verified
- ✅ No flaky tests

---

### Task 5.2: Create `__tests__/e2e/shopping-cart.spec.ts`
**Effort**: 2 hours
**Files Created**: `__tests__/e2e/shopping-cart.spec.ts`

**Tests to Implement** (4 tests):
1. [ ] should add product to cart
2. [ ] should view cart items
3. [ ] should update quantity in cart
4. [ ] should remove item from cart

**Checklist**:
- [ ] File created at __tests__/e2e/shopping-cart.spec.ts
- [ ] All 4 tests implemented
- [ ] Cart operations verified
- [ ] UI updates tested

**Acceptance Criteria**:
- ✅ 4 E2E tests pass
- ✅ Shopping cart flow verified
- ✅ Quantity updates work
- ✅ Remove functionality works

---

### Task 5.3: Create `__tests__/e2e/checkout-flow.spec.ts`
**Effort**: 2 hours
**Files Created**: `__tests__/e2e/checkout-flow.spec.ts`

**Tests to Implement** (3 tests):
1. [ ] should display checkout button on cart page
2. [ ] should redirect to Stripe checkout
3. [ ] should display success page after payment

**Checklist**:
- [ ] File created at __tests__/e2e/checkout-flow.spec.ts
- [ ] All 3 tests implemented
- [ ] Checkout flow verified
- [ ] Success/cancel pages tested

**Acceptance Criteria**:
- ✅ 3 E2E tests pass
- ✅ Checkout button visible
- ✅ Stripe redirect works
- ✅ Success page displays

---

## Phase 6: CI/CD Setup (1 day)

### Task 6.1: Create `.github/workflows/test.yml`
**Effort**: 1 hour
**Files Created**: `.github/workflows/test.yml`

**Implementation**:
```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:run

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

**Checklist**:
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
- ✅ .github/workflows/test.yml exists
- ✅ Valid GitHub Actions YAML
- ✅ All test commands included
- ✅ Artifact uploads configured

---

### Task 6.2: Test GitHub Actions Locally
**Effort**: 30 minutes
**Local Testing**: Validate workflow

**Commands**:
```bash
npm run test:run        # Test unit tests locally
npm run test:coverage   # Test coverage locally
npm run test:e2e        # Test E2E locally
```

**Checklist**:
- [ ] Run `npm run test:run` - all tests pass
- [ ] Run `npm run test:coverage` - reports generate
- [ ] Run `npm run test:e2e` - E2E tests pass
- [ ] No local environment issues
- [ ] Ready for PR

**Acceptance Criteria**:
- ✅ All tests pass locally
- ✅ Coverage reports generated
- ✅ No environment issues
- ✅ Ready to push

---

## Summary

**Total Tasks**: 27 actionable items
**Total Effort**: 3-4 weeks
**Deliverables**:
- 1 Vitest configuration
- 1 Playwright configuration
- 5 Mock fixture files
- 2 Test utility files
- 5 Unit test files (22 tests)
- 2 Integration test files (9 tests)
- 3 E2E test files (12 tests)
- 1 GitHub Actions workflow

**Success Criteria**:
- ✅ 50%+ test coverage on critical paths
- ✅ 43+ tests total (22 unit, 9 integration, 12 E2E)
- ✅ All tests pass locally and in CI
- ✅ <30 seconds unit test execution
- ✅ <5 minutes E2E test execution
- ✅ GitHub Actions CI/CD configured

