# Implementation Plan: E2E Testing Strategy

**Spec**: [03-E2E_TESTING_STRATEGY.md](03-E2E_TESTING_STRATEGY.md)
**Priority**: HIGH
**Effort**: 2 weeks (after Testing Framework Setup)
**Status**: Planning Phase
**Dependency**: TEST-001 (Testing Framework Setup) must be complete

---

## Constitution Alignment

### Principle VII: Testing Stack Standardization
- ✅ E2E Tests with Playwright — all critical user journeys must have Playwright tests
- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Test performance gates: <5 minutes total execution

### Principle VIII: Code Quality & Testability
- ✅ Tests validate behavior (not implementation details)
- ✅ Test utilities and fixtures organized
- ✅ E2E tests test complete user flows, not single components

---

## Phase 0: Research & Unknowns

### E2E Testing Best Practices
- **Page Object Model**: Abstract selectors and interactions into reusable classes
- **Test Data Management**: Use fixtures and Sanity test products
- **Cross-Browser Testing**: Playwright handles Chrome, Firefox, Safari
- **Performance Monitoring**: Capture load times and rendering metrics
- **Accessibility Testing**: axe-playwright for WCAG compliance

### Key Decisions
1. **Page Objects**: Create for Products, Cart, Checkout pages
2. **Test Data**: Seed Sanity with test products
3. **Browsers**: Chromium primary, Firefox and WebKit in CI (optional)
4. **Accessibility**: Include axe checks on critical pages
5. **Performance**: Track LCP and render times

---

## Phase 1: Design & Architecture

### 1.1 Page Object Model Structure

```
e2e/
├── pages/
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── ProductDetailPage.ts
│   └── SuccessPage.ts
├── fixtures/
│   ├── test-products.ts
│   ├── test-user.ts
│   └── test-data.ts
└── specs/
    ├── product-browsing.spec.ts
    ├── shopping-cart.spec.ts
    ├── checkout-flow.spec.ts
    ├── accessibility.spec.ts
    ├── performance.spec.ts
    └── error-handling.spec.ts
```

### 1.2 Page Objects

#### `ProductsPage`
```
Methods:
- goto()
- search(query: string)
- filterByCategory(category: string)
- sort(option: string)
- getProductCount(): Promise<number>
- clickAddToCart(index: number)
- goToCart()
- getCartCount(): Promise<number>

Selectors:
- productGrid: '[data-testid="product-grid"]'
- searchInput: 'input[placeholder*="Search"]'
- filterCheckbox: 'input[value="{category}"]'
- addToCartBtn: '[data-testid="add-to-cart"]'
```

#### `CartPage`
```
Methods:
- goto()
- getItemCount(): Promise<number>
- incrementQuantity(index: number)
- decrementQuantity(index: number)
- removeItem(index: number)
- getTotal(): Promise<string>
- clickCheckout()

Selectors:
- cartItems: '[data-testid="cart-item"]'
- quantityInput: '[data-testid="quantity"]'
- incrementBtn: '[data-testid="increment-quantity"]'
- removeBtn: '[data-testid="remove-item"]'
- total: '[data-testid="total-price"]'
```

#### `CheckoutPage`
```
Methods:
- goto()
- completeCheckout()
- fillPaymentInfo(cardData)
- verifySuccessPage()

Selectors:
- checkoutBtn: '[data-testid="checkout-button"]'
- confirmMessage: 'text=Thank you'
```

### 1.3 Test Scenarios Structure

```
Product Browsing Journey:
├── Browse → Display grid
├── Filter → Verify results
├── Search → Verify results
├── Navigate → Product detail
└── Sort → Verify ordering

Shopping Cart Journey:
├── Add → Cart updates
├── View → Items displayed
├── Update Qty → Total recalculates
├── Remove → Item gone
└── Persist → Survives reload

Checkout Journey:
├── Initiate → Redirect to Stripe
├── Verify Data → Products match
├── Complete → Success page
├── Track → Order number shown
└── Error → Graceful handling

Accessibility:
├── WCAG 2.1 AA compliance
├── Keyboard navigation
├── Screen reader support
└── Color contrast

Performance:
├── Product load time <3s
├── Grid render time <2s
├── Search responsiveness
└── Checkout latency
```

---

## Phase 2: Implementation Tasks

### Task Group 1: Page Object Model (2 days)
1. [ ] Create `e2e/pages/ProductsPage.ts` with all methods
2. [ ] Create `e2e/pages/CartPage.ts` with all methods
3. [ ] Create `e2e/pages/CheckoutPage.ts` with all methods
4. [ ] Create `e2e/pages/ProductDetailPage.ts`
5. [ ] Create `e2e/pages/SuccessPage.ts`
6. [ ] Define stable selectors (data-testid attributes)

### Task Group 2: Test Data & Fixtures (1 day)
1. [ ] Create `e2e/fixtures/test-products.ts` with test product data
2. [ ] Create `e2e/fixtures/test-user.ts` with test user data
3. [ ] Seed Sanity with test products (if needed)
4. [ ] Document test data setup

### Task Group 3: Product Browsing Tests (2 days)
1. [ ] Create `e2e/product-browsing.spec.ts`
   - Display product grid
   - Filter by category
   - Search products
   - Navigate to product detail
   - Sort by price
   - Verify responsive layout

### Task Group 4: Shopping Cart Tests (2 days)
1. [ ] Create `e2e/shopping-cart.spec.ts`
   - Add product to cart
   - View cart items
   - Increment quantity
   - Decrement quantity
   - Remove item
   - Verify persistence across reload

### Task Group 5: Checkout Flow Tests (2 days)
1. [ ] Create `e2e/checkout-flow.spec.ts`
   - Display checkout button
   - Verify cart summary
   - Redirect to Stripe
   - Verify success page
   - Verify cancel page
   - Error recovery

### Task Group 6: Accessibility Tests (1 day)
1. [ ] Install axe-playwright: `npm install --save-dev @axe-core/playwright axe-playwright`
2. [ ] Create `e2e/accessibility.spec.ts`
   - WCAG 2.1 AA compliance check
   - Keyboard navigation test
   - Tab order verification
   - Focus indicators

### Task Group 7: Performance Tests (1 day)
1. [ ] Create `e2e/performance.spec.ts`
   - Page load time <3s
   - Product grid render <2s
   - Search responsiveness
   - No layout shifts (CLS)

### Task Group 8: Error Handling Tests (1 day)
1. [ ] Create `e2e/error-handling.spec.ts`
   - Network error handling
   - Invalid product data
   - Checkout failure recovery
   - User-friendly error messages

### Task Group 9: CI/CD Integration (1 day)
1. [ ] Update `.github/workflows/test.yml` with E2E steps
2. [ ] Configure Playwright in CI environment
3. [ ] Setup artifact uploads for test reports
4. [ ] Test locally with CI environment simulation

### Task Group 10: Mobile Responsiveness (1 day)
1. [ ] Add mobile viewport tests to `e2e/responsive.spec.ts`
   - iPhone 12 (390x844)
   - Pixel 5 (393x851)
   - iPad Pro (1024x1366)
2. [ ] Verify mobile menu functionality
3. [ ] Verify touch interactions

---

## Phase 3: Validation & QA

### Test Coverage Goals
- **Critical Journeys**: 15+ tests covering end-to-end flows
- **Accessibility**: 3+ tests for WCAG compliance
- **Performance**: 3+ tests for load time targets
- **Error Handling**: 4+ tests for error scenarios
- **Mobile**: 3+ tests for responsive design

### Quality Checklist
- [ ] All tests pass consistently (no flakiness)
- [ ] Tests run in <5 minutes total
- [ ] Tests use Page Object Model (DRY principle)
- [ ] Meaningful assertion messages
- [ ] Screenshots captured on failure
- [ ] Accessibility tests passing
- [ ] Performance benchmarks met
- [ ] Cross-browser testing working

### Performance Gates
- ✅ Products page loads in <3 seconds
- ✅ Product grid renders in <2 seconds
- ✅ Search results appear instantly
- ✅ Checkout initiates within 1 second
- ✅ No layout shifts during interaction

---

## Dependencies & Installation

### npm Packages
```bash
npm install --save-dev @axe-core/playwright axe-playwright
```

### Environment Setup
- Sanity project with test products
- Stripe test mode enabled
- Playwright browsers installed (`npx playwright install`)

### Configuration
- `playwright.config.ts` with multi-browser setup
- Test data fixtures in `e2e/fixtures/`
- Stable selectors (data-testid attributes) on UI components

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Flaky E2E tests (timing) | Use explicit waits, avoid hard sleeps |
| Selector brittleness | Use data-testid attributes, avoid CSS selectors |
| Test data conflicts | Use unique IDs, cleanup after tests |
| Stripe test integration | Mock Stripe for most tests, use test keys in CI |
| Slow test execution | Run in parallel, optimize selector queries |

---

## Success Criteria Verification

- ✅ 15+ E2E tests passing
- ✅ 100% pass rate (no flaky tests)
- ✅ <5 minute execution time
- ✅ Cross-browser testing (3 browsers)
- ✅ Mobile responsiveness validated
- ✅ Accessibility tests passing
- ✅ Performance benchmarks met
- ✅ CI/CD pipeline passing

---

## Rollout Plan

1. **Week 1**: Page Objects, product browsing tests, cart tests
2. **Week 2**: Checkout tests, error handling, mobile/accessibility tests
3. **Ongoing**: Maintenance and new test additions

---

## Notes

- Tests follow user journey logic (e.g., browse → add → checkout)
- Page Objects abstract implementation details
- Avoid testing implementation details; focus on user-visible behavior
- Test data should be realistic (real product names, prices)
- Screenshot/video artifacts help with debugging failures
- Consider performance monitoring as part of test suite

