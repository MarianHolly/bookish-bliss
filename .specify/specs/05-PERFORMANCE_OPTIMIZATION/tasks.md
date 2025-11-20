# Tasks: Performance Optimization

**Spec**: [05-PERFORMANCE_OPTIMIZATION.md](05-PERFORMANCE_OPTIMIZATION.md)
**Plan**: [plan.md](plan.md)
**Priority**: MEDIUM
**Total Effort**: 1 week
**Status**: Ready for Implementation

---

## Task Groups & Dependencies

```
Phase 1: Quick Wins (1 day)
├── Remove unused dependencies
├── Enable Sanity CDN
└── Setup bundle analyzer

Phase 2: ISR Caching (2 days)
├── Products page ISR
├── Category pages ISR
└── Product detail ISR

Phase 3: Image Optimization (2 days)
├── Fix deprecated Image API
├── Add sizes prop
├── Add blur placeholders
└── Implement priority logic

Phase 4: Monitoring & Validation (1 day)
├── Setup Web Vitals
├── Performance budgets
└── Lighthouse audits

Phase 5: Testing & Measurement (1 day)
├── Before/after metrics
├── Load time verification
└── No regressions
```

---

## Phase 1: Quick Wins (1 day)

### Task 1.1: Remove Unused Dependencies
**Effort**: 30 minutes
**Files Modified**: `package.json`

**Commands**:
```bash
# Verify not used
grep -r "styled-components" src/
grep -r "sanity-plugin-markdown" src/

# Remove if not found
npm uninstall styled-components sanity-plugin-markdown
npm prune
```

**Checklist**:
- [ ] Search for styled-components imports
- [ ] Search for sanity-plugin-markdown imports
- [ ] Verify no dependencies on these packages
- [ ] Run: `npm uninstall styled-components sanity-plugin-markdown`
- [ ] Run: `npm prune`
- [ ] Verify package.json updated
- [ ] Verify bundle size reduced

**Acceptance Criteria**:
- ✅ styled-components removed
- ✅ sanity-plugin-markdown removed
- ✅ No build errors
- ✅ 70KB+ bundle reduction

---

### Task 1.2: Enable Sanity CDN
**Effort**: 30 minutes
**Files Modified**: `sanity/lib/client.ts`

**Current State**:
```typescript
useCdn: false  // Fetches from origin every time
```

**Change To**:
```typescript
// Public queries use CDN
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,  // ✅ Enable CDN for public content
});

// Admin queries bypass CDN
export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,  // Never cache admin operations
});
```

**Checklist**:
- [ ] Open sanity/lib/client.ts
- [ ] Change useCdn: false → true for public client
- [ ] Create adminClient with useCdn: false and token
- [ ] Update any imports to use appropriate client
- [ ] Test queries still work
- [ ] Verify CDN responses (should be faster)

**Acceptance Criteria**:
- ✅ sanity/lib/client.ts updated
- ✅ useCdn: true for public queries
- ✅ adminClient for writes
- ✅ 50% faster queries
- ✅ No build errors

---

### Task 1.3: Setup Bundle Analyzer
**Effort**: 30 minutes
**Files Modified**: `package.json`, `next.config.mjs`

**Commands**:
```bash
npm install --save-dev @next/bundle-analyzer
```

**Update `next.config.mjs`**:
```javascript
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
});
```

**Checklist**:
- [ ] Install @next/bundle-analyzer
- [ ] Update next.config.mjs with analyzer
- [ ] Set enabled condition on ANALYZE env var
- [ ] Test: `ANALYZE=true npm run build`
- [ ] Analyzer generates bundle report
- [ ] Verify bundle size breakdown

**Acceptance Criteria**:
- ✅ @next/bundle-analyzer installed
- ✅ next.config.mjs configured
- ✅ Can run `ANALYZE=true npm run build`
- ✅ Bundle report generates

---

## Phase 2: ISR Caching (2 days)

### Task 2.1: Implement ISR on Products Page
**Effort**: 1 hour
**Files Modified**: `app/products/page.tsx`

**Add to file**:
```typescript
export const revalidate = 60;  // Cache for 60 seconds

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  // Existing logic
}
```

**Checklist**:
- [ ] Open app/products/page.tsx
- [ ] Add `export const revalidate = 60` at top
- [ ] Test locally: products load from cache
- [ ] Wait 60 seconds, verify cache invalidates
- [ ] Verify search still works with ISR

**Acceptance Criteria**:
- ✅ ISR configured for 60 seconds
- ✅ Products cached after first load
- ✅ Cache updates every 60 seconds
- ✅ No API call spam

---

### Task 2.2: Implement ISR on Category Pages
**Effort**: 1.5 hours
**Files Modified**: `app/category/[slug]/page.tsx`

**Add to file**:
```typescript
export const revalidate = 60;

export async function generateStaticParams() {
  // Pre-build all category pages at build time
  const categories = await fetchCategories();
  return categories.map((cat) => ({
    slug: cat.slug.current,
  }));
}

export default async function CategoryPage({ params }) {
  // Existing logic
}
```

**Checklist**:
- [ ] Add revalidate = 60
- [ ] Add generateStaticParams function
- [ ] Call fetchCategories to get all categories
- [ ] Return array of params
- [ ] Test: `npm run build` pre-builds category pages
- [ ] Test: category pages load from cache
- [ ] Verify dynamic routes still work

**Acceptance Criteria**:
- ✅ revalidate set to 60 seconds
- ✅ generateStaticParams pre-builds categories
- ✅ Dynamic routes cached
- ✅ 80% fewer API calls

---

### Task 2.3: Implement ISR on Product Detail Pages
**Effort**: 1.5 hours
**Files Modified**: `app/product/[slug]/page.tsx`

**Add to file**:
```typescript
export const revalidate = 3600;  // Cache for 1 hour

export async function generateStaticParams() {
  // Pre-build popular products (e.g., top 100)
  const products = await fetchProducts();
  return products.slice(0, 100).map((p) => ({
    slug: p.slug.current,
  }));
}

export default async function ProductPage({ params }) {
  // Existing logic
}
```

**Checklist**:
- [ ] Add revalidate = 3600 (1 hour)
- [ ] Add generateStaticParams function
- [ ] Fetch products and limit to top 100
- [ ] Return slug params
- [ ] Test: `npm run build` pre-builds popular products
- [ ] Test: product pages load from cache
- [ ] Verify less popular products still load (on-demand)

**Acceptance Criteria**:
- ✅ revalidate set to 3600 seconds
- ✅ Top 100 products pre-built
- ✅ Dynamic routes cached
- ✅ Reduces API calls significantly

---

### Task 2.4: Test ISR Behavior
**Effort**: 1 hour
**Local Testing**: Cache validation

**Test Steps**:
```bash
# Build for production
npm run build

# Start production server
npm start

# Test caching behavior
curl http://localhost:3000/products
# Should be instant (cached)

# Wait 60 seconds, refresh
curl http://localhost:3000/products
# Should regenerate after 60s

# Test dynamic routes
curl http://localhost:3000/product/some-book
# Should work (on-demand generated)
```

**Checklist**:
- [ ] Run `npm run build`
- [ ] Run `npm start`
- [ ] Products page loads fast (cached)
- [ ] Category pages load fast (cached)
- [ ] Product pages load correctly
- [ ] Cache invalidates after revalidate time
- [ ] No 404 errors

**Acceptance Criteria**:
- ✅ ISR working on all dynamic pages
- ✅ Cache invalidation verified
- ✅ Load times improved
- ✅ No errors

---

## Phase 3: Image Optimization (2 days)

### Task 3.1: Fix Deprecated Image API
**Effort**: 2 hours
**Files Modified**: Multiple image components

**Find All Images**:
```bash
grep -r "layout=\"fill\"" src/
grep -r "objectFit=" src/
grep -r "alt=\"" src/components/
```

**Pattern to Replace**:
```typescript
// BEFORE
<Image
  src={image}
  alt="Product"
  layout="fill"
  objectFit="cover"
/>

// AFTER
<Image
  src={image}
  alt={product.name}  // Meaningful alt
  fill
  style={{ objectFit: 'cover' }}
  loading="lazy"
/>
```

**Files to Update**:
- [ ] `components/product-row.tsx`
- [ ] `components/slider.tsx`
- [ ] `components/product-card.tsx`
- [ ] `app/product/[slug]/page.tsx`
- [ ] Any other Image components

**Checklist**:
- [ ] Find all deprecated layout/objectFit props
- [ ] Replace layout="fill" with fill prop
- [ ] Replace objectFit prop with style={{ objectFit }}
- [ ] Update alt text to be meaningful
- [ ] Add loading="lazy" for below-fold images
- [ ] Test images still display correctly
- [ ] No visual regressions

**Acceptance Criteria**:
- ✅ All deprecated props removed
- ✅ All alt text meaningful
- ✅ Images display correctly
- ✅ No console warnings

---

### Task 3.2: Add Sizes Prop to Responsive Images
**Effort**: 1.5 hours
**Files Modified**: Image components

**Pattern**:
```typescript
<Image
  src={image}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
/>
```

**For Each Image**:
- [ ] Add sizes prop appropriate to layout
- [ ] Test on mobile (640px)
- [ ] Test on tablet (1024px)
- [ ] Test on desktop (>1024px)
- [ ] Verify image size is optimal for each breakpoint

**Checklist**:
- [ ] All responsive images have sizes prop
- [ ] Sizes match component layout
- [ ] Images load optimal size for device
- [ ] No oversized images

**Acceptance Criteria**:
- ✅ All images have sizes prop
- ✅ Responsive sizing working
- ✅ Smaller images on mobile
- ✅ Better performance

---

### Task 3.3: Add Blur Placeholders
**Effort**: 1.5 hours
**Files Modified**: Image components

**For Server Components**:
```typescript
import { shimmer } from '@/lib/image';

const blurredImage = await shimmer(200, 200);

<Image
  src={image}
  alt={product.name}
  fill
  placeholder="blur"
  blurDataURL={blurredImage}
/>
```

**For Client Components** (pass as prop):
```typescript
<Image
  src={image}
  alt={product.name}
  fill
  placeholder="blur"
  blurDataURL={props.blurDataURL}
/>
```

**Checklist**:
- [ ] Add blur placeholders to product cards
- [ ] Add to product slider
- [ ] Add to product detail images
- [ ] Verify placeholder shows while loading
- [ ] Visual improved

**Acceptance Criteria**:
- ✅ Blur placeholders visible
- ✅ Perceived performance improved
- ✅ CLS (layout shift) reduced
- ✅ Better user experience

---

### Task 3.4: Implement Image Priority Logic
**Effort**: 1 hour
**Files Modified**: Product grid components

**Pattern**:
```typescript
{products.map((product, index) => (
  <Image
    key={product._id}
    src={productImage}
    alt={product.name}
    priority={index < 4}  // Prioritize first 4 above-fold images
    loading={index >= 4 ? 'lazy' : 'auto'}  // Lazy load rest
    sizes="..."
  />
))}
```

**Checklist**:
- [ ] Identify above-fold images (first 4 products)
- [ ] Set priority={true} for first 4
- [ ] Set loading="lazy" for rest
- [ ] Test on products page
- [ ] Verify LCP improvement
- [ ] Check Lighthouse score

**Acceptance Criteria**:
- ✅ Above-fold images prioritized
- ✅ Below-fold images lazy loaded
- ✅ LCP improved
- ✅ Better Core Web Vitals

---

## Phase 4: Web Vitals Monitoring (1 day)

### Task 4.1: Create Web Vitals Tracking
**Effort**: 1 hour
**Files Created**: `lib/web-vitals.ts`

**Implementation**:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals() {
  getCLS((metric) => console.log('CLS:', metric.value));
  getFID((metric) => console.log('FID:', metric.value));
  getFCP((metric) => console.log('FCP:', metric.value));
  getLCP((metric) => console.log('LCP:', metric.value));
  getTTFB((metric) => console.log('TTFB:', metric.value));
}
```

**Checklist**:
- [ ] Install web-vitals: `npm install web-vitals`
- [ ] Create lib/web-vitals.ts
- [ ] Import all metric functions
- [ ] Export reportWebVitals function
- [ ] Verify no syntax errors

**Acceptance Criteria**:
- ✅ lib/web-vitals.ts created
- ✅ Can be imported in layout
- ✅ Metrics logged to console

---

### Task 4.2: Integrate Web Vitals in Layout
**Effort**: 30 minutes
**Files Modified**: `app/layout.tsx`

**Add to root layout**:
```typescript
'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

**Checklist**:
- [ ] Add useEffect hook to root layout
- [ ] Call reportWebVitals() on mount
- [ ] Mark component with 'use client'
- [ ] Test: Open DevTools console
- [ ] Verify metrics logged

**Acceptance Criteria**:
- ✅ Web Vitals tracked on page load
- ✅ Metrics visible in console
- ✅ Ready for analytics integration

---

### Task 4.3: Setup Performance Budget
**Effort**: 30 minutes
**Files Created**: `performance-budget.json` (optional)

**Performance Targets**:
```json
{
  "bundles": [
    { "name": "main", "maxSize": "250kb" },
    { "name": "next", "maxSize": "150kb" }
  ],
  "metrics": {
    "LCP": { "threshold": 2.5 },
    "FCP": { "threshold": 1.2 },
    "CLS": { "threshold": 0.1 },
    "TTI": { "threshold": 3.5 }
  }
}
```

**Checklist**:
- [ ] Create performance-budget.json (optional)
- [ ] Document bundle size targets
- [ ] Document Core Web Vitals targets
- [ ] Share targets with team
- [ ] Monitor in CI/CD (future)

**Acceptance Criteria**:
- ✅ Performance targets defined
- ✅ Team aware of goals
- ✅ Baseline established

---

## Phase 5: Testing & Measurement (1 day)

### Task 5.1: Run Before Measurements
**Effort**: 2 hours
**Local Testing**: Baseline metrics

**Commands**:
```bash
# Clean build
rm -rf .next out
npm run build

# Lighthouse audit (desktop)
npx lighthouse http://localhost:3000 --view

# Measure bundle size
ANALYZE=true npm run build
```

**Document Baseline**:
- [ ] LCP (Largest Contentful Paint)
- [ ] FCP (First Contentful Paint)
- [ ] CLS (Cumulative Layout Shift)
- [ ] TTI (Time to Interactive)
- [ ] Bundle size (main + next)
- [ ] Total JS loaded

**Example Baseline**:
```
Before:
- LCP: 2.8s
- FCP: 1.4s
- CLS: 0.05
- TTI: 3.2s
- Bundle: 580KB
```

**Checklist**:
- [ ] Run baseline Lighthouse audit
- [ ] Record all metrics
- [ ] Document bundle analysis
- [ ] Save screenshots
- [ ] Note environment (local/staging/prod)

**Acceptance Criteria**:
- ✅ Baseline metrics recorded
- ✅ All 5 metrics captured
- ✅ Ready to measure improvements

---

### Task 5.2: Implement All Optimizations
**Effort**: 3 days
**Implementation**: Complete all Phase 1-4 tasks

**Checklist**:
- [ ] Dependencies removed ✓
- [ ] CDN enabled ✓
- [ ] ISR implemented ✓
- [ ] Images optimized ✓
- [ ] Web Vitals tracking ✓
- [ ] All changes tested ✓

**Acceptance Criteria**:
- ✅ All optimizations complete
- ✅ No build errors
- ✅ No visual regressions
- ✅ Ready to measure

---

### Task 5.3: Run After Measurements
**Effort**: 2 hours
**Local Testing**: Final metrics

**Commands**:
```bash
# Clean build
rm -rf .next out
npm run build

# Start production server
npm start

# Lighthouse audit (same URL)
npx lighthouse http://localhost:3000 --view

# Bundle analysis
ANALYZE=true npm run build
```

**Compare Results**:
```
After:
- LCP: <2.0s (30% improvement)
- FCP: <1.2s
- CLS: <0.1
- TTI: <3.0s
- Bundle: 510KB (70KB reduction)
- Lighthouse: 92+
```

**Checklist**:
- [ ] Run after Lighthouse audit
- [ ] Compare all metrics to baseline
- [ ] Calculate improvement percentages
- [ ] Document findings
- [ ] Screenshot results

**Acceptance Criteria**:
- ✅ LCP improved by 30%
- ✅ Bundle reduced by 70KB
- ✅ All Core Web Vitals passing
- ✅ Lighthouse score 92+

---

### Task 5.4: Verify No Regressions
**Effort**: 1 hour
**Manual Testing**: Functionality

**Test Scenarios**:
- [ ] Search products works
- [ ] Filter by category works
- [ ] Sort products works
- [ ] View product details works
- [ ] Add to cart works
- [ ] Checkout flow works
- [ ] Images load correctly
- [ ] No 404 errors
- [ ] No broken links
- [ ] Mobile responsive

**Checklist**:
- [ ] All features function correctly
- [ ] No visual differences
- [ ] Performance good on slow 3G
- [ ] Mobile experience intact

**Acceptance Criteria**:
- ✅ No functionality broken
- ✅ No visual regressions
- ✅ Performance improved overall
- ✅ Ready to deploy

---

### Task 5.5: Deploy to Staging
**Effort**: 1 hour
**Staging**: Deploy and validate

**Steps**:
1. [ ] Merge to develop branch
2. [ ] Deploy to staging environment
3. [ ] Run Lighthouse on staging
4. [ ] Verify all features work
5. [ ] Monitor for 24 hours
6. [ ] Check real-world metrics

**Acceptance Criteria**:
- ✅ Staging deployment successful
- ✅ 24-hour monitoring complete
- ✅ No errors in logs
- ✅ Ready for production

---

## Summary

**Total Tasks**: 16 actionable items
**Total Effort**: 1 week
**Deliverables**:
- 3 unused packages removed (70KB saved)
- Sanity CDN enabled (50% faster queries)
- ISR caching on 3 page types (80% fewer API calls)
- All images optimized
- Web Vitals monitoring
- Performance measurements

**Success Criteria**:
- ✅ LCP improved by 30% (2.8s → <2.0s)
- ✅ API calls reduced by 80% (ISR caching)
- ✅ Bundle size reduced by 70KB
- ✅ Lighthouse score 92+
- ✅ Core Web Vitals passing
- ✅ No functionality broken
- ✅ No visual regressions

**Performance Targets Met**:
- ✅ LCP: <2.5s
- ✅ FCP: <1.2s
- ✅ CLS: <0.1
- ✅ TTI: <3.5s
- ✅ Bundle: <400KB (main+next)

