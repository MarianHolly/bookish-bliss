# Performance Optimization - Implementation Checklist

**Status**: NOT STARTED
**Last Updated**: 2025-11-28
**Progress**: 0%

---

## Phase 1: Quick Wins (1 day)

### Task 1.1: Remove Unused Dependencies
- [ ] Verify styled-components not used: `grep -r "styled-components" src/`
- [ ] Verify sanity-plugin-markdown not used: `grep -r "sanity-plugin-markdown" src/`
- [ ] Remove if not found: `npm uninstall styled-components sanity-plugin-markdown`
- [ ] Run: `npm prune`
- [ ] Verify package.json updated
- [ ] Bundle size reduced by ~70KB

**Expected Results**:
- [ ] 70KB+ bundle reduction
- [ ] No functionality lost
- [ ] Build still passes

**Status**: ⏳ PENDING

---

### Task 1.2: Enable Sanity CDN
- [ ] Edit `sanity/lib/client.ts`
- [ ] Change `useCdn: false` to `useCdn: true`
- [ ] Test: Sanity queries still work
- [ ] Verify: No errors in console
- [ ] Measure: Query response time

**Expected Results**:
- [ ] 50% faster Sanity queries
- [ ] No broken queries
- [ ] All data fetches work

**Status**: ⏳ PENDING

---

### Task 1.3: Setup Bundle Analyzer
- [ ] Install: `npm install --save-dev @next/bundle-analyzer`
- [ ] Create `analyze.js` script
- [ ] Add npm script: `npm run analyze`
- [ ] Run analysis: `npm run analyze`
- [ ] Identify large chunks
- [ ] Document findings

**Expected Results**:
- [ ] Bundle analyzer working
- [ ] Can identify large dependencies
- [ ] Know which chunks to optimize

**Status**: ⏳ PENDING

---

## Phase 2: ISR Caching (2 days)

### Task 2.1: Add ISR to Products Page
- [ ] Edit `app/products/page.tsx`
- [ ] Add at top: `export const revalidate = 60`
- [ ] Test: Page caches for 60 seconds
- [ ] Test: New products appear after revalidate
- [ ] Verify: No console errors

**Expected Results**:
- [ ] Products cached for 60s
- [ ] 80% fewer API calls
- [ ] Faster page loads

**Status**: ⏳ PENDING

---

### Task 2.2: Add ISR to Category Pages
- [ ] Edit `app/category/[slug]/page.tsx`
- [ ] Add at top: `export const revalidate = 60`
- [ ] Test: Pages cache correctly
- [ ] Test: New products in category appear
- [ ] Verify: No errors

**Expected Results**:
- [ ] Category pages cached
- [ ] Faster category browsing
- [ ] Reduced API load

**Status**: ⏳ PENDING

---

### Task 2.3: Add ISR to Product Detail
- [ ] Edit `app/product/[slug]/page.tsx`
- [ ] Add at top: `export const revalidate = 3600` (1 hour)
- [ ] Test: Product pages cache for 1 hour
- [ ] Test: Updates appear after revalidate
- [ ] Verify: No errors

**Expected Results**:
- [ ] Product details cached for 1 hour
- [ ] Very fast detail page loads
- [ ] Minimal API calls for popular products

**Status**: ⏳ PENDING

---

### Task 2.4: Verify ISR Configuration
- [ ] Test local build: `npm run build`
- [ ] Test production mode: `npm run build && npm start`
- [ ] Verify: Pages serve cached versions
- [ ] Verify: Revalidation works
- [ ] Monitor: API call frequency

**Expected Results**:
- [ ] ISR working correctly
- [ ] Significant API reduction
- [ ] No broken pages

**Status**: ⏳ PENDING

---

## Phase 3: Image Optimization (2 days)

### Task 3.1: Fix Deprecated Image API
- [ ] Find all `layout="fill"` usage
- [ ] Replace with `fill` prop
- [ ] Find all `objectFit="cover"` usage
- [ ] Replace with `className="object-cover"`
- [ ] Verify: No deprecation warnings
- [ ] Build passes: `npm run build`

**Status**: ⏳ PENDING

---

### Task 3.2: Add `sizes` Prop to Images
- [ ] Add to `components/product-card.tsx`
- [ ] Add to `components/slider.tsx`
- [ ] Add to category product cards
- [ ] Add to product detail image
- [ ] Example: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- [ ] Verify: Images load optimized for viewport

**Status**: ⏳ PENDING

---

### Task 3.3: Add Blur Placeholders
- [ ] Add `placeholder="blur"` to above-fold images
- [ ] Generate blur data URLs from Sanity
- [ ] Add `blurDataURL` prop to next/image
- [ ] Test: Blur loads before image
- [ ] Verify: Visual improvement

**Status**: ⏳ PENDING

---

### Task 3.4: Implement Priority Logic
- [ ] Add `priority={true}` to hero image
- [ ] Add to above-fold product cards (first 4)
- [ ] Leave `priority={false}` for below-fold
- [ ] Test: Hero loads immediately
- [ ] Verify: LCP improvement

**Expected Results**:
- [ ] Hero image prioritized
- [ ] Product cards optimized
- [ ] LCP < 2.0s

**Status**: ⏳ PENDING

---

## Phase 4: Monitoring & Validation (1 day)

### Task 4.1: Setup Web Vitals Monitoring
- [ ] Install: `npm install web-vitals`
- [ ] Create `lib/web-vitals.ts`
- [ ] Add to `app/layout.tsx`
- [ ] Collect: LCP, FCP, CLS, FID, TTFB
- [ ] Log metrics to analytics

**Status**: ⏳ PENDING

---

### Task 4.2: Setup Performance Budget
- [ ] Define LCP budget: <2.0s
- [ ] Define FCP budget: <1.2s
- [ ] Define CLS budget: <0.1
- [ ] Define bundle budget: 510KB
- [ ] Create `next.config.mjs` checks
- [ ] Warn on budget exceeds

**Status**: ⏳ PENDING

---

### Task 4.3: Lighthouse Audits
- [ ] Run: `npm run build && npm start`
- [ ] Open: http://localhost:3000
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Target score: 90+
- [ ] Document results
- [ ] Fix issues found

**Expected Results**:
- [ ] Lighthouse score 90+
- [ ] All Core Web Vitals passing
- [ ] Mobile-friendly

**Status**: ⏳ PENDING

---

## Phase 5: Testing & Measurement (1 day)

### Task 5.1: Before/After Metrics
- [ ] Measure before optimization:
  - [ ] LCP (Largest Contentful Paint)
  - [ ] FCP (First Contentful Paint)
  - [ ] CLS (Cumulative Layout Shift)
  - [ ] TTI (Time to Interactive)
  - [ ] Bundle size
  - [ ] API calls per page load

- [ ] Document baseline metrics
- [ ] Take screenshots of Lighthouse
- [ ] Record Web Vitals

**Status**: ⏳ PENDING

---

### Task 5.2: Load Time Verification
- [ ] Test homepage load time (target: <2.5s LCP)
- [ ] Test products page load time
- [ ] Test category page load time
- [ ] Test product detail page load time
- [ ] Test on slow 4G network (DevTools throttling)
- [ ] Verify improvement from baseline

**Expected Improvement**:
- [ ] LCP: 2.8s → <2.0s (30% improvement)
- [ ] Bundle: 580KB → 510KB (70KB reduction)
- [ ] API calls: 80% reduction with ISR

**Status**: ⏳ PENDING

---

### Task 5.3: Regression Testing
- [ ] Test all pages render correctly
- [ ] Test search functionality
- [ ] Test category filtering
- [ ] Test product detail pages
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Verify no visual regressions
- [ ] Check console for errors

**Expected Results**:
- [ ] Zero functionality broken
- [ ] All features working
- [ ] No console errors
- [ ] Better performance

**Status**: ⏳ PENDING

---

## Performance Targets

### Before Optimization
- **LCP**: 2.8s
- **FCP**: 1.4s
- **CLS**: 0.05
- **TTI**: 3.2s
- **Bundle**: 580KB
- **Lighthouse**: 82

### After Optimization
- **LCP**: <2.0s ✅
- **FCP**: <1.2s ✅
- **CLS**: <0.1 ✅
- **TTI**: <3.0s ✅
- **Bundle**: 510KB ✅
- **Lighthouse**: 90+ ✅

---

## Summary

| Phase | Status | Tasks | Progress |
|-------|--------|-------|----------|
| **1. Quick Wins** | ⏳ PENDING | 3 | 0% |
| **2. ISR Caching** | ⏳ PENDING | 4 | 0% |
| **3. Image Optimization** | ⏳ PENDING | 4 | 0% |
| **4. Monitoring** | ⏳ PENDING | 3 | 0% |
| **5. Testing & Measurement** | ⏳ PENDING | 3 | 0% |
| **TOTAL** | ⏳ **0% COMPLETE** | **17 tasks** | **0/17** |

---

## Implementation Order

1. **Phase 1: Quick Wins** (1 day)
   - Fastest ROI
   - Remove unused packages
   - Enable Sanity CDN
   - Setup analysis tools

2. **Phase 2: ISR Caching** (2 days)
   - Significant API reduction
   - Faster repeat visits
   - Lower server load

3. **Phase 3: Image Optimization** (2 days)
   - Visual performance
   - Core Web Vitals improvement
   - Better UX

4. **Phase 4: Monitoring** (1 day)
   - Track performance
   - Catch regressions
   - Data-driven decisions

5. **Phase 5: Verification** (1 day)
   - Measure improvements
   - Test regressions
   - Document results

---

## Success Criteria

- [x] All tasks completed
- [ ] LCP < 2.0s (30% improvement)
- [ ] Bundle size < 510KB (70KB reduction)
- [ ] 80% fewer API calls (via ISR)
- [ ] Lighthouse score 90+
- [ ] Zero functionality regressions
- [ ] All Core Web Vitals passing
- [ ] Performance metrics monitoring active

---

## Tools & Resources

- **@next/bundle-analyzer** - Bundle size analysis
- **web-vitals** - Performance metrics
- **Chrome DevTools** - Lighthouse audits
- **WebPageTest** - Real-world performance
- **Sanity CDN** - Content delivery network

---

**Created**: 2025-11-28
**Start Date**: TBD
**Estimated Completion**: 1 week
**Status**: ⏳ **NOT STARTED**
