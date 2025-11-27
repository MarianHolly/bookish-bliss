# Code Quality Refactoring Spec

**ID**: QUALITY-001
**Priority**: HIGH
**Estimated Effort**: 2 weeks
**Success Criteria**: All monolithic components extracted, error handling consistent, type safety improved to 100%

---

## Overview

This spec addresses code quality issues identified in the PROJECT_AUDIT.md. Focuses on component extraction, improved error handling, type safety, and separation of concerns to make the codebase more maintainable and testable.

**Aligned with Constitution v1.1.0**: VIII. Code Quality & Testability

---

## Goals

- **Primary**: Extract monolithic components into smaller, testable units
- **Secondary**: Improve error handling consistency across all code paths
- **Tertiary**: Achieve 100% type safety (eliminate `any` types)
- **Quaternary**: Clear separation of concerns (queries, fetching, rendering)

---

## Success Criteria

### Component Extraction Checklist
- [ ] site-header.tsx (212 lines) → split into 6 components
- [ ] category/[slug]/page.tsx → extract CategoryProductCard component
- [ ] products/page.tsx → extract product search/filter components

### Error Handling Checklist
- [ ] All API routes have try-catch blocks
- [ ] Cart operations have error recovery
- [ ] Sanity query failures handled gracefully
- [ ] User-friendly error messages everywhere

### Type Safety Checklist
- [ ] No `any` types remaining
- [ ] Stripe response types defined
- [ ] GROQ query result types defined
- [ ] API request/response types defined

### Code Organization Checklist
- [ ] `lib/queries.ts` - GROQ query builders
- [ ] `lib/sanity-fetchers.ts` - Sanity data fetching
- [ ] `lib/stripe.ts` - Stripe client & operations
- [ ] `lib/errors.ts` - Error handling utilities

---

## Refactoring Tasks

### 1. Extract Header Components

**Current**: site-header.tsx (212 lines)
```
Contains:
- MainNav
- NavMenu
- ListItem
- CommandMenu
- CartNav
- SearchBar
```

**Target Structure**:
```
components/
├── site-header.tsx (wrapper, ~40 lines)
├── main-nav.tsx (~44 lines)
├── nav-menu.tsx (~16 lines)
├── command-menu.tsx (~70 lines)
├── cart-nav.tsx (~20 lines)
└── search-bar.tsx (~30 lines)
```

**Implementation Steps**:

1. **Extract CartNav** → `components/cart-nav.tsx`
   ```typescript
   import { ShoppingCart } from 'lucide-react';
   import Link from 'next/link';
   import { useCart } from '@/context';

   export function CartNav() {
     const { cart } = useCart();
     const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

     return (
       <Link href="/cart" className="relative">
         <ShoppingCart className="w-6 h-6" />
         {itemCount > 0 && (
           <span
             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
             data-testid="cart-count"
           >
             {itemCount}
           </span>
         )}
       </Link>
     );
   }
   ```

2. **Extract SearchBar** → `components/search-bar.tsx`
   ```typescript
   'use client';

   import { useState } from 'react';
   import { useRouter } from 'next/navigation';
   import { Input } from '@/components/ui/input';

   export function SearchBar() {
     const router = useRouter();
     const [query, setQuery] = useState('');

     const handleSearch = (e: React.FormEvent) => {
       e.preventDefault();
       if (query.trim()) {
         router.push(`/products?search=${encodeURIComponent(query)}`);
       }
     };

     return (
       <form onSubmit={handleSearch} className="flex gap-2">
         <Input
           type="text"
           placeholder="Search books..."
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           data-testid="search-input"
         />
         <button type="submit" data-testid="search-button">
           Search
         </button>
       </form>
     );
   }
   ```

3. **Extract CommandMenu** → `components/command-menu.tsx`
   ```typescript
   'use client';

   import { useEffect, useState } from 'react';
   import { Command } from 'cmdk';
   // ... command menu logic
   ```

4. **Extract MainNav** → `components/main-nav.tsx`
   ```typescript
   import {
     NavigationMenu,
     NavigationMenuList,
     NavigationMenuItem,
     NavigationMenuLink,
   } from '@/components/ui/navigation-menu';
   // ... main nav logic
   ```

5. **Update site-header.tsx** → Only compose components
   ```typescript
   import { CartNav } from './cart-nav';
   import { SearchBar } from './search-bar';
   import { CommandMenu } from './command-menu';
   import { MainNav } from './main-nav';
   import { Logo } from './logo';

   export function SiteHeader() {
     return (
       <header className="border-b">
         <div className="container flex justify-between items-center py-4">
           <Logo />
           <MainNav />
           <div className="flex gap-4">
             <SearchBar />
             <CommandMenu />
             <CartNav />
           </div>
         </div>
       </header>
     );
   }
   ```

**Acceptance Criteria**:
- Each component <75 lines
- Components testable in isolation
- No prop drilling deeper than 2 levels
- site-header.tsx purely compositional

---

### 2. Extract Product-Related Components

**Current**: app/products/page.tsx (120 lines)
```
Contains:
- getProducts() function
- getCategories() function
- Search/filter logic
- Layout rendering
```

**Target Structure**:
```
lib/
├── queries.ts (GROQ builders)
└── sanity-fetchers.ts (data fetching)

components/
├── product-search-filter.tsx
├── product-sort.tsx
└── product-list.tsx

app/products/
└── page.tsx (render only)
```

**Implementation Steps**:

1. **Create `lib/queries.ts`** - GROQ query builders
   ```typescript
   import groq from 'groq-tag';

   export const productQueries = {
     getAll: (category?: string, publisher?: string, search?: string) => groq`
       *[_type == "product"
         ${category ? `&& references("${category}")` : ''}
         ${publisher ? `&& references("${publisher}")` : ''}
         ${search ? `&& name match $search` : ''}
       ] {
         _id,
         name,
         price,
         author,
         "slug": slug.current,
         image,
       }
     `,

     getBySlug: (slug: string) => groq`
       *[_type == "product" && slug.current == $slug][0] {
         _id,
         name,
         price,
         author,
         description,
         body,
         image,
         isbn,
         publisher,
       }
     `,

     getCategories: () => groq`
       *[_type == "category"] {
         _id,
         title,
         "slug": slug.current,
       }
     `,
   };
   ```

2. **Create `lib/sanity-fetchers.ts`** - Data fetching layer
   ```typescript
   import { client } from '@/sanity/lib/client';
   import { productQueries } from './queries';
   import type { Product, Category } from './interface';

   export async function fetchProducts(
     category?: string,
     publisher?: string,
     search?: string
   ): Promise<Product[]> {
     try {
       const query = productQueries.getAll(category, publisher, search);
       const params = search ? { search } : {};
       const products = await client.fetch(query, params);
       return products;
     } catch (error) {
       console.error('Failed to fetch products', error);
       throw new Error('Failed to load products. Please try again later.');
     }
   }

   export async function fetchProductBySlug(slug: string): Promise<Product | null> {
     try {
       const query = productQueries.getBySlug(slug);
       const product = await client.fetch(query, { slug });
       return product || null;
     } catch (error) {
       console.error('Failed to fetch product', error);
       throw new Error('Failed to load product. Please try again later.');
     }
   }

   export async function fetchCategories(): Promise<Category[]> {
     try {
       const query = productQueries.getCategories();
       const categories = await client.fetch(query);
       return categories;
     } catch (error) {
       console.error('Failed to fetch categories', error);
       throw new Error('Failed to load categories. Please try again later.');
     }
   }
   ```

3. **Create `components/product-search-filter.tsx`**
   ```typescript
   'use client';

   import { useRouter, useSearchParams } from 'next/navigation';
   import { Input } from '@/components/ui/input';
   import { Checkbox } from '@/components/ui/checkbox';

   interface ProductSearchFilterProps {
     categories: Category[];
     publishers: Publisher[];
   }

   export function ProductSearchFilter({
     categories,
     publishers,
   }: ProductSearchFilterProps) {
     const router = useRouter();
     const searchParams = useSearchParams();

     const handleSearch = (query: string) => {
       const params = new URLSearchParams(searchParams);
       if (query) {
         params.set('search', query);
       } else {
         params.delete('search');
       }
       router.push(`/products?${params.toString()}`);
     };

     const handleCategoryChange = (categoryId: string, checked: boolean) => {
       const params = new URLSearchParams(searchParams);
       if (checked) {
         params.set('category', categoryId);
       } else {
         params.delete('category');
       }
       router.push(`/products?${params.toString()}`);
     };

     return (
       <div className="space-y-4">
         <Input
           type="text"
           placeholder="Search products..."
           onChange={(e) => handleSearch(e.target.value)}
           defaultValue={searchParams.get('search') || ''}
           data-testid="search-input"
         />

         <div className="space-y-2">
           <h3 className="font-semibold">Categories</h3>
           {categories.map((category) => (
             <label key={category._id} className="flex items-center gap-2">
               <Checkbox
                 checked={searchParams.get('category') === category._id}
                 onCheckedChange={(checked) =>
                   handleCategoryChange(category._id, checked as boolean)
                 }
               />
               {category.title}
             </label>
           ))}
         </div>
       </div>
     );
   }
   ```

4. **Refactor `app/products/page.tsx`**
   ```typescript
   import { fetchProducts, fetchCategories } from '@/lib/sanity-fetchers';
   import { ProductSearchFilter } from '@/components/product-search-filter';
   import { ProductList } from '@/components/product-list';
   import { ProductSort } from '@/components/product-sort';

   interface ProductsPageProps {
     searchParams: {
       search?: string;
       category?: string;
       publisher?: string;
       sort?: string;
     };
   }

   export default async function ProductsPage({
     searchParams,
   }: ProductsPageProps) {
     const [products, categories] = await Promise.all([
       fetchProducts(
         searchParams.category,
         searchParams.publisher,
         searchParams.search
       ),
       fetchCategories(),
     ]);

     return (
       <div className="container py-8">
         <h1>All Books</h1>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <aside>
             <ProductSearchFilter categories={categories} />
           </aside>

           <main className="md:col-span-3">
             <ProductSort />
             <ProductList products={products} />
           </main>
         </div>
       </div>
     );
   }
   ```

**Acceptance Criteria**:
- `lib/queries.ts` contains all GROQ builders
- `lib/sanity-fetchers.ts` handles all data fetching
- `app/products/page.tsx` is purely compositional
- All errors caught and handled gracefully

---

### 3. Extract Category Page Component

**Current**: app/category/[slug]/page.tsx (126 lines)
```
Contains:
- Category-specific product card (embedded)
- Data fetching
- Layout rendering
```

**Target Structure**:
```
components/
└── category-product-card.tsx

app/category/[slug]/
└── page.tsx (render only)
```

**Implementation Steps**:

1. **Extract `components/category-product-card.tsx`**
   ```typescript
   import Image from 'next/image';
   import Link from 'next/link';
   import { Product } from '@/lib/interface';
   import { AddToCartButton } from '@/components/add-to-cart-button';
   import { urlForImage } from '@/sanity/lib/image';

   interface CategoryProductCardProps {
     product: Product;
   }

   export function CategoryProductCard({ product }: CategoryProductCardProps) {
     return (
       <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
         {product.image && (
           <div className="relative h-48 w-full">
             <Image
               src={urlForImage(product.image).url()}
               alt={product.name}
               fill
               className="object-cover"
             />
           </div>
         )}

         <div className="p-4">
           <h3 className="font-semibold">{product.name}</h3>
           <p className="text-gray-600">{product.author}</p>
           <p className="text-lg font-bold mt-2">€{product.price}</p>

           <div className="flex gap-2 mt-4">
             <Link
               href={`/product/${product.slug}`}
               className="flex-1 text-center border rounded px-4 py-2 hover:bg-gray-100"
             >
               View
             </Link>
             <AddToCartButton product={product} />
           </div>
         </div>
       </div>
     );
   }
   ```

2. **Simplify `app/category/[slug]/page.tsx`**
   ```typescript
   import { fetchProductsByCategory } from '@/lib/sanity-fetchers';
   import { CategoryProductCard } from '@/components/category-product-card';

   interface CategoryPageProps {
     params: { slug: string };
   }

   export default async function CategoryPage({ params }: CategoryPageProps) {
     const products = await fetchProductsByCategory(params.slug);

     return (
       <div className="container py-8">
         <h1 className="text-3xl font-bold mb-6">{params.slug}</h1>

         {products.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {products.map((product) => (
               <CategoryProductCard key={product._id} product={product} />
             ))}
           </div>
         ) : (
           <p className="text-gray-600">No products found</p>
         )}
       </div>
     );
   }
   ```

**Acceptance Criteria**:
- CategoryProductCard is <60 lines
- Page is purely compositional
- No duplicated component code

---

### 4. Improve Error Handling

**Current Issues**:
- Missing try-catch in `app/api/session/route.ts`
- Generic error messages
- No error recovery strategies

**Implementation Steps**:

1. **Create `lib/errors.ts`** - Error handling utilities
   ```typescript
   export class ApiError extends Error {
     constructor(
       public statusCode: number,
       message: string,
       public details?: unknown
     ) {
       super(message);
       this.name = 'ApiError';
     }
   }

   export function handleApiError(error: unknown) {
     if (error instanceof ApiError) {
       return {
         status: error.statusCode,
         message: error.message,
       };
     }

     if (error instanceof Error) {
       console.error('Unexpected error:', error.message);
       return {
         status: 500,
         message: 'An unexpected error occurred. Please try again later.',
       };
     }

     console.error('Unknown error:', error);
     return {
       status: 500,
       message: 'An unexpected error occurred. Please try again later.',
     };
   }

   export function logError(context: string, error: unknown) {
     if (error instanceof Error) {
       console.error(`[${context}] ${error.message}`);
       if (process.env.NODE_ENV === 'development') {
         console.error(error.stack);
       }
     } else {
       console.error(`[${context}] Unknown error:`, error);
     }
   }
   ```

2. **Update `app/api/session/route.ts`**
   ```typescript
   import { Stripe } from 'stripe';
   import { assertEnv } from '@/lib/env';
   import { handleApiError, ApiError } from '@/lib/errors';

   const stripe = new Stripe(assertEnv('STRIPE_SECRET_KEY'), {
     apiVersion: '2024-04-10',
   });

   export async function POST(request: Request) {
     try {
       const { sessionId } = await request.json();

       if (!sessionId || typeof sessionId !== 'string') {
         throw new ApiError(400, 'Invalid session ID');
       }

       const session = await stripe.checkout.sessions.retrieve(sessionId);

       if (!session) {
         throw new ApiError(404, 'Session not found');
       }

       return Response.json({
         status: session.payment_status,
         customer: session.customer_details,
       });
     } catch (error) {
       const { status, message } = handleApiError(error);
       return Response.json({ error: message }, { status });
     }
   }
   ```

3. **Update `components/cart-summary.tsx`** - Error handling
   ```typescript
   'use client';

   import { useState } from 'react';
   import { useRouter } from 'next/navigation';
   import { useCart } from '@/context';
   import { AlertCircle } from 'lucide-react';

   export function CartSummary() {
     const { cart, resetCart } = useCart();
     const router = useRouter();
     const [error, setError] = useState<string | null>(null);
     const [loading, setLoading] = useState(false);

     const handleCheckout = async () => {
       try {
         setLoading(true);
         setError(null);

         const response = await fetch('/api/checkout', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ products: cart }),
         });

         if (!response.ok) {
           const data = await response.json();
           throw new Error(data.error || 'Checkout failed');
         }

         const { url } = await response.json();
         router.push(url);
       } catch (error) {
         const message =
           error instanceof Error ? error.message : 'Checkout failed. Try again.';
         setError(message);
       } finally {
         setLoading(false);
       }
     };

     if (error) {
       return (
         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
           <AlertCircle className="w-5 h-5 text-red-600" />
           <div>
             <h3 className="font-semibold text-red-800">Checkout Error</h3>
             <p className="text-red-700">{error}</p>
             <button
               onClick={() => handleCheckout()}
               className="mt-2 text-red-700 underline hover:text-red-800"
               data-testid="retry-button"
             >
               Try Again
             </button>
           </div>
         </div>
       );
     }

     // ... rest of component
   }
   ```

**Acceptance Criteria**:
- All API routes have try-catch
- Error messages user-friendly
- No sensitive data in error messages
- Error recovery options provided

---

### 5. Eliminate `any` Types

**Current Issue** - lib/interface.ts:11:
```typescript
body: any[];  // ❌ Should be typed
```

**Fix**:
```typescript
import type { PortableTextBlock } from '@portabletext/types';

export interface Product {
  _id: string;
  name: string;
  price: number;
  author: string;
  body?: PortableTextBlock[];  // ✅ Properly typed
  image?: SanityImageSource;
  slug: { current: string };
  // ...
}
```

**Define Stripe Types** - `lib/stripe-types.ts`:
```typescript
export interface CheckoutSession {
  id: string;
  url: string;
  payment_status: 'paid' | 'unpaid';
  customer_details?: {
    email?: string;
    address?: {
      country?: string;
      postal_code?: string;
    };
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  metadata?: Record<string, string>;
}
```

**Acceptance Criteria**:
- Zero `any` types in codebase
- All Stripe responses typed
- All GROQ query results typed

---

## Implementation Steps (Timeline)

### Week 1: Component Extraction
- [ ] Extract CartNav, SearchBar, CommandMenu, MainNav (2 days)
- [ ] Extract CategoryProductCard (1 day)
- [ ] Create lib/queries.ts and lib/sanity-fetchers.ts (2 days)

### Week 2: Error Handling & Types
- [ ] Create lib/errors.ts and improve error handling (2 days)
- [ ] Add missing types and eliminate `any` (2 days)
- [ ] Update all components with extracted logic (1 day)

---

## Testing Strategy

**Unit Tests** (included in TEST-001):
- Test extracted components in isolation
- Mock dependencies
- Verify prop passing

**Integration Tests**:
- Test component compositions
- Verify data flows correctly
- Error handling paths

**E2E Tests** (TEST-002):
- Verify refactored components work in full user flows
- No regression in functionality

---

## Success Metrics

- ✅ site-header.tsx reduced from 212 to ~40 lines
- ✅ products/page.tsx reduced from 120 to ~30 lines
- ✅ All monolithic components extracted
- ✅ 100% type safety (zero `any` types)
- ✅ All error handling consistent
- ✅ All tests pass post-refactoring
- ✅ No functionality regressions

---

## Notes

- Refactor incrementally; test after each change
- Keep backwards compatibility during refactoring
- Update related tests as components change
- Consider git bisect if issues arise
