# Implementation Plan: Performance Optimization

**Spec**: [05-PERFORMANCE_OPTIMIZATION.md](05-PERFORMANCE_OPTIMIZATION.md)
**Priority**: MEDIUM
**Effort**: 1 week
**Status**: Planning Phase

---

## Constitution Alignment

### Principle IV: User Experience & Performance
- ✅ Next.js Image optimization required for all book covers
- ✅ Shopping cart must remain responsive (<50ms operations)
- ✅ Mobile-first responsive design
- ✅ Lazy loading for product lists

### Success Metrics
- ✅ LCP improved by 30% (target: <2.5s)
- ✅ API calls reduced by 80% (ISR caching)
- ✅ Bundle size reduced by 70KB

---

## Phase 0: Research & Unknowns

### Performance Optimization Priorities
1. **Quick wins** (Day 1): CDN, dependency removal, bundle analysis
2. **Caching** (Day 2): ISR implementation, revalidation strategy
3. **Images** (Days 3-4): API fixes, blur placeholders, priority logic
4. **Monitoring** (Day 5): Web Vitals tracking, performance budgets

### Key Decisions
- **Sanity CDN**: Enable for public content (disable for admin)
- **ISR Strategy**: 60s revalidation for products/categories, 1h for details
- **Image Optimization**: Priority for above-fold, lazy load for below-fold
- **Unused Dependencies**: Remove styled-components (16KB) and sanity-plugin-markdown (50KB)

---

## Phase 1: Design & Architecture

### 1.1 Performance Targets

```
Before:
- LCP: 2.8s (Largest Contentful Paint)
- FCP: 1.4s (First Contentful Paint)
- CLS: 0.05 (Cumulative Layout Shift)
- TTI: 3.2s (Time to Interactive)
- Bundle: 580KB

After:
- LCP: <2.0s (30% improvement)
- FCP: <1.2s
- CLS: <0.1
- TTI: <3.0s
- Bundle: 510KB (70KB reduction)
```

### 1.2 Optimization Strategy

#### Level 1: Quick Wins (Fast)
1. Enable Sanity CDN (50% faster queries)
2. Remove unused dependencies (70KB savings)
3. Setup bundle analysis tool

#### Level 2: Caching (Medium)
1. Implement ISR on products page (60s)
2. Implement ISR on category pages (60s)
3. Implement ISR on product details (1h)

#### Level 3: Images (Longer)
1. Fix deprecated Image API (layout="fill" → fill)
2. Add sizes prop to all responsive images
3. Add blur placeholders
4. Prioritize above-fold images

#### Level 4: Monitoring (Ongoing)
1. Setup Web Vitals monitoring
2. Configure performance budgets
3. Track metrics in CI/CD

### 1.3 Caching Configuration

```
Products Page:
- Route: /products
- Revalidate: 60 seconds
- Rationale: Products change frequently, but 60s cache is acceptable

Category Pages:
- Route: /category/[slug]
- Revalidate: 60 seconds
- generateStaticParams: Pre-build all categories at build time

Product Detail Pages:
- Route: /product/[slug]
- Revalidate: 3600 seconds (1 hour)
- generateStaticParams: Pre-build top 100 products
- Rationale: Details change less frequently

Static Pages (Homepage, etc):
- No revalidation needed (rebuild on deploy)
```

### 1.4 Image Optimization Strategy

```
Above-Fold Images (LCP candidates):
- priority={true}
- Preload with <link rel="preload">
- Large file size acceptable for quality

Below-Fold Images:
- loading="lazy"
- Dynamic import for components
- Can use smaller dimensions/quality

All Images:
- sizes prop for responsive sizing
- Meaningful alt text
- blur placeholder for perceived performance
```

---

## Phase 2: Implementation Tasks

### Task Group 1: CDN & Dependencies (1 day)

1. [ ] Enable Sanity CDN
   - Update `sanity/lib/client.ts` - useCdn: true
   - Create separate adminClient with useCdn: false
   - Update all fetchers to use appropriate client

2. [ ] Remove Unused Dependencies
   - Verify styled-components not used: `grep -r "styled-components" src/`
   - Verify sanity-plugin-markdown not used: `grep -r "sanity-plugin-markdown" src/`
   - Run: `npm uninstall styled-components sanity-plugin-markdown`
   - Run: `npm prune`

3. [ ] Setup Bundle Analysis
   - Install: `npm install --save-dev @next/bundle-analyzer`
   - Update `next.config.mjs` with analyzer
   - Test: `ANALYZE=true npm run build`

### Task Group 2: ISR Implementation (2 days)

1. [ ] Products Page - `app/products/page.tsx`
   - Add: `export const revalidate = 60`
   - Test caching behavior
   - Verify search still works

2. [ ] Category Pages - `app/category/[slug]/page.tsx`
   - Add: `export const revalidate = 60`
   - Add: `generateStaticParams()` - fetch all categories
   - Pre-build all category pages at build time
   - Test category filtering

3. [ ] Product Detail Pages - `app/product/[slug]/page.tsx`
   - Add: `export const revalidate = 3600`
   - Add: `generateStaticParams()` - fetch top 100 products
   - Pre-build popular products at build time
   - Test product detail loading

4. [ ] Test ISR Behavior
   - Local: Verify revalidation works
   - Staging: Monitor cache behavior
   - Production: Track API call reduction

### Task Group 3: Image API Modernization (2 days)

1. [ ] Fix Deprecated Image API
   - Find all: `layout="fill"` → replace with `fill`
   - Find all: `objectFit="cover"` → replace with `style={{ objectFit: 'cover' }}`
   - Files to audit:
     - `components/product-row.tsx`
     - `components/slider.tsx`
     - `app/product/[slug]/page.tsx`
     - `components/product-card.tsx`

2. [ ] Add Sizes Prop to Responsive Images
   ```typescript
   // All images need appropriate sizes
   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   ```

3. [ ] Add Meaningful Alt Text
   - Replace: `alt="Product Image"` → `alt={product.name}`
   - Ensures accessibility + SEO

4. [ ] Add Blur Placeholders
   - Use existing shimmer utility where available
   - Format: `blurDataURL={blurredImage}`
   - For all product images

5. [ ] Implement Priority Logic
   ```typescript
   // Above-fold images
   priority={index < 4}  // First 4 products

   // Below-fold images
   loading={index >= 4 ? 'lazy' : 'auto'}
   ```

### Task Group 4: Web Vitals Monitoring (2 days)

1. [ ] Create `lib/web-vitals.ts`
   - Install: `npm install web-vitals`
   - Import: getCLS, getFID, getFCP, getLCP, getTTFB
   - Export: reportWebVitals() function

2. [ ] Add to `app/layout.tsx`
   - Import reportWebVitals
   - useEffect hook to initialize
   - Send metrics to analytics

3. [ ] Setup Performance Monitoring
   - Google Analytics integration (if available)
   - Vercel Analytics (if on Vercel)
   - Custom metrics dashboard

4. [ ] Create Performance Budget
   - Main bundle: <250KB
   - Next bundle: <150KB
   - LCP: <2.5s
   - CLS: <0.1

### Task Group 5: Testing & Measurement (1 day)

1. [ ] Run Lighthouse Audits (Before)
   - Desktop audit: `lighthouse https://localhost:3000`
   - Mobile audit: `lighthouse https://localhost:3000 --config-path=lighthouse-mobile.json`
   - Document baseline metrics

2. [ ] Implement All Optimizations
   - CDN, dependencies, ISR, images, monitoring
   - Test locally: `npm run build && npm run start`

3. [ ] Run Lighthouse Audits (After)
   - Same audits as baseline
   - Compare performance scores
   - Document improvements

4. [ ] Bundle Analysis
   - Run: `ANALYZE=true npm run build`
   - Review bundle size breakdown
   - Verify 70KB+ reduction

5. [ ] Monitor in Staging/Production
   - Deploy to staging with all changes
   - Monitor metrics for 24 hours
   - Check for any regressions
   - Deploy to production

---

## Phase 3: Validation & QA

### Performance Metrics Checklist
- [ ] LCP improved by 30% (2.8s → <2.0s)
- [ ] API calls reduced by 80% (ISR effectiveness)
- [ ] Bundle size reduced by 70KB
- [ ] Lighthouse score 92+ (performance)
- [ ] Core Web Vitals passing

### Functionality Checklist
- [ ] Search/filter still works
- [ ] Product pages load correctly
- [ ] Cart operations unaffected
- [ ] Checkout flow unchanged
- [ ] No 404 errors from missing images

### Browser Compatibility
- [ ] Desktop browsers (Chrome, Firefox, Safari)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] No layout shifts or visual regressions

---

## Dependencies & Installation

### New npm Packages
```bash
npm install --save-dev @next/bundle-analyzer web-vitals
npm uninstall styled-components sanity-plugin-markdown
npm prune
```

### Configuration Files
- Update `sanity/lib/client.ts` for CDN
- Update `next.config.mjs` for bundle analyzer
- Create `lib/web-vitals.ts` for monitoring

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| ISR causes stale content | Use 60s revalidation, manual revalidation available |
| Images load slower on slow networks | Use blur placeholder for perceived speed |
| Bundle analyzer reveals more issues | Prioritize by impact on LCP/TTI |
| Performance regressions post-deploy | Monitor metrics continuously, setup alerts |

---

## Success Criteria Verification

- ✅ Sanity CDN enabled (2x faster queries)
- ✅ Unused dependencies removed (70KB reduction)
- ✅ ISR implemented on products/categories (80% fewer API calls)
- ✅ Image API modernized (all deprecated props removed)
- ✅ Web Vitals monitoring active
- ✅ LCP <2.5s (30% improvement)
- ✅ Lighthouse score 92+
- ✅ No functionality regressions

---

## Rollout Plan

1. **Day 1**: CDN, dependencies, bundle analysis (quick wins)
2. **Day 2**: ISR implementation and testing
3. **Days 3-4**: Image optimization
4. **Day 5**: Web Vitals monitoring and validation
5. **Week 2**: Deploy to staging, monitor, deploy to production

---

## Performance Monitoring Strategy

### Continuous Monitoring
- Setup alerts for performance regressions
- Monitor real-world metrics (not just lab tests)
- Track Core Web Vitals over time
- Compare against industry benchmarks

### Quarterly Reviews
- Run comprehensive Lighthouse audits
- Analyze bundle size trends
- Identify new optimization opportunities
- Update performance targets

### Documentation
- Record baseline metrics (before optimization)
- Document all changes made
- Report improvements achieved
- Share learnings with team

---

## Notes

- Performance improvements compound (CDN + ISR + Images = significant overall improvement)
- Monitor real-world metrics, not just lab metrics
- Balance optimization effort with user experience
- Plan quarterly performance optimization sprints
- Keep performance budget enforced in CI/CD

