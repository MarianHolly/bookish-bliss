# Testing Framework Setup Spec

**ID**: TEST-001
**Priority**: HIGH
**Estimated Effort**: 3-4 weeks (framework + initial tests)
**Success Criteria**: Full Vitest + Playwright setup, 20+ unit tests, 5+ integration tests, CI/CD configured

---

## Overview

Bookish Bliss currently has **zero test coverage** (0%). This spec establishes a complete testing framework following the project's TDD principles (Vitest + Playwright), creates infrastructure for test-driven development, and writes initial core tests.

**Aligned with Constitution v1.1.0**: VI. Test-Driven Development, VII. Testing Stack Standardization, VIII. Code Quality & Testability

---

## Goals

- **Primary**: Establish Vitest + Playwright infrastructure for TDD adoption
- **Secondary**: Write 20+ unit tests for critical business logic
- **Tertiary**: Write 5+ integration tests for cart/checkout flow
- **Quaternary**: Configure CI/CD for automated test execution

---

## Success Criteria

### Setup Checklist
- [ ] Vitest installed with Next.js support
- [ ] jsdom configured for DOM testing
- [ ] Playwright installed for E2E testing
- [ ] Test directory structure created (`__tests__/unit`, `__tests__/integration`, `__tests__/e2e`)
- [ ] npm run test, npm run test:e2e, npm run test:ci commands configured
- [ ] Coverage reports generated on every test run
- [ ] GitHub Actions CI/CD configured to run tests on PR
- [ ] Tests fail/pass correctly and block merge if failing

### Testing Checklist
- [ ] 20+ unit tests written for critical paths
- [ ] 5+ integration tests for cart/checkout
- [ ] 3+ E2E tests for critical user journeys
- [ ] 50%+ coverage on critical paths (cart, utils, Sanity)
- [ ] All tests pass locally and in CI/CD
- [ ] Mock strategies established (Stripe, Sanity, localStorage)

---

## Requirements

### 1. Vitest Setup

**Install Vitest**:
```bash
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8
npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
npm install --save-dev @testing-library/user-event
```

**Create `vitest.config.ts`**:
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

**Create `vitest.setup.ts`**:
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

**Add npm scripts to `package.json`**:
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

**Acceptance Criteria**:
- Vitest runs with `npm run test`
- Tests watch mode works
- Coverage reports generated
- All npm scripts execute successfully

---

### 2. Playwright Setup

**Install Playwright**:
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Create `playwright.config.ts`**:
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

**Acceptance Criteria**:
- Playwright runs with `npm run test:e2e`
- HTML reports generated
- All browsers tested (Chromium, Firefox, WebKit)
- Dev server starts automatically

---

### 3. Test Directory Structure

Create directory structure:
```
__tests__/
├── unit/
│   ├── context/
│   │   └── useCart.test.ts
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── env.test.ts
│   ├── hooks/
│   │   └── use-local-storage.test.ts
│   └── sanity/
│       └── queries.test.ts
├── integration/
│   ├── cart.test.ts
│   └── checkout.test.ts
├── e2e/
│   ├── product-browsing.spec.ts
│   ├── shopping-cart.spec.ts
│   └── checkout-flow.spec.ts
├── fixtures/
│   ├── mock-product.ts
│   ├── mock-cart.ts
│   └── mock-stripe.ts
└── utils/
    ├── test-helpers.ts
    └── test-setup.ts
```

---

### 4. Mock Strategies

#### Mock Sanity Client

**Create `__tests__/fixtures/mock-sanity.ts`**:
```typescript
export const mockSanityClient = {
  fetch: vi.fn(async (query: string, params?: any) => {
    // Return mock data based on query type
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

#### Mock Stripe API

**Create `__tests__/fixtures/mock-stripe.ts`**:
```typescript
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

#### Mock localStorage

**Create `__tests__/fixtures/mock-storage.ts`**:
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

---

### 5. Unit Tests - Cart Management

**Create `__tests__/unit/context/useCart.test.ts`**:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context';
import { mockProducts } from '@/__tests__/fixtures/mock-product';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });
    expect(result.current.cart).toEqual([]);
  });

  it('should add product to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toEqual({
      ...mockProducts[0],
      quantity: 1,
    });
  });

  it('should increment quantity if product already in cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]);
      result.current.addToCart(mockProducts[0]);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]);
      result.current.removeFromCart(mockProducts[0]._id);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it('should increment product quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]);
      result.current.incrementQuantity(mockProducts[0]._id);
    });

    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should decrement product quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart({ ...mockProducts[0], quantity: 3 });
      result.current.decrementQuantity(mockProducts[0]._id);
    });

    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should remove product when quantity reaches 0', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]);
      result.current.decrementQuantity(mockProducts[0]._id);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it('should reset cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]);
      result.current.addToCart(mockProducts[1]);
      result.current.resetCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });
});
```

---

### 6. Unit Tests - Utilities

**Create `__tests__/unit/lib/utils.test.ts`**:
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

  it('should handle undefined values', () => {
    const result = cn('px-2', undefined, 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('should handle empty strings', () => {
    const result = cn('px-2', '', 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('px-2', isActive && 'bg-blue-500');
    expect(result).toContain('bg-blue-500');
  });
});
```

---

### 7. Integration Tests - Cart Operations

**Create `__tests__/integration/cart.test.ts`**:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '@/context';
import { mockProducts } from '@/__tests__/fixtures/mock-product';

describe('Cart Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
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
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });
  });

  it('should restore cart from localStorage on mount', async () => {
    // First render: add to cart
    const { unmount: unmount1 } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    // Second render: verify cart restored
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.cart).toHaveLength(1);
    });
  });

  it('should handle multiple product additions', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      mockProducts.forEach((product) => {
        result.current.addToCart(product);
      });
    });

    expect(result.current.cart).toHaveLength(mockProducts.length);
  });

  it('should calculate cart total correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProducts[0]); // 19.99
      result.current.addToCart(mockProducts[1]); // 24.99
    });

    const total = result.current.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    expect(total).toBeCloseTo(44.98, 2);
  });
});
```

---

### 8. E2E Tests - Product Browsing

**Create `__tests__/e2e/product-browsing.spec.ts`**:
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

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');

    // Click category filter
    await page.click('input[value="fiction"]');

    // Verify URL updated
    await expect(page).toHaveURL(/category=fiction/);

    // Verify filtered products shown
    const products = await page.locator('[data-testid="product-card"]').all();
    expect(products.length).toBeGreaterThan(0);
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/products');

    // Type in search
    await page.fill('input[placeholder*="Search"]', 'JavaScript');

    // Verify results updated
    await page.waitForNavigation();
    const results = await page.locator('[data-testid="product-card"]').all();
    expect(results.length).toBeGreaterThan(0);
  });

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products');

    // Click first product
    await page.click('[data-testid="product-card"] a');

    // Verify on product page
    await expect(page).toHaveURL(/\/product\//);

    // Verify product details shown
    await expect(page.locator('h1')).toBeTruthy();
  });

  test('should sort products by price', async ({ page }) => {
    await page.goto('/products');

    // Select sort option
    await page.selectOption('[data-testid="sort-select"]', 'price-asc');

    // Verify sorted
    await expect(page).toHaveURL(/sort=price-asc/);
  });
});
```

---

### 9. E2E Tests - Shopping Cart

**Create `__tests__/e2e/shopping-cart.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');

    // Click add to cart button
    await page.click('[data-testid="add-to-cart"]');

    // Verify cart icon updated
    const cartCount = await page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('1');
  });

  test('should view cart items', async ({ page }) => {
    await page.goto('/products');

    // Add product
    await page.click('[data-testid="add-to-cart"]');

    // Navigate to cart
    await page.click('[data-testid="cart-icon"]');

    // Verify on cart page
    await expect(page).toHaveURL('/cart');

    // Verify product shown
    const items = await page.locator('[data-testid="cart-item"]').all();
    expect(items.length).toBeGreaterThan(0);
  });

  test('should update quantity in cart', async ({ page }) => {
    await page.goto('/cart');

    // Add to cart from products first
    await page.goto('/products');
    await page.click('[data-testid="add-to-cart"]');

    // Go to cart
    await page.goto('/cart');

    // Increase quantity
    await page.click('[data-testid="increment-quantity"]');

    // Verify quantity updated
    const quantity = await page
      .locator('[data-testid="quantity"]')
      .inputValue();
    expect(quantity).toBe('2');
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="add-to-cart"]');
    await page.goto('/cart');

    // Remove item
    await page.click('[data-testid="remove-item"]');

    // Verify empty cart message
    await expect(
      page.locator('text=Your cart is empty')
    ).toBeVisible();
  });
});
```

---

### 10. E2E Tests - Checkout Flow

**Create `__tests__/e2e/checkout-flow.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.click('[data-testid="add-to-cart"]');
  });

  test('should display checkout button on cart page', async ({ page }) => {
    await page.goto('/cart');

    const checkoutBtn = await page.locator(
      '[data-testid="checkout-button"]'
    );
    await expect(checkoutBtn).toBeVisible();
  });

  test('should redirect to Stripe checkout', async ({ page }) => {
    await page.goto('/cart');

    // Click checkout
    await page.click('[data-testid="checkout-button"]');

    // Verify redirected to Stripe
    await expect(page).toHaveURL(/stripe\.com|checkout\.stripe\.com/);
  });

  test('should display success page after payment', async ({ page }) => {
    // Mock successful Stripe redirect
    await page.goto('/success?session_id=cs_test_123');

    // Verify success message
    await expect(page.locator('text=Thank you')).toBeVisible();

    // Verify order details
    const orderNumber = await page.locator(
      '[data-testid="order-number"]'
    );
    await expect(orderNumber).toBeVisible();
  });

  test('should display cancel page on cancellation', async ({ page }) => {
    await page.goto('/cancel');

    // Verify cancel message
    await expect(page.locator('text=Payment cancelled')).toBeVisible();

    // Verify continue shopping button
    const continueBtn = await page.locator(
      '[data-testid="continue-shopping"]'
    );
    await expect(continueBtn).toBeVisible();
  });
});
```

---

## Implementation Steps

### Phase 1: Setup (1 day)
- [ ] Install Vitest and dependencies
- [ ] Create vitest.config.ts
- [ ] Install Playwright
- [ ] Create playwright.config.ts
- [ ] Create __tests__ directory structure
- [ ] Update package.json scripts

### Phase 2: Mocks & Utilities (1 day)
- [ ] Create mock fixtures (Sanity, Stripe, localStorage)
- [ ] Create test utilities
- [ ] Setup test environment

### Phase 3: Unit Tests (3-4 days)
- [ ] Cart hook tests (8 tests)
- [ ] Utility function tests (5 tests)
- [ ] Sanity query tests (5 tests)
- [ ] localStorage hook tests (4 tests)
- [ ] Environment variable tests (2 tests)

### Phase 4: Integration Tests (2-3 days)
- [ ] Cart operations (5 tests)
- [ ] Checkout flow (4 tests)
- [ ] Data fetching (3 tests)

### Phase 5: E2E Tests (2-3 days)
- [ ] Product browsing (5 tests)
- [ ] Shopping cart (4 tests)
- [ ] Checkout flow (3 tests)

### Phase 6: CI/CD Setup (1 day)
- [ ] Create GitHub Actions workflow
- [ ] Configure test reporting
- [ ] Set up coverage reports

---

## CI/CD Configuration

**Create `.github/workflows/test.yml`**:
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

---

## Success Metrics

- ✅ 50%+ test coverage on critical paths
- ✅ All npm run test commands pass
- ✅ CI/CD pipeline configured
- ✅ 20+ unit tests written
- ✅ 5+ integration tests written
- ✅ 3+ E2E tests written
- ✅ Tests run in <30 seconds (unit), <5 minutes (E2E)

---

## Dependencies

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

---

## Notes

- Test files should follow naming convention: `*.test.ts` or `*.spec.ts`
- Update tests when functionality changes (tests are living documentation)
- Aim for 80%+ coverage on cart, checkout, and Sanity fetching logic
- E2E tests should test complete user journeys, not implementation details
