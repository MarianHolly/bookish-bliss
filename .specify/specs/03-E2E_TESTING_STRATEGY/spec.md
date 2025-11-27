# E2E Testing Strategy Spec

**ID**: TEST-002
**Priority**: HIGH
**Estimated Effort**: 2 weeks (after Testing Framework Setup complete)
**Success Criteria**: Comprehensive E2E test suite covering all critical user journeys, 100% pass rate

---

## Overview

This spec builds on the Testing Framework Setup (TEST-001) to create a comprehensive end-to-end testing strategy for Bookish Bliss. It defines critical user journeys, test scenarios, and implementation details for Playwright-based E2E tests.

**Aligned with Constitution v1.1.0**: VII. Testing Stack Standardization (Playwright), VIII. Code Quality & Testability

---

## Goals

- **Primary**: Comprehensive E2E test coverage of all critical user journeys
- **Secondary**: Fast, reliable, maintainable test suite (<5 min execution)
- **Tertiary**: Playwright best practices and test data management
- **Quaternary**: CI/CD integration with automatic test execution

---

## Success Criteria

### Coverage Checklist
- [ ] Product browsing journey (search, filter, sort, detail view)
- [ ] Shopping cart operations (add, remove, quantity, persistence)
- [ ] Checkout flow (cart → Stripe → success/cancel)
- [ ] Category browsing (category listing, category-specific products)
- [ ] Mobile responsiveness testing (3 screen sizes)
- [ ] Error handling (network failures, invalid input)
- [ ] Performance testing (page load times)

### Quality Checklist
- [ ] All tests pass consistently (no flakiness)
- [ ] Tests run in <5 minutes total
- [ ] Tests are maintainable (DRY, clear naming)
- [ ] Test data managed properly (fixtures, test database)
- [ ] Screenshots/videos captured on failure
- [ ] Accessibility tests included
- [ ] Cross-browser testing (Chrome, Firefox, WebKit)

---

## Critical User Journeys

### Journey 1: Product Discovery → Purchase

**User Steps**:
1. Browse product listings (/products)
2. Filter by category or search
3. View product details
4. Add to cart
5. Proceed to checkout
6. Complete payment (Stripe)
7. Verify order confirmation

**Key Assertions**:
- Product grid displays correctly
- Filter/search updates results
- Product details page loads
- Cart updates in real-time
- Stripe checkout initiated
- Success page shows order details

---

### Journey 2: Cart Management

**User Steps**:
1. Add multiple products to cart
2. View shopping cart (/cart)
3. Update quantities
4. Remove items
5. Verify totals (price, shipping)
6. Persist across page reloads

**Key Assertions**:
- Cart icon shows correct count
- Cart items display accurately
- Quantity changes update totals
- Remove buttons work
- Cart persists in localStorage

---

### Journey 3: Checkout Flow

**User Steps**:
1. Click checkout from cart
2. Redirect to Stripe Checkout
3. Complete payment (test card: 4242...)
4. Redirect to success page
5. Verify order details

**Key Assertions**:
- Checkout button visible
- Redirect to Stripe works
- Order number displayed
- Confirmation email sent (verify)

---

### Journey 4: Category Browsing

**User Steps**:
1. Browse categories (homepage links)
2. Navigate to category page (/category/[slug])
3. View category-specific products
4. Apply additional filters
5. Return to homepage

**Key Assertions**:
- Category page loads
- Products filtered by category
- Category name in title
- Breadcrumb navigation works

---

### Journey 5: Error Scenarios

**User Steps**:
1. Add product with network failure
2. Attempt checkout with invalid data
3. Network timeout during Stripe call
4. Invalid product ID in URL

**Key Assertions**:
- Error message displayed to user
- Recovery options offered
- No data corruption
- Error logged appropriately

---

## Test Scenarios

### Scenario 1: Browse Products Page

```typescript
test('User can browse and interact with products', async ({ page }) => {
  await page.goto('/products');

  // Verify page loaded
  await expect(page.locator('h1')).toContainText('All Books');

  // Verify product grid
  const products = await page.locator('[data-testid="product-card"]').count();
  expect(products).toBeGreaterThan(0);

  // Verify search works
  await page.fill('input[placeholder*="Search"]', 'JavaScript');
  await page.keyboard.press('Enter');

  // Verify results updated
  const filteredProducts = await page.locator('[data-testid="product-card"]').count();
  expect(filteredProducts).toBeGreaterThan(0);

  // Click product to view details
  await page.click('[data-testid="product-card"] a:first-child');
  await expect(page).toHaveURL(/\/product\//);
});
```

### Scenario 2: Add to Cart & Checkout

```typescript
test('User can add items to cart and checkout', async ({ page }) => {
  // Navigate to products
  await page.goto('/products');

  // Add product to cart
  await page.click('[data-testid="add-to-cart"]:first-child');

  // Verify cart updated
  const cartCount = await page.locator('[data-testid="cart-count"]');
  await expect(cartCount).toContainText('1');

  // Go to cart
  await page.goto('/cart');

  // Verify item in cart
  const cartItem = await page.locator('[data-testid="cart-item"]');
  await expect(cartItem).toBeVisible();

  // Verify total calculated
  const total = await page.locator('[data-testid="total-price"]');
  await expect(total).toBeVisible();

  // Click checkout
  const checkoutBtn = await page.locator('[data-testid="checkout-button"]');
  await expect(checkoutBtn).toBeEnabled();

  // Note: Full Stripe checkout requires separate test with Stripe test mode
});
```

### Scenario 3: Filter by Category

```typescript
test('User can filter products by category', async ({ page }) => {
  await page.goto('/products');

  // Click category filter
  const fictionCheckbox = await page.locator('input[value="fiction"]');
  await fictionCheckbox.check();

  // Verify URL updated
  await expect(page).toHaveURL(/category=fiction/);

  // Verify products filtered
  const products = await page.locator('[data-testid="product-card"]').all();
  expect(products.length).toBeGreaterThan(0);

  // Verify all products are fiction
  // (Would need data-testid on category name in each product)
  for (const product of products) {
    const category = await product.locator('[data-testid="category"]').textContent();
    expect(category).toContain('Fiction');
  }
});
```

### Scenario 4: Sort Products

```typescript
test('User can sort products by price', async ({ page }) => {
  await page.goto('/products');

  // Get initial prices
  const initialPrices = await page.locator('[data-testid="product-price"]').allTextContents();

  // Sort by price ascending
  await page.selectOption('[data-testid="sort-select"]', 'price-asc');

  // Verify URL updated
  await expect(page).toHaveURL(/sort=price-asc/);

  // Get sorted prices
  const sortedPrices = await page.locator('[data-testid="product-price"]').allTextContents();

  // Verify prices are ascending
  const numericPrices = sortedPrices.map(p => parseFloat(p.replace('€', '')));
  for (let i = 1; i < numericPrices.length; i++) {
    expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
  }
});
```

### Scenario 5: Checkout with Stripe Test Mode

```typescript
test('User can complete checkout with test card', async ({ page }) => {
  // Add to cart
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]:first-child');

  // Go to checkout
  await page.goto('/cart');
  await page.click('[data-testid="checkout-button"]');

  // Wait for Stripe redirect
  const newPage = await context.waitForEvent('page');
  await newPage.waitForLoadState();

  // Fill in test payment info
  // Note: This depends on Stripe's test checkout experience
  // May need to handle dynamic Stripe forms

  // Complete payment
  // Verify success page
  await expect(newPage).toHaveURL(/\/success/);
  await expect(newPage.locator('text=Thank you')).toBeVisible();
});
```

---

## Test Implementation Details

### 1. Page Object Model (Reduce Duplication)

**Create `e2e/pages/ProductsPage.ts`**:
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

**Use in tests**:
```typescript
test('User can search products', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.goto();

  await productsPage.search('JavaScript');

  const count = await productsPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});
```

---

### 2. Test Data & Fixtures

**Create `e2e/fixtures/test-products.ts`**:
```typescript
export const TEST_PRODUCTS = {
  fiction: {
    name: 'The Great Gatsby',
    category: 'Fiction',
    price: 12.99,
  },
  nonfiction: {
    name: 'Sapiens',
    category: 'Non-Fiction',
    price: 18.99,
  },
};

export const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
};
```

---

### 3. Accessibility Testing

**Create `e2e/accessibility.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('Products page meets accessibility standards', async ({ page }) => {
  await page.goto('/products');
  await injectAxe(page);

  await checkA11y(page);
});

test('Cart page is navigable with keyboard', async ({ page }) => {
  await page.goto('/cart');

  // Tab through elements
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="increment-quantity"]')).toBeFocused();

  // Enter to activate button
  await page.keyboard.press('Enter');

  // Verify action completed
  const quantity = await page.locator('[data-testid="quantity"]').inputValue();
  expect(parseInt(quantity)).toBeGreaterThan(1);
});
```

---

### 4. Performance Testing

**Create `e2e/performance.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';

test('Products page loads within acceptable time', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/products');
  await page.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // 3 seconds
});

test('Product grid renders within acceptable time', async ({ page }) => {
  await page.goto('/products');

  const startTime = Date.now();
  await page.waitForSelector('[data-testid="product-card"]', { timeout: 2000 });
  const renderTime = Date.now() - startTime;

  expect(renderTime).toBeLessThan(2000); // 2 seconds
});
```

---

### 5. Mobile Responsiveness Testing

**Create `e2e/mobile.spec.ts`**:
```typescript
import { test, expect, devices } from '@playwright/test';

const mobileViewports = [
  { name: 'iPhone 12', viewport: devices['iPhone 12'] },
  { name: 'Pixel 5', viewport: devices['Pixel 5'] },
  { name: 'iPad Pro', viewport: devices['iPad Pro'] },
];

for (const { name, viewport } of mobileViewports) {
  test(`Products page works on ${name}`, async ({ browser }) => {
    const context = await browser.createContext({
      ...viewport,
    });
    const page = await context.newPage();

    await page.goto('/products');

    // Verify mobile menu visible
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // Verify products stack vertically
    const products = await page.locator('[data-testid="product-card"]').all();
    expect(products.length).toBeGreaterThan(0);

    await context.close();
  });
}
```

---

### 6. Error Handling & Recovery

**Create `e2e/error-handling.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';

test('User sees error message on network failure', async ({ page }) => {
  // Simulate network error
  await page.context().setOffline(true);

  await page.goto('/products');

  // Attempt to add to cart
  await page.click('[data-testid="add-to-cart"]');

  // Verify error shown
  const error = await page.locator('[data-testid="error-message"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('offline');

  // Restore network
  await page.context().setOffline(false);

  // Verify recovery option
  const retryBtn = await page.locator('[data-testid="retry-button"]');
  await expect(retryBtn).toBeVisible();
});

test('User sees validation error on invalid product data', async ({ page }) => {
  await page.goto('/products');

  // Manually trigger invalid cart data
  await page.evaluate(() => {
    localStorage.setItem('cart', JSON.stringify([{ price: -100 }]));
  });

  // Refresh page
  await page.reload();

  // Verify warning shown
  const warning = await page.locator('[data-testid="warning-message"]');
  await expect(warning).toBeVisible();
});
```

---

## Test Execution & CI/CD

### Running Tests Locally

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- product-browsing.spec.ts

# Run in UI mode (debugging)
npm run test:e2e:ui

# Run with headed browser (see what happens)
npm run test:e2e -- --headed

# Debug specific test
npm run test:e2e -- --debug product-browsing.spec.ts
```

### CI/CD Integration

**Update `.github/workflows/test.yml`**:
```yaml
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
    retention-days: 30
```

---

## Test Data Requirements

### Sanity Test Data
- At least 10 test products across categories
- Various price points
- Complete product information (name, author, ISBN, description)

### Stripe Test Mode
- Test publishable key configured
- Test secret key configured
- Test products synced with Sanity

---

## Browser Coverage

**Default Configuration**:
- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

**CI/CD**:
- ✅ Chromium (primary)
- ⚠️ Firefox & WebKit (if time allows)

---

## Failure & Debugging

### On Test Failure
1. **Screenshots**: Automatically captured in `test-results/`
2. **Videos**: Recorded in `test-results/`
3. **Trace**: Available in `playwright/trace.zip` for debugging

### Viewing Results
```bash
# Open HTML report
npx playwright show-report
```

---

## Success Metrics

- ✅ 15+ E2E tests covering critical journeys
- ✅ 100% pass rate (no flaky tests)
- ✅ <5 minute execution time total
- ✅ Cross-browser testing (3 browsers)
- ✅ Mobile responsiveness validated
- ✅ Accessibility tests passing
- ✅ Performance benchmarks met

---

## Timeline

- **Week 1**: Page objects, product browsing tests, cart tests
- **Week 2**: Checkout tests, error handling, mobile/accessibility tests
- **Ongoing**: Maintenance and new test additions

---

## Notes

- Tests use `.only` during development, remove before committing
- Use `test.skip` for tests that aren't ready yet
- Consider using test parallelization for speed (shard across workers)
- Monitor test duration; refactor if tests exceed 5 minutes
