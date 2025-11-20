# Performance Optimization Spec

**ID**: PERF-001
**Priority**: MEDIUM
**Estimated Effort**: 1 week
**Success Criteria**: 30% improvement in LCP, 50% reduction in API calls, bundle size reduced by 70KB

---

## Overview

This spec addresses performance bottlenecks identified in PROJECT_AUDIT.md. Focuses on optimizing images, enabling CDN caching, implementing ISR, removing unused dependencies, and improving bundle size.

---

## Goals

- **Primary**: Reduce Largest Contentful Paint (LCP) by 30%
- **Secondary**: Reduce API calls to Sanity by 50%
- **Tertiary**: Reduce bundle size by 70KB
- **Quaternary**: Improve Core Web Vitals (LCP, FID, CLS)

---

## Success Criteria

### Performance Targets
- [ ] LCP: <2.5s (current: ~2.5s)
- [ ] FCP: <1.2s (current: ~1.2s)
- [ ] CLS: <0.1 (current: <0.1 ✓)
- [ ] TTI: <3.5s (current: ~3s ✓)

### Bundle Size Targets
- [ ] Remove styled-components (16KB savings)
- [ ] Remove unused sanity-plugin-markdown (50KB savings)
- [ ] Tree-shake Radix UI imports (5KB savings)
- [ ] Total: 70KB+ reduction

### API & Caching Targets
- [ ] Enable Sanity CDN (2x faster queries)
- [ ] Implement ISR on static pages (80% fewer API calls)
- [ ] Cache products page for 60s
- [ ] Cache category pages for 60s

### Image Optimization Targets
- [ ] Fix deprecated Image API
- [ ] Add sizes prop to all responsive images
- [ ] Implement blur placeholder on all product cards
- [ ] Use next/image priority prop strategically

---

## Tasks

### 1. Enable Sanity CDN

**Current Issue**: `sanity/lib/client.ts` disables CDN
```typescript
useCdn: false  // ❌ Fetches from origin every time
```

**Why**: Public content should use CDN for 50%+ faster queries

**Implementation**:

1. **Update `sanity/lib/client.ts`**
   ```typescript
   import { createClient } from 'next-sanity';

   export const client = createClient({
     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
     apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
     useCdn: true,  // ✅ Enable CDN for public content
   });

   // For admin queries (mutations), create separate client
   export const adminClient = createClient({
     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
     apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
     token: process.env.SANITY_API_WRITE_TOKEN,
     useCdn: false,  // Never cache admin operations
   });
   ```

2. **Update data fetchers** to use appropriate client
   ```typescript
   // Public data - use CDN
   export async function fetchProducts() {
     return client.fetch(productQuery);
   }

   // Admin operations - no cache
   export async function createProduct(data: any) {
     return adminClient.create({ _type: 'product', ...data });
   }
   ```

**Performance Impact**: ~50% faster Sanity queries
**Effort**: 2 hours

---

### 2. Implement ISR (Incremental Static Regeneration)

**Current Issue**: Dynamic routes fetch on every request
```typescript
// ❌ Dynamic - every request fetches from Sanity
export default async function ProductsPage() {
  const products = await getProducts();
}
```

**Solution**: Cache with revalidation
```typescript
// ✅ Static with revalidation
export const revalidate = 60;  // Revalidate every 60 seconds

export default async function ProductsPage() {
  const products = await getProducts();
}
```

**Implementation Steps**:

1. **Products Page** - `app/products/page.tsx`
   ```typescript
   export const revalidate = 60;  // Cache for 60 seconds

   export default async function ProductsPage({
     searchParams,
   }: {
     searchParams: Record<string, string>;
   }) {
     // Products fetched once, cached, revalidated after 60s
     const products = await fetchProducts(/* ... */);

     return (
       <div>
         {/* ... */}
       </div>
     );
   }
   ```

2. **Category Pages** - `app/category/[slug]/page.tsx`
   ```typescript
   export const revalidate = 60;

   export async function generateStaticParams() {
     // Pre-build all category pages at build time
     const categories = await fetchCategories();
     return categories.map((cat) => ({
       slug: cat.slug,
     }));
   }

   export default async function CategoryPage({ params }) {
     const products = await fetchProductsByCategory(params.slug);
     // ...
   }
   ```

3. **Product Detail Pages** - `app/product/[slug]/page.tsx`
   ```typescript
   export const revalidate = 3600;  // Cache for 1 hour (less frequent updates)

   export async function generateStaticParams() {
     // Pre-build popular products
     const products = await fetchProducts();
     return products.slice(0, 100).map((p) => ({
       slug: p.slug.current,
     }));
   }

   export default async function ProductPage({ params }) {
     const product = await fetchProductBySlug(params.slug);
     // ...
   }
   ```

**Performance Impact**: 80% reduction in API calls to Sanity
**Effort**: 1 day

---

### 3. Fix Deprecated Image API

**Current Issues**:
- `layout="fill"` (deprecated)
- `objectFit="cover"` (deprecated)
- Missing `sizes` prop
- Generic alt text

**Files to Fix**:
- `components/product-row.tsx`
- `components/slider.tsx`
- `app/product/[slug]/page.tsx`

**Implementation** - `components/product-row.tsx`:

**Before**:
```typescript
<Image
  src={image}
  alt="Product Image"
  layout="fill"
  objectFit="cover"
/>
```

**After**:
```typescript
<Image
  src={image}
  alt={product.name}  // Meaningful alt text
  fill
  style={{ objectFit: 'cover' }}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  data-testid="product-image"
/>
```

**Explanation**:
- `fill` instead of `layout="fill"`
- `style={{ objectFit: 'cover' }}` instead of `objectFit` prop
- `sizes` tells Next.js optimal image size for each breakpoint
- Meaningful `alt` text for accessibility
- `loading="lazy"` for images below the fold

**Update All Product Images** - Fix 20+ Image components

```typescript
// Generic pattern for all image fixes:
<Image
  src={urlForImage(product.image).url()}
  alt={product.name}  // ✅ Meaningful
  fill  // ✅ New API
  style={{ objectFit: 'cover' }}  // ✅ New API
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"  // ✅ Responsive
  loading="lazy"  // ✅ Lazy load
  priority={isAboveFold}  // ✅ Priority for LCP images
/>
```

**Performance Impact**: ~15% improvement in LCP (better image loading)
**Effort**: 1 day

---

### 4. Remove Unused Dependencies

**Identified Unused Packages**:

1. **styled-components@6.1.8** - 16KB
   - Using Tailwind CSS instead
   - No styled-components imports in codebase
   - Safe to remove

2. **sanity-plugin-markdown@4.1.2** - 50KB
   - Check if actually used in Sanity Studio
   - If not, remove

**Verification Steps**:

```bash
# Search for imports
grep -r "styled-components" src/
grep -r "sanity-plugin-markdown" src/

# If no results, safe to remove
npm uninstall styled-components
npm uninstall sanity-plugin-markdown
```

**Implementation**:
```bash
npm uninstall styled-components sanity-plugin-markdown
npm prune  # Remove from node_modules
```

**Performance Impact**: 70KB+ bundle reduction
**Effort**: 30 minutes

---

### 5. Tree-Shake Radix UI Imports

**Current State**: Importing entire modules
```typescript
// ❌ Imports entire Radix module
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@radix-ui/react-navigation-menu';
```

**Better Practice**: Next.js automatically tree-shakes, but ensure clean imports
```typescript
// ✅ Clean imports - tree-shakeable
import {
  NavigationMenu,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';

// Avoid:
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
```

**Check All Radix UI Imports**:
- `components/ui/` - Already good
- `site-header.tsx` - Review imports
- `product-filter.tsx` - Review imports

**Performance Impact**: 5KB+ savings
**Effort**: 2 hours

---

### 6. Image Optimization - Blur Placeholder

**Current State**: Some images have blur placeholder
```typescript
// product/[slug]/page.tsx - Good
const blurredImage = await shimmer(200, 200);
```

**Missing**: Product cards don't have blur placeholder

**Implementation** - Add to all product cards:

```typescript
import { shimmer } from '@/lib/image';

export async function ProductCard({ product }: ProductCardProps) {
  // Generate blur placeholder at build time
  const blurredImage = await shimmer(200, 200);

  return (
    <Image
      src={urlForImage(product.image).url()}
      alt={product.name}
      fill
      placeholder="blur"
      blurDataURL={blurredImage}
      loading="lazy"
    />
  );
}
```

**Note**: For server components, shimmer generation is fine. For client components, pre-generate and pass as prop.

**Performance Impact**: Improved perceived loading (better CLS)
**Effort**: 1 day

---

### 7. Next.js Image Priority Optimization

**Issue**: All images loaded equally; should prioritize LCP images

**Strategy**:
- `priority={true}` for above-fold hero images
- `priority={false}` (default) for below-fold images
- `loading="lazy"` for definitely below-fold images

**Implementation**:

```typescript
// Hero image - above fold, LCP candidate
<Image
  src={heroImage}
  alt="Hero"
  priority  // ✅ Preload
  sizes="100vw"
/>

// Product grid - first few are above fold
{products.map((product, index) => (
  <Image
    key={product._id}
    src={productImage}
    alt={product.name}
    priority={index < 4}  // ✅ Prioritize first 4 products
    loading={index >= 4 ? 'lazy' : 'auto'}  // ✅ Lazy load rest
  />
))}
```

**Performance Impact**: Better LCP (prioritize critical images)
**Effort**: 1 day

---

### 8. Bundle Analysis & Monitoring

**Setup Bundle Analysis**:

```bash
npm install --save-dev @next/bundle-analyzer
```

**Create `next.config.mjs`** with analyzer:
```typescript
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

**Analyze Bundle**:
```bash
ANALYZE=true npm run build
```

**Performance Impact**: Identifies future optimization opportunities
**Effort**: 30 minutes

---

### 9. Performance Monitoring

**Setup Web Vitals Monitoring**:

Create `lib/web-vitals.ts`:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals() {
  getCLS((metric) => console.log('CLS:', metric));
  getFID((metric) => console.log('FID:', metric));
  getFCP((metric) => console.log('FCP:', metric));
  getLCP((metric) => console.log('LCP:', metric));
  getTTFB((metric) => console.log('TTFB:', metric));
}
```

Use in `app/layout.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export default function RootLayout() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  // ...
}
```

**Monitor in Production**:
- Use Google Analytics + Web Vitals integration
- Use Vercel Analytics if deployed on Vercel
- Set up alerts for performance regressions

**Performance Impact**: Visibility into real-world performance
**Effort**: 2 hours

---

## Implementation Timeline

### Day 1: Quick Wins (4-6 hours)
- [ ] Remove unused dependencies (30 min)
- [ ] Enable Sanity CDN (1 hour)
- [ ] Setup bundle analyzer (30 min)
- [ ] Fix Image API in 5 key components (2-3 hours)

### Day 2: Caching (6-8 hours)
- [ ] Implement ISR on products page (2 hours)
- [ ] Implement ISR on category pages (2 hours)
- [ ] Implement ISR on product detail pages (2 hours)
- [ ] Test and verify (1-2 hours)

### Day 3-4: Image Optimization (6-8 hours)
- [ ] Add blur placeholder to all product cards (2-3 hours)
- [ ] Update all Image components with priority logic (2-3 hours)
- [ ] Add sizes prop to all responsive images (1-2 hours)
- [ ] Test performance improvements (1-2 hours)

### Day 5: Monitoring (2-4 hours)
- [ ] Setup Web Vitals monitoring (1-2 hours)
- [ ] Run bundle analysis (30 min)
- [ ] Document performance improvements (1 hour)

---

## Testing & Measurement

### Before & After Metrics

**Lighthouse Audit** (Desktop, Chrome):
```
Before:
- Performance: 82
- LCP: 2.8s
- FCP: 1.4s
- CLS: 0.05
- TTI: 3.2s
- Bundle: 580KB

After:
- Performance: 92+
- LCP: <2.0s (30% improvement)
- FCP: <1.2s
- CLS: <0.1
- TTI: <3.0s
- Bundle: 510KB (70KB reduction)
```

**Run Audits**:
```bash
# Lighthouse audit via CLI
npm install -g lighthouse
lighthouse https://localhost:3000 --view

# Or use DevTools (F12 → Lighthouse tab)
```

**Performance Budget** (set expectations):
```json
{
  "bundles": [
    { "name": "main", "maxSize": "250kb" },
    { "name": "next", "maxSize": "150kb" }
  ]
}
```

---

## Monitoring Setup

### Vercel Analytics (if deployed on Vercel)
- Automatically captures Core Web Vitals
- Provides performance insights
- Alerts on regressions

### Google Analytics + Web Vitals
- Track real-world performance
- Set goals for Core Web Vitals
- Compare to competitors

### Custom Monitoring
- Use `lib/web-vitals.ts` to send metrics to analytics
- Track over time
- Alert if metrics degrade

---

## Success Metrics

### Performance Improvements
- ✅ LCP improved by 30% (2.8s → <2.0s)
- ✅ API calls reduced by 80% (ISR caching)
- ✅ Bundle size reduced by 70KB
- ✅ Lighthouse score 92+
- ✅ Core Web Vitals passing

### Operational Metrics
- ✅ All automated tests pass
- ✅ No manual performance regression
- ✅ Monitoring active in production
- ✅ Documentation updated

---

## Rollout Plan

1. **Develop** - Test changes locally
2. **Staging** - Deploy to staging, run Lighthouse audits
3. **Production** - Deploy changes incrementally
4. **Monitor** - Track real-world metrics for 1 week
5. **Optimize** - Use monitoring insights for further optimizations

---

## Future Opportunities

- Implement HTTP/2 Server Push for critical assets
- Consider font optimization (WOFF2 only, avoid system fonts)
- Implement edge caching with middleware
- Consider dynamic imports for large components
- Setup performance budget enforcement in CI/CD

---

## Notes

- Performance is ongoing; plan quarterly optimization sprints
- Monitor real-world metrics, not just lab metrics
- Balance user experience with performance
- Document all changes for team learning
