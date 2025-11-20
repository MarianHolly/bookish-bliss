# Implementation Plan: Code Quality Refactoring

**Spec**: [04-CODE_QUALITY_REFACTORING.md](04-CODE_QUALITY_REFACTORING.md)
**Priority**: HIGH
**Effort**: 2 weeks
**Status**: Planning Phase

---

## Constitution Alignment

### Principle VIII: Code Quality & Testability
- ✅ Components exported as default and named exports
- ✅ Business logic separated from React components
- ✅ API routes with isolated, testable logic
- ✅ No tight coupling to external services
- ✅ Avoid side effects in render paths
- ✅ Clear separation of concerns

### Principle II: Type Safety & Schema Consistency
- ✅ TypeScript interfaces mirror Sanity schemas
- ✅ Zero `any` types in codebase
- ✅ Stripe response types defined
- ✅ GROQ query result types defined

---

## Phase 0: Research & Unknowns

### Code Organization Patterns
- **Separation of Concerns**: Queries, fetching, rendering in separate modules
- **Custom Hooks**: Extract stateful logic from components
- **Utility Functions**: Pure functions for business logic
- **Type Definitions**: Centralized in `lib/interface.ts`

### Key Assumptions
- Refactoring will be incremental (test after each change)
- No breaking changes to public APIs
- All existing tests will continue to pass

---

## Phase 1: Design & Architecture

### 1.1 New Files to Create

#### `lib/queries.ts` - GROQ Query Builders
```typescript
Purpose: Centralized GROQ query definitions
Exports:
- productQueries.getAll()
- productQueries.getBySlug()
- productQueries.getCategories()
- productQueries.getPublishers()

Benefits:
- Single source of truth for queries
- Easier to test and maintain
- Parameterized (prevents injection)
```

#### `lib/sanity-fetchers.ts` - Data Fetching Layer
```typescript
Purpose: Sanity API interactions
Exports:
- fetchProducts()
- fetchProductBySlug()
- fetchCategories()
- fetchPublishers()
- fetchProductsByCategory()

Benefits:
- Consistent error handling
- Mockable for tests
- Centralized Sanity logic
```

#### `lib/errors.ts` - Error Handling Utilities
```typescript
Purpose: Standardized error handling
Exports:
- ApiError class
- handleApiError()
- logError()

Benefits:
- Consistent error messages
- Sanitized logging
- Type-safe error handling
```

### 1.2 Components to Extract

#### From `site-header.tsx` (212 lines → 6 components)

**Current Structure**: Single file with all header logic
**Target Structure**:
1. `site-header.tsx` (40 lines) - Composition only
2. `main-nav.tsx` (44 lines) - Navigation menu
3. `nav-menu.tsx` (16 lines) - Menu items
4. `command-menu.tsx` (70 lines) - Search/command palette
5. `cart-nav.tsx` (20 lines) - Cart icon + count
6. `search-bar.tsx` (30 lines) - Search input

**Extraction Steps**:
1. Identify component boundaries
2. Extract sub-components (one at a time)
3. Move to separate files
4. Update imports in parent
5. Test each extracted component

#### From `app/products/page.tsx` (120 lines)

**Extract**:
1. `components/product-search-filter.tsx` - Search/filter form
2. `components/product-sort.tsx` - Sort dropdown
3. `components/product-list.tsx` - Product grid rendering

**New Structure**:
- `lib/queries.ts` - GROQ queries
- `lib/sanity-fetchers.ts` - Data fetching
- `components/product-*.tsx` - UI components
- `app/products/page.tsx` - 30 lines (composition only)

#### From `app/category/[slug]/page.tsx` (126 lines)

**Extract**:
1. `components/category-product-card.tsx` - Product card for categories

**New Structure**:
- `lib/sanity-fetchers.ts` - fetchProductsByCategory()
- `components/category-product-card.tsx` - Card component
- `app/category/[slug]/page.tsx` - Simplified page

### 1.3 Type Improvements

#### Current Issues
```typescript
// ❌ Bad: any type in interface
interface Product {
  body: any[];  // Should be typed!
}

// ❌ Bad: Stripe responses untyped
const session = await stripe.checkout.sessions.create(...);
// Type is any, not CheckoutSession
```

#### Target Structure
```typescript
// ✅ Good: Properly typed
import type { PortableTextBlock } from '@portabletext/types';

interface Product {
  _id: string;
  name: string;
  price: number;
  body?: PortableTextBlock[];  // Proper type
  image?: SanityImageSource;
}

// ✅ Create lib/stripe-types.ts
export interface CheckoutSession {
  id: string;
  url: string;
  payment_status: 'paid' | 'unpaid';
}
```

---

## Phase 2: Implementation Tasks

### Task Group 1: Create Utility Libraries (2 days)

1. [ ] Create `lib/queries.ts`
   - productQueries.getAll()
   - productQueries.getBySlug()
   - productQueries.getCategories()
   - productQueries.getPublishers()
   - categoryQueries.getBySlug()

2. [ ] Create `lib/sanity-fetchers.ts`
   - fetchProducts()
   - fetchProductBySlug()
   - fetchCategories()
   - fetchPublishers()
   - fetchProductsByCategory()
   - Error handling in each function

3. [ ] Create `lib/errors.ts`
   - ApiError class
   - handleApiError()
   - logError()

4. [ ] Update `lib/interface.ts`
   - Import PortableTextBlock type
   - Update Product.body type
   - Add SanityImageSource type
   - Remove all `any` types

5. [ ] Create `lib/stripe-types.ts`
   - CheckoutSession interface
   - StripeProduct interface
   - Customer details interface

### Task Group 2: Extract Header Components (2 days)

1. [ ] Extract `components/cart-nav.tsx`
   - Accept useCart hook
   - Display cart count
   - Link to cart page

2. [ ] Extract `components/search-bar.tsx`
   - Manage search input state
   - Handle form submission
   - Navigate to products?search=

3. [ ] Extract `components/command-menu.tsx`
   - Keep existing logic
   - No prop changes needed

4. [ ] Extract `components/main-nav.tsx`
   - Navigation menu structure
   - Use shadcn/ui NavigationMenu

5. [ ] Update `site-header.tsx`
   - Import extracted components
   - Composition only
   - Verify no logic remains

### Task Group 3: Refactor Products Page (2 days)

1. [ ] Create `components/product-search-filter.tsx`
   - Accept categories, publishers as props
   - Manage search/filter state
   - Update URL params on change

2. [ ] Create `components/product-sort.tsx`
   - Sort dropdown
   - Update URL params on change

3. [ ] Create `components/product-list.tsx`
   - Accept products array as prop
   - Map over products
   - Use ProductCard component

4. [ ] Refactor `app/products/page.tsx`
   - Import fetchProducts, fetchCategories
   - Call data fetchers
   - Compose UI components
   - Add data-testid attributes

### Task Group 4: Refactor Category Page (1 day)

1. [ ] Create `components/category-product-card.tsx`
   - Extract from category/[slug]/page.tsx
   - Accept product as prop
   - Add meaningful alt text

2. [ ] Refactor `app/category/[slug]/page.tsx`
   - Import fetchProductsByCategory
   - Map over products with CategoryProductCard
   - Simplify to 20 lines

### Task Group 5: Error Handling Improvements (2 days)

1. [ ] Update `app/api/checkout/route.ts`
   - Use handleApiError()
   - Use logError()
   - Sanitize error messages

2. [ ] Update `app/api/session/route.ts`
   - Use handleApiError()
   - Use logError()

3. [ ] Update `components/cart-summary.tsx`
   - Add error state and message
   - Use logError for debugging
   - Add retry button

4. [ ] Update all page components
   - Add try-catch around data fetchers
   - Show error UI gracefully
   - Log errors with context

### Task Group 6: Testing & Verification (2 days)

1. [ ] Run all existing tests
   - Verify no regressions
   - All tests still pass

2. [ ] Add unit tests for extracted components
   - CartNav component test
   - SearchBar component test
   - ProductCard component test

3. [ ] Add integration tests
   - Products page with mocked fetchers
   - Cart page with mocked storage

4. [ ] Manual testing
   - Search products
   - Filter by category
   - Add to cart
   - View cart
   - Checkout

---

## Phase 3: Validation & QA

### Code Quality Metrics
- ✅ site-header.tsx reduced from 212 to ~40 lines
- ✅ products/page.tsx reduced from 120 to ~30 lines
- ✅ All components <75 lines (easily understandable)
- ✅ Zero `any` types in codebase
- ✅ 100% type coverage on critical paths

### Testing Checklist
- [ ] All existing tests pass
- [ ] No functionality regressions
- [ ] New components have tests
- [ ] Integration tests updated
- [ ] E2E tests still passing

### Code Review Checklist
- [ ] No prop drilling >2 levels
- [ ] Clear component responsibilities
- [ ] No duplicate code
- [ ] Error handling consistent
- [ ] Types are explicit (no `any`)

---

## Dependencies & Installation

### New npm Packages
None required (refactoring only)

### Type Packages
- `@portabletext/types` (already available in Next.js/Sanity)

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Breaking changes in refactoring | Incremental changes, test after each |
| Missing type definitions | Audit all external APIs for types |
| Performance regression | Run Lighthouse before/after |
| Complexity in extracted components | Keep <75 lines, single responsibility |

---

## Success Criteria Verification

- ✅ site-header.tsx reduced to ~40 lines (from 212)
- ✅ products/page.tsx reduced to ~30 lines (from 120)
- ✅ All monolithic components extracted
- ✅ 100% type safety (zero `any` types)
- ✅ All error handling consistent
- ✅ All tests pass post-refactoring
- ✅ No functionality regressions

---

## Rollout Plan

1. **Create utility libs** - queries, fetchers, errors
2. **Update types** - eliminate `any`, add Stripe types
3. **Extract header** - one component at a time
4. **Refactor pages** - products, category
5. **Improve errors** - consistent handling
6. **Test thoroughly** - unit, integration, E2E
7. **Merge PR** - all checks passing

---

## Notes

- Refactor incrementally (one component at a time)
- Keep backwards compatibility during refactoring
- Update related tests as components change
- Document new utility functions in code comments
- Consider git bisect if issues arise during refactoring

