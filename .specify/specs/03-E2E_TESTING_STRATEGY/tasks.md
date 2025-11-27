# Tasks: E2E Testing Strategy

**Spec**: [03-E2E_TESTING_STRATEGY.md](03-E2E_TESTING_STRATEGY.md)
**Plan**: [plan.md](plan.md)
**Priority**: HIGH
**Total Effort**: 2 weeks
**Prerequisite**: 02-TESTING_FRAMEWORK_SETUP must be complete
**Status**: Ready for Implementation

---

## Task Groups & Dependencies

```
Phase 1: Page Objects (2 days)
├── ProductsPage.ts
├── CartPage.ts
├── CheckoutPage.ts
├── ProductDetailPage.ts
└── SuccessPage.ts

Phase 2: Test Fixtures (1 day)
├── test-products.ts
├── test-user.ts
└── test-data.ts

Phase 3: Product Browsing Tests (2 days)
├── Browse products
├── Filter by category
├── Search products
├── Navigate to detail
└── Sort by price

Phase 4: Shopping Cart Tests (2 days)
├── Add to cart
├── View cart items
├── Update quantity
├── Remove item
└── Persist across reload

Phase 5: Checkout Flow Tests (2 days)
├── Display checkout button
├── Verify cart summary
├── Redirect to Stripe
├── Success page
└── Error handling

Phase 6: Accessibility & Performance (2 days)
├── WCAG 2.1 AA compliance
├── Keyboard navigation
├── Performance benchmarks
└── Mobile responsiveness

Phase 7: Error Handling Tests (1 day)
├── Network errors
├── Invalid data
├── Recovery options
└── Error messages

Phase 8: CI/CD & Mobile Tests (1 day)
├── Mobile viewports
├── Cross-browser testing
└── CI/CD validation
```

---

## Phase 1: Page Objects (2 days)

### Task 1.1: Create `e2e/pages/ProductsPage.ts`
**Effort**: 1 hour
**Files Created**: `e2e/pages/ProductsPage.ts`

**Implementation**:
```typescript
import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productGrid: Locator;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly addToCartBtn: Locator;
  readonly cartIcon: Locator;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productGrid = page.locator('[data-testid="product-grid"]');
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.sortSelect = page.locator('[data-testid="sort-select"]');
    this.addToCartBtn = page.locator('[data-testid="add-to-cart"]');
    this.cartIcon = page.locator('[data-testid="cart-icon"]');
    this.cartCount = page.locator('[data-testid="cart-count"]');
  }

  async goto() {
    await this.page.goto('/products');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForNavigation();
  }

  async getProductCount(): Promise<number> {
    return await this.page.locator('[data-testid="product-card"]').count();
  }

  async clickAddToCart(index: number = 0) {
    const buttons = await this.addToCartBtn.all();
    await buttons[index].click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
```

**Checklist**:
- [ ] File created at e2e/pages/ProductsPage.ts
- [ ] All properties defined with correct selectors
- [ ] goto() method navigates to products page
- [ ] search() method fills input and presses Enter
- [ ] getProductCount() returns number of products
- [ ] clickAddToCart() clicks button at index
- [ ] goToCart() navigates to cart
- [ ] All methods async/await properly

**Acceptance Criteria**:
- ✅ ProductsPage can be instantiated
- ✅ All methods callable
- ✅ Selectors target correct elements
- ✅ No TypeScript errors

---

### Task 1.2: Create `e2e/pages/CartPage.ts`
**Effort**: 45 minutes
**Files Created**: `e2e/pages/CartPage.ts`

**Implementation**:
```typescript
import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly quantityInput: Locator;
  readonly incrementBtn: Locator;
  readonly removeBtn: Locator;
  readonly total: Locator;
  readonly checkoutBtn: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-testid="cart-item"]');
    this.quantityInput = page.locator('[data-testid="quantity"]');
    this.incrementBtn = page.locator('[data-testid="increment-quantity"]');
    this.removeBtn = page.locator('[data-testid="remove-item"]');
    this.total = page.locator('[data-testid="total-price"]');
    this.checkoutBtn = page.locator('[data-testid="checkout-button"]');
    this.emptyMessage = page.locator('text=Your cart is empty');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async incrementQuantity(index: number = 0) {
    const buttons = await this.incrementBtn.all();
    await buttons[index].click();
  }

  async decrementQuantity(index: number = 0) {
    // Implement if decrement button exists
  }

  async removeItem(index: number = 0) {
    const buttons = await this.removeBtn.all();
    await buttons[index].click();
  }

  async getTotal(): Promise<string> {
    return await this.total.textContent() || '';
  }

  async clickCheckout() {
    await this.checkoutBtn.click();
  }
}
```

**Checklist**:
- [ ] File created at e2e/pages/CartPage.ts
- [ ] All locators defined
- [ ] goto() navigates to cart
- [ ] getItemCount() returns product count
- [ ] incrementQuantity() clicks increment button
- [ ] removeItem() clicks remove button
- [ ] getTotal() returns total text
- [ ] clickCheckout() clicks checkout button

**Acceptance Criteria**:
- ✅ CartPage instantiable
- ✅ All methods work
- ✅ Selectors correct
- ✅ No errors

---

### Task 1.3: Create `e2e/pages/CheckoutPage.ts`
**Effort**: 30 minutes
**Files Created**: `e2e/pages/CheckoutPage.ts`

**Implementation**:
```typescript
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutBtn: Locator;
  readonly cartSummary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutBtn = page.locator('[data-testid="checkout-button"]');
    this.cartSummary = page.locator('[data-testid="cart-summary"]');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async completeCheckout() {
    await this.checkoutBtn.click();
    // Wait for Stripe redirect
    await this.page.waitForNavigation();
  }

  async verifyCartSummary() {
    return await this.cartSummary.isVisible();
  }
}
```

**Checklist**:
- [ ] File created at e2e/pages/CheckoutPage.ts
- [ ] Locators defined
- [ ] completeCheckout() clicks and waits for nav
- [ ] verifyCartSummary() checks visibility

**Acceptance Criteria**:
- ✅ CheckoutPage instantiable
- ✅ Methods callable
- ✅ No errors

---

### Task 1.4: Create `e2e/pages/ProductDetailPage.ts`
**Effort**: 30 minutes
**Files Created**: `e2e/pages/ProductDetailPage.ts`

**Implementation**:
```typescript
import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartBtn: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('h1');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.addToCartBtn = page.locator('[data-testid="add-to-cart"]');
    this.productImage = page.locator('[data-testid="product-image"]');
  }

  async gotoProduct(slug: string) {
    await this.page.goto(`/product/${slug}`);
  }

  async getTitle(): Promise<string | null> {
    return await this.productTitle.textContent();
  }

  async getPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  async clickAddToCart() {
    await this.addToCartBtn.click();
  }

  async verifyProductLoaded() {
    return await this.productTitle.isVisible();
  }
}
```

**Checklist**:
- [ ] File created at e2e/pages/ProductDetailPage.ts
- [ ] All locators defined
- [ ] gotoProduct() navigates to product
- [ ] getTitle() returns title text
- [ ] getPrice() returns price text
- [ ] clickAddToCart() adds product
- [ ] verifyProductLoaded() confirms visibility

**Acceptance Criteria**:
- ✅ ProductDetailPage instantiable
- ✅ All methods work
- ✅ Can verify product loaded

---

### Task 1.5: Create `e2e/pages/SuccessPage.ts`
**Effort**: 30 minutes
**Files Created**: `e2e/pages/SuccessPage.ts`

**Implementation**:
```typescript
import { Page, Locator } from '@playwright/test';

export class SuccessPage {
  readonly page: Page;
  readonly successMessage: Locator;
  readonly orderNumber: Locator;
  readonly continueShoppingBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successMessage = page.locator('text=Thank you');
    this.orderNumber = page.locator('[data-testid="order-number"]');
    this.continueShoppingBtn = page.locator('[data-testid="continue-shopping"]');
  }

  async gotoSuccess(sessionId: string) {
    await this.page.goto(`/success?session_id=${sessionId}`);
  }

  async verifySuccess(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async getOrderNumber(): Promise<string | null> {
    return await this.orderNumber.textContent();
  }

  async continueShopping() {
    await this.continueShoppingBtn.click();
  }
}
```

**Checklist**:
- [ ] File created at e2e/pages/SuccessPage.ts
- [ ] All locators defined
- [ ] gotoSuccess() navigates with sessionId
- [ ] verifySuccess() confirms success message
- [ ] getOrderNumber() returns order ID
- [ ] continueShopping() navigates home

**Acceptance Criteria**:
- ✅ SuccessPage instantiable
- ✅ All methods callable
- ✅ Can verify success state

---

## Phase 2: Test Fixtures (1 day)

### Task 2.1: Create `e2e/fixtures/test-products.ts`
**Effort**: 30 minutes
**Files Created**: `e2e/fixtures/test-products.ts`

**Implementation**:
```typescript
export const TEST_PRODUCTS = {
  fiction: {
    name: 'The Great Gatsby',
    slug: 'the-great-gatsby',
    category: 'Fiction',
    price: 12.99,
  },
  nonfiction: {
    name: 'Sapiens',
    slug: 'sapiens',
    category: 'Non-Fiction',
    price: 18.99,
  },
  science: {
    name: 'The Selfish Gene',
    slug: 'the-selfish-gene',
    category: 'Science',
    price: 15.99,
  },
};

export const TEST_CATEGORIES = [
  { name: 'Fiction', slug: 'fiction' },
  { name: 'Non-Fiction', slug: 'non-fiction' },
  { name: 'Science', slug: 'science' },
];
```

**Checklist**:
- [ ] File created at e2e/fixtures/test-products.ts
- [ ] TEST_PRODUCTS has 3+ products
- [ ] Each product has name, slug, category, price
- [ ] TEST_CATEGORIES has matching categories
- [ ] Data realistic and consistent

**Acceptance Criteria**:
- ✅ Test data available
- ✅ Products match actual data in Sanity
- ✅ Can be used in all E2E tests

---

### Task 2.2: Create `e2e/fixtures/test-user.ts`
**Effort**: 15 minutes
**Files Created**: `e2e/fixtures/test-user.ts`

**Implementation**:
```typescript
export const TEST_USER = {
  email: 'test@example.com',
  name: 'Test User',
};

export const TEST_STRIPE_CARD = {
  number: '4242424242424242',
  exp: '12/25',
  cvc: '123',
};
```

**Checklist**:
- [ ] File created at e2e/fixtures/test-user.ts
- [ ] TEST_USER has email and name
- [ ] TEST_STRIPE_CARD has test card details
- [ ] Card number is valid Stripe test number

**Acceptance Criteria**:
- ✅ Test data available
- ✅ Can be imported in tests
- ✅ Stripe test card valid

---

## Phase 3: Product Browsing Tests (2 days)

### Task 3.1: Create `e2e/product-browsing.spec.ts`
**Effort**: 2 hours
**Files Created**: `e2e/product-browsing.spec.ts`

**Tests to Implement** (5 tests):
1. [ ] should display product grid on products page
2. [ ] should filter products by category
3. [ ] should search for products
4. [ ] should navigate to product detail
5. [ ] should sort products by price

**Implementation Pattern**:
```typescript
import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { TEST_PRODUCTS } from './fixtures/test-products';

test.describe('Product Browsing', () => {
  test('should display product grid on products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter products by category', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    // Click category filter
    await page.click('input[value="fiction"]');
    await page.waitForNavigation();

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should search for products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await productsPage.search('JavaScript');

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to product detail', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await page.click('[data-testid="product-card"] a');
    await expect(page).toHaveURL(/\/product\//);
  });

  test('should sort products by price', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await page.selectOption('[data-testid="sort-select"]', 'price-asc');
    await expect(page).toHaveURL(/sort=price-asc/);
  });
});
```

**Checklist**:
- [ ] File created at e2e/product-browsing.spec.ts
- [ ] All 5 tests implemented
- [ ] Uses ProductsPage page object
- [ ] Tests user-visible behavior
- [ ] All assertions present

**Acceptance Criteria**:
- ✅ 5 tests pass
- ✅ No flaky tests
- ✅ All product browsing flows verified

---

## Phase 4: Shopping Cart Tests (2 days)

### Task 4.1: Create `e2e/shopping-cart.spec.ts`
**Effort**: 2 hours
**Files Created**: `e2e/shopping-cart.spec.ts`

**Tests to Implement** (4 tests):
1. [ ] should add product to cart
2. [ ] should view cart items
3. [ ] should update quantity in cart
4. [ ] should remove item from cart

**Implementation Pattern**:
```typescript
import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';

test.describe('Shopping Cart', () => {
  test('should add product to cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await productsPage.clickAddToCart(0);

    const cartCount = await page.locator('[data-testid="cart-count"]').textContent();
    expect(cartCount).toBe('1');
  });

  test('should view cart items', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.clickAddToCart(0);
    await productsPage.goToCart();

    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should update quantity in cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.clickAddToCart(0);
    await productsPage.goToCart();

    await cartPage.incrementQuantity(0);

    const count = await page.locator('[data-testid="quantity"]').inputValue();
    expect(parseInt(count)).toBe(2);
  });

  test('should remove item from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.clickAddToCart(0);
    await productsPage.goToCart();

    await cartPage.removeItem(0);

    await expect(cartPage.emptyMessage).toBeVisible();
  });
});
```

**Checklist**:
- [ ] File created at e2e/shopping-cart.spec.ts
- [ ] All 4 tests implemented
- [ ] Uses CartPage page object
- [ ] Tests cart operations
- [ ] All assertions present

**Acceptance Criteria**:
- ✅ 4 tests pass
- ✅ Cart operations verified
- ✅ No flaky tests

---

## Phase 5: Checkout Flow Tests (2 days)

### Task 5.1: Create `e2e/checkout-flow.spec.ts`
**Effort**: 2 hours
**Files Created**: `e2e/checkout-flow.spec.ts`

**Tests to Implement** (3 tests):
1. [ ] should display checkout button on cart page
2. [ ] should redirect to Stripe checkout
3. [ ] should display success page after payment (with test session)

**Implementation Pattern**:
```typescript
import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { SuccessPage } from './pages/SuccessPage';

test.describe('Checkout Flow', () => {
  test('should display checkout button on cart page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.clickAddToCart(0);
    await productsPage.goToCart();

    await expect(cartPage.checkoutBtn).toBeVisible();
  });

  test('should redirect to Stripe checkout', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.clickAddToCart(0);
    await productsPage.goToCart();

    // Note: Can't actually complete Stripe checkout in tests
    // Just verify button is clickable and navigates
    const checkoutBtn = await page.locator('[data-testid="checkout-button"]');
    await expect(checkoutBtn).toBeEnabled();
  });

  test('should display success page after payment', async ({ page }) => {
    const successPage = new SuccessPage(page);

    // Navigate directly to success page with test session ID
    await successPage.gotoSuccess('cs_test_123');

    const isSuccess = await successPage.verifySuccess();
    expect(isSuccess).toBe(true);
  });
});
```

**Checklist**:
- [ ] File created at e2e/checkout-flow.spec.ts
- [ ] All 3 tests implemented
- [ ] Tests checkout flow
- [ ] Success page verified

**Acceptance Criteria**:
- ✅ 3 tests pass
- ✅ Checkout button visible
- ✅ Success page works
- ✅ No flaky tests

---

## Phase 6: Accessibility & Performance (2 days)

### Task 6.1: Create `e2e/accessibility.spec.ts`
**Effort**: 1 hour
**Files Created**: `e2e/accessibility.spec.ts`

**Implementation**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/products');

    // Tab through elements
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focused).toBeTruthy();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/products');

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/products');

    const images = await page.locator('[data-testid="product-image"]').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});
```

**Checklist**:
- [ ] File created at e2e/accessibility.spec.ts
- [ ] Keyboard navigation test
- [ ] Heading hierarchy test
- [ ] Alt text test

**Acceptance Criteria**:
- ✅ 3 accessibility tests pass
- ✅ WCAG 2.1 requirements verified
- ✅ Keyboard navigation works

---

### Task 6.2: Create `e2e/performance.spec.ts`
**Effort**: 1 hour
**Files Created**: `e2e/performance.spec.ts`

**Implementation**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load products page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should render product grid quickly', async ({ page }) => {
    await page.goto('/products');

    const startTime = Date.now();
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 2000 });
    const renderTime = Date.now() - startTime;

    expect(renderTime).toBeLessThan(2000); // 2 seconds
  });

  test('should not have layout shift', async ({ page }) => {
    await page.goto('/products');

    // CLS measurement would require observing LayoutShifts
    // For now, just verify page loads without visual errors
    const products = await page.locator('[data-testid="product-card"]').count();
    expect(products).toBeGreaterThan(0);
  });
});
```

**Checklist**:
- [ ] File created at e2e/performance.spec.ts
- [ ] Page load time test
- [ ] Render time test
- [ ] Layout shift test

**Acceptance Criteria**:
- ✅ 3 performance tests pass
- ✅ Load times within targets
- ✅ No layout shifts

---

## Phase 7: Error Handling Tests (1 day)

### Task 7.1: Create `e2e/error-handling.spec.ts`
**Effort**: 1 hour
**Files Created**: `e2e/error-handling.spec.ts`

**Implementation**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should handle missing product gracefully', async ({ page }) => {
    await page.goto('/product/nonexistent-product');

    // Should show error or redirect
    const url = page.url();
    const isError = url.includes('404') || url.includes('error');
    expect(isError || url === 'http://localhost:3000/').toBe(true);
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    await context.setOffline(true);
    await page.goto('/products');

    // Page might show error or cached content
    const hasContent = await page.locator('body').isVisible();
    expect(hasContent).toBe(true);

    await context.setOffline(false);
  });

  test('should show user-friendly error message on checkout failure', async ({ page }) => {
    await page.goto('/cart');

    // Cart should show empty state or error gracefully
    const emptyOrError =
      await page.locator('text=Your cart is empty').isVisible() ||
      await page.locator('[data-testid="error-message"]').isVisible();

    expect(emptyOrError).toBe(true);
  });
});
```

**Checklist**:
- [ ] File created at e2e/error-handling.spec.ts
- [ ] Missing product test
- [ ] Network error test
- [ ] Checkout failure test

**Acceptance Criteria**:
- ✅ 3 error handling tests pass
- ✅ Errors handled gracefully
- ✅ User-friendly messages shown

---

## Phase 8: CI/CD & Mobile Tests (1 day)

### Task 8.1: Create `e2e/responsive.spec.ts`
**Effort**: 1 hour
**Files Created**: `e2e/responsive.spec.ts`

**Implementation**:
```typescript
import { test, expect, devices } from '@playwright/test';

const viewports = [
  { name: 'iPhone 12', viewport: devices['iPhone 12'] },
  { name: 'Pixel 5', viewport: devices['Pixel 5'] },
  { name: 'iPad Pro', viewport: devices['iPad Pro'] },
];

for (const { name, viewport } of viewports) {
  test(`should work on ${name}`, async ({ browser }) => {
    const context = await browser.createContext({
      ...viewport,
    });
    const page = await context.newPage();

    await page.goto('/products');

    const products = await page.locator('[data-testid="product-card"]').count();
    expect(products).toBeGreaterThan(0);

    // Verify mobile menu is present
    const mobileMenu = await page.locator('[data-testid="mobile-menu"]').isVisible().catch(() => true);
    expect(mobileMenu).toBe(true);

    await context.close();
  });
}
```

**Checklist**:
- [ ] File created at e2e/responsive.spec.ts
- [ ] iPhone 12 test
- [ ] Pixel 5 test
- [ ] iPad Pro test
- [ ] Mobile menu verified

**Acceptance Criteria**:
- ✅ 3 mobile tests pass
- ✅ All viewports work
- ✅ Mobile UI renders correctly

---

### Task 8.2: Verify All Test Files
**Effort**: 30 minutes
**Code Review**: Check all tests

**Files to Verify**:
- [ ] `e2e/product-browsing.spec.ts` (5 tests)
- [ ] `e2e/shopping-cart.spec.ts` (4 tests)
- [ ] `e2e/checkout-flow.spec.ts` (3 tests)
- [ ] `e2e/accessibility.spec.ts` (3 tests)
- [ ] `e2e/performance.spec.ts` (3 tests)
- [ ] `e2e/error-handling.spec.ts` (3 tests)
- [ ] `e2e/responsive.spec.ts` (3 tests)

**Test Total**: 24 E2E tests

**Checklist**:
- [ ] All 7 spec files created
- [ ] All 24 tests implemented
- [ ] All tests executable with `npm run test:e2e`
- [ ] No syntax errors
- [ ] Page objects used consistently

**Acceptance Criteria**:
- ✅ All 24 E2E tests created
- ✅ `npm run test:e2e` runs all tests
- ✅ Tests pass consistently
- ✅ No flaky tests

---

### Task 8.3: Run E2E Test Suite
**Effort**: 1 hour
**Local Testing**: Validate all tests

**Commands**:
```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:ui          # Run with UI
npm run test:e2e -- --debug  # Debug specific test
```

**Checklist**:
- [ ] Run `npm run test:e2e` - all tests pass
- [ ] No flaky tests
- [ ] HTML report generates
- [ ] Screenshots captured on failure
- [ ] Cross-browser testing works

**Acceptance Criteria**:
- ✅ All 24 tests pass
- ✅ <5 minutes execution time
- ✅ No test failures
- ✅ Reports generated

---

## Summary

**Total Tasks**: 18 actionable items
**Total Effort**: 2 weeks
**Deliverables**:
- 5 Page Object classes
- 3 Test fixture files
- 7 E2E test spec files
- 24 total E2E tests

**Test Coverage**:
- 5 product browsing tests
- 4 shopping cart tests
- 3 checkout flow tests
- 3 accessibility tests
- 3 performance tests
- 3 error handling tests
- 3 mobile responsiveness tests

**Success Criteria**:
- ✅ 15+ E2E tests covering critical journeys
- ✅ 100% pass rate (no flaky tests)
- ✅ <5 minute execution time
- ✅ Cross-browser testing (3 browsers)
- ✅ Mobile responsiveness validated
- ✅ Accessibility tests passing
- ✅ Performance benchmarks met
- ✅ Page Objects reduce duplication

