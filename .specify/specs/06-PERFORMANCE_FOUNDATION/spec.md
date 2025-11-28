# Phase 4A Specification: Performance Foundation

**Priority**: CRITICAL
**Effort**: 1-2 weeks (7-10 days)
**Status**: Planning Phase
**Purpose**: Fix slow page loads and performance bottlenecks BEFORE design redesign

---

## Overview

Bookish Bliss currently has significant performance issues causing slow page loads. This spec addresses 6 critical performance bottlenecks that will be fixed in this phase. Fixing these first creates a solid foundation for the design redesign (Phase 4B).

**Goal**: Transform page load times from "forever" to <2.0s (LCP), enabling users to experience the new design with proper performance.

---

## Critical Issues & Fixes

### **1. Enable Sanity CDN** ⚡ CRITICAL

**Issue**: Content queries hit origin server instead of CDN cache
- **File**: `sanity/env.ts` (line 14)
- **Current**: `useCdn: false`
- **Impact**: Every query takes 2x longer, no edge caching
- **Expected gain**: 50% faster queries

**Fix**:
1. Change `useCdn: false` → `useCdn: true` in `sanity/env.ts`
2. Test queries still work
3. Verify data freshness is acceptable (real-time vs cached)

**Why it matters**: CDN cache means first-time request hits origin, subsequent requests hit edge locations globally. This is 2-3x faster.

**Risk**: Very low. Sanity SDK handles cache busting for mutations.

**Effort**: 0.5 day

---

### **2. Image Optimization** ⚡ CRITICAL

Images are largest assets on the site. Current implementation has multiple issues causing layout shifts and slow loading.

#### **2A. Product Card Images**
**Issue**: Images have no explicit dimensions
- **File**: `components/product-card.tsx` (lines 14-20)
- **Current**: Width/height not specified
- **Impact**: Causes Cumulative Layout Shift (CLS), slower perceived load
- **Fix**:
  1. Add explicit width/height to Image component
  2. Add `sizes` prop for responsive breakpoints
  3. Enable `priority={true}` for first 4 cards on products page

**Changes needed**:
```
- Image width: 285 → specify as prop
- Image height: 320 → specify as prop
- Add: sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
- Add: priority={isAboveFold} (for first cards)
```

#### **2B. Slider/Hero Images**
**Issue**: Homepage slider images not optimized
- **File**: `components/slider.tsx` (lines 34-43)
- **Current**: Static images, no sizing props
- **Fix**:
  1. Wrap in NextJS Image component if using URL
  2. Add `priority={true}` for hero images
  3. Set responsive `sizes` attribute

#### **2C. Category Page Images**
**Issue**: Uses native `<img>` tag (no Next.js optimization)
- **File**: `app/category/[slug]/page.tsx` (line 101)
- **Current**: `<img src={urlForImage(...)} />`
- **Impact**: No lazy loading, no WebP/AVIF, no responsive sizing
- **Fix**:
  1. Replace with NextJS Image component
  2. Add alt text (already has)
  3. Set width/height
  4. Enable lazy loading (default)

#### **2D. Background Images**
**Issue**: CSS background-image not optimized
- **File**: `app/page.tsx` (lines 44-49, multiple category cards)
- **Current**: `backgroundImage: url(...)`
- **Impact**: Not optimized by Next.js, takes time to load
- **Fix**:
  1. Convert to NextJS Image component or
  2. Pre-optimize and serve as WebP

#### **2E. Image Builder Enhancement**
**Issue**: Sanity image configuration is minimal
- **File**: `sanity/lib/image.ts` (lines 11-12)
- **Current**: Only `.auto("format").fit("max")`
- **Fix**:
  1. Add `.quality(85)` for compression
  2. Add `.width(1200)` constraints
  3. Document configuration

**Result**: Images deliver as WebP/AVIF, automatically compressed

**Effort**: 2-3 days

**Expected gain**: 30% LCP improvement, CLS reduction

---

### **3. Implement ISR (Incremental Static Regeneration)** 📦 HIGH

**Issue**: Every page request triggers fresh Sanity query
- **Impact**: 80% more API calls than needed
- **Solution**: Cache pages for 30min-2 hours, revalidate on schedule or on-demand

**Changes by page**:

#### **Products Page** (`app/products/page.tsx`)
```
Add: export const revalidate = 3600; // 1 hour
```
- Rationale: Product catalog changes infrequently, 1-hour cache is good compromise

#### **Category Pages** (`app/category/[slug]/page.tsx`)
```
Add: export const revalidate = 3600; // 1 hour
```
- Rationale: Same as products page

#### **Homepage** (`app/page.tsx`)
```
Add: export const revalidate = 1800; // 30 minutes
```
- Rationale: Featured sections should refresh more often

#### **Product Detail Pages** (`app/product/[slug]/page.tsx`)
```
Add: export const revalidate = 7200; // 2 hours
```
- Rationale: Individual product data rarely changes

**Verification**:
1. First request: Page generated and cached
2. Second request (within TTL): Served from cache (instant)
3. Third request (after TTL): Page regenerated in background
4. User sees fresh content without waiting

**Effort**: 0.5-1 day

**Expected gain**: 80% fewer API calls to Sanity

---

### **4. Fix Stripe Checkout Performance** ⚡ HIGH

Checkout is slowest operation (users wait 2-3+ seconds). Stripe operations are blocking.

#### **4A. Fix Sequential Product Creation**
**Issue**: Products created one-by-one (sequential loop)
- **File**: `app/api/checkout/route.ts` (lines 84-99)
- **Current**: `for (const cartItem of items)` → `stripe.products.create()`
- **Impact**: With 5-item cart = 5 sequential network requests
- **Fix**: Use `Promise.all()` for parallel creation

```
Replace loop with:
const productPromises = items.map(item => createStripeProduct(item));
const stripeProducts = await Promise.all(productPromises);
```

**Result**: 5 requests in parallel instead of sequential = 70% faster

#### **4B. Cache Stripe Products List**
**Issue**: `stripe.products.list()` called every checkout (no pagination)
- **File**: `app/api/checkout/route.ts` (lines 33-39)
- **Current**: Fetches full product list every time
- **Fix**: Cache for 5 minutes
  1. Store in memory cache or Redis
  2. Check cache before Stripe API
  3. Only fetch if cache expired

#### **4C. Use Product ID Matching**
**Issue**: Matches products by name (case-insensitive string search)
- **File**: `app/api/checkout/route.ts` (lines 85-88)
- **Current**: `stripeProduct?.name?.toLowerCase()`
- **Risk**: Multiple products with same name could match wrong one
- **Fix**: Match by product ID or SKU instead
  1. Store Stripe product ID in Sanity product
  2. Match by ID instead of name
  3. Fallback to name if ID not found

**Effort**: 1-2 days

**Expected gain**: Checkout time from 3s → 1s (70% improvement)

---

### **5. Reduce Bundle Size** 📦 MEDIUM

Unused dependencies add 30-40KB to bundle for every user download.

#### **5A. Remove styled-components**
**Issue**: Unused CSS-in-JS library
- **File**: `package.json` (line 40)
- **Current**: `styled-components: ^6.1.8`
- **Impact**: 15-20KB bundle bloat
- **Verification**: Search codebase for `styled` or `css` → should find nothing
- **Fix**: `npm uninstall styled-components`

#### **5B. Consolidate Icon Libraries**
**Issue**: Two icon libraries (Radix UI + Lucide React)
- **File**: `package.json` (lines 19, 31)
- **Current**:
  - `@radix-ui/react-icons: ^1.3.0`
  - `lucide-react: ^0.263.1`
- **Impact**: 30KB+ redundant icons
- **Audit**: Find all icon imports
  - Check which library is actually used
  - Replace Radix icons with Lucide equivalent
  - Remove unused library
- **Fix**: Keep `lucide-react`, remove `@radix-ui/react-icons`

**Verification**:
```bash
grep -r "from '@radix-ui/react-icons'" --include="*.tsx" --include="*.ts"
grep -r "from 'lucide-react'" --include="*.tsx" --include="*.ts"
```

**Effort**: 0.5 day

**Expected gain**: 30-40KB bundle reduction

---

### **6. Optimize Next.js Config** ⚙️ MEDIUM

Current `next.config.mjs` is minimal. Several quick wins available.

#### **6A. Enable Compression**
**Add to next.config.mjs**:
```javascript
compress: true,  // Gzip compression for responses
```

#### **6B. Add Cache Headers**
**Add to next.config.mjs**:
```javascript
headers: async () => {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ];
},
```

#### **6C. Add Output Caching**
**Add to next.config.mjs**:
```javascript
onDemandEntries: {
  maxInactiveAge: 25 * 1000,
  pagesBufferLength: 5,
},
```

**Effort**: 0.5 day

**Expected gain**: Faster static file delivery, better browser caching

---

## Implementation Timeline

```
Week 1 (5 days):
  Day 1: Enable CDN + Image optimization setup
  Day 2-3: Complete image optimization across all components
  Day 4: Implement ISR on all pages
  Day 5: Start Stripe optimization

Week 2 (2-3 days):
  Day 1-2: Complete Stripe checkout fixes
  Day 1: Remove unused packages + optimize Next.js config
  Day 2-3: Testing & measurement
```

---

## Success Criteria

### **Core Web Vitals Targets**

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **LCP** (Largest Contentful Paint) | 3.5s+ | <2.0s | ↓43% |
| **CLS** (Cumulative Layout Shift) | 0.15+ | <0.1 | ↓33% |
| **FID** (First Input Delay) | 150ms+ | <100ms | ↓33% |
| **Lighthouse Score** | 70 | 90+ | ↑26% |
| **Bundle Size** | 580KB | 540KB | -40KB |

### **Functional Success Criteria**

- ✅ All pages load in <2 seconds (LCP <2.0s)
- ✅ No layout shifts during load (CLS <0.1)
- ✅ Images display with proper dimensions (no placeholder jumps)
- ✅ Checkout completes in <1.5 seconds
- ✅ Sanity queries served from CDN cache
- ✅ All pages use ISR with appropriate revalidate times
- ✅ Bundle size reduced by minimum 30KB
- ✅ All tests pass (from Phase 3B)
- ✅ Mobile performance similar to desktop

---

## Testing Strategy

### **Performance Testing**

1. **Local Testing**:
   ```bash
   npm run build
   npm run start
   # Open DevTools → Performance → Record page load
   # Check Lighthouse scores
   ```

2. **Lighthouse Testing**:
   - Run Lighthouse audit for each page
   - Verify LCP <2.0s, CLS <0.1
   - Generate before/after reports

3. **Web Vitals Monitoring**:
   - Use `web-vitals` npm package
   - Log metrics to console
   - Verify improvements

4. **Image Optimization Verification**:
   - Check images render with correct dimensions
   - Verify no layout shift on load
   - Test responsive sizing on different devices

5. **API Performance**:
   - Monitor Sanity query times
   - Check Stripe API response times
   - Verify caching works

### **Regression Testing**

- Run existing tests from Phase 3B
- Verify no functionality broken
- Test on mobile devices

---

## Measurement & Verification

### **Before Phase 4A**

```bash
# Capture baseline metrics
npm run build
npm run start

# Open each page, measure:
- LCP (DevTools Performance tab)
- CLS (DevTools Performance tab)
- Bundle size (npm run build output)
- API call count (DevTools Network tab)
```

### **After Phase 4A**

```bash
# Run same measurements
# Compare against baseline
# Document improvements

# Generate Lighthouse report:
npm run build
npm run start
# Chrome: Lighthouse tab → Generate report
```

---

## Rollout Plan

### **Stage 1: Local Testing**
- Implement all 6 fixes
- Test locally
- Verify no regressions
- Document results

### **Stage 2: Staging Verification**
- Deploy to staging environment
- Run full test suite
- Measure performance metrics
- Get approval

### **Stage 3: Production Rollout**
- Deploy to production
- Monitor metrics
- Verify improvements
- Document final results

---

## Files to Modify

| File | Change | Lines | Effort |
|------|--------|-------|--------|
| `sanity/env.ts` | Enable CDN | 14 | 5 min |
| `sanity/lib/image.ts` | Enhance image builder | 11-12 | 15 min |
| `components/product-card.tsx` | Add image sizing | 14-20 | 20 min |
| `components/product-row.tsx` | Fix image layout | 61-67 | 20 min |
| `components/slider.tsx` | Optimize hero images | 34-43 | 30 min |
| `app/category/[slug]/page.tsx` | Convert to Image component | 100 | 30 min |
| `app/page.tsx` | Optimize bg images + ISR | 44-49, top | 45 min |
| `app/products/page.tsx` | Add ISR | top | 10 min |
| `app/product/[slug]/page.tsx` | Add ISR | top | 10 min |
| `app/api/checkout/route.ts` | Fix Stripe perf | 33-99 | 2-3 hours |
| `next.config.mjs` | Optimize config | all | 30 min |
| `package.json` | Remove unused deps | 40, 19 | 10 min |

**Total effort**: 7-10 days

---

## Notes & Caveats

### **Sanity CDN Caching**
- First request: Hits origin, slower
- Subsequent requests: Served from cache, 2-3x faster
- Cache busting: Handled automatically on mutations
- Data freshness: Trade-off (30min-2 hour delay acceptable for e-commerce)

### **Image Optimization**
- Next.js Image component handles responsive sizing
- Images auto-converted to WebP/AVIF on modern browsers
- Quality set to 85 is imperceptible but saves 20-30% bandwidth
- Lazy loading is automatic (unless priority={true})

### **ISR vs Dynamic Rendering**
- ISR = best of both worlds: fast cached response + fresh data
- Revalidate times chosen conservatively (longer caches = less data freshness)
- Can adjust times later based on content update frequency

### **Stripe Optimization**
- Promise.all() is safe for product creation (independent operations)
- Caching reduces API calls but must handle edge cases (new products)
- Product ID matching is safer than name matching

---

## Future Optimization Opportunities

These are NOT included in Phase 4A but could be Phase 5:
- Image compression optimization (current quality: 85, could be 75-80)
- Database query optimization (Sanity projection for unused fields)
- CSS/JS minification (already done by Next.js)
- Font subsetting (load only used characters)
- Code splitting (lazy load non-critical components)
- Service Worker / offline support

---

## Questions & Clarifications Needed

Before implementation:

1. ✅ Is 1-hour cache acceptable for product pages? (vs 30 min or 2 hours)
2. ✅ Should we implement Stripe product caching with 5-min TTL?
3. ✅ Are there any products with duplicate names in Sanity? (affects ID matching strategy)
4. ✅ Should we measure performance on mobile networks (3G)? (Lighthouse throttles by default)
5. ✅ Do you want Lighthouse reports saved/tracked? (for before/after comparison)

---

## Success Definition

Phase 4A is complete when:
- ✅ All 6 fixes implemented
- ✅ Tests pass
- ✅ LCP <2.0s on all pages
- ✅ Lighthouse score 90+
- ✅ Bundle size -30KB
- ✅ Checkout <1.5s
- ✅ All metrics documented
- ✅ Ready for Phase 4B (design redesign on solid foundation)
