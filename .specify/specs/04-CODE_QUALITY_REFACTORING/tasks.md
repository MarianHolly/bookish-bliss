# Tasks: Code Quality Refactoring

**Spec**: [04-CODE_QUALITY_REFACTORING.md](04-CODE_QUALITY_REFACTORING.md)
**Plan**: [plan.md](plan.md)
**Priority**: HIGH
**Total Effort**: 2 weeks
**Status**: Ready for Implementation

---

## Task Groups & Dependencies

```
Phase 1: Utility Libraries (2 days)
├── lib/queries.ts
├── lib/sanity-fetchers.ts
├── lib/errors.ts
├── lib/interface.ts updates
└── lib/stripe-types.ts

Phase 2: Header Extraction (2 days)
├── components/cart-nav.tsx
├── components/search-bar.tsx
├── components/command-menu.tsx
├── components/main-nav.tsx
└── site-header.tsx (refactored)

Phase 3: Products Page Refactoring (2 days)
├── components/product-search-filter.tsx
├── components/product-sort.tsx
├── components/product-list.tsx
└── app/products/page.tsx (refactored)

Phase 4: Category Page Refactoring (1 day)
├── components/category-product-card.tsx
└── app/category/[slug]/page.tsx (refactored)

Phase 5: Error Handling (2 days)
├── Update API routes
├── Update components
└── Consistent logging

Phase 6: Testing (2 days)
├── Unit tests for components
├── Integration tests
└── E2E validation

Phase 7: Final Review (1 day)
├── Code review
├── Type checking
└── No regressions
```

---

## Phase 1: Utility Libraries (2 days)

### Task 1.1: Create `lib/queries.ts`
**Effort**: 1.5 hours
**Files Created**: `lib/queries.ts`

**Implementation**:
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

  getByCategory: (slug: string) => groq`
    *[_type == "product" && references(*[_type=="category" && slug.current==$slug]._id)] {
      _id,
      name,
      price,
      author,
      "slug": slug.current,
      image,
    }
  `,
};

export const categoryQueries = {
  getBySlug: (slug: string) => groq`
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      description,
      "slug": slug.current,
    }
  `,
};
```

**Checklist**:
- [ ] File created at lib/queries.ts
- [ ] All query builders exported
- [ ] groq-tag imported
- [ ] Queries use parameter syntax ($search, $slug)
- [ ] No string interpolation in queries
- [ ] Return types inferred correctly

**Acceptance Criteria**:
- ✅ lib/queries.ts exists
- ✅ All queries are parameterized
- ✅ No injection vulnerabilities
- ✅ Can be imported and used

---

### Task 1.2: Create `lib/sanity-fetchers.ts`
**Effort**: 1.5 hours
**Files Created**: `lib/sanity-fetchers.ts`

**Implementation**:
```typescript
import { client } from '@/sanity/lib/client';
import { productQueries, categoryQueries } from './queries';
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

export async function fetchProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const query = productQueries.getByCategory(slug);
    const products = await client.fetch(query, { slug });
    return products;
  } catch (error) {
    console.error('Failed to fetch products by category', error);
    throw new Error('Failed to load category products. Please try again later.');
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

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const query = categoryQueries.getBySlug(slug);
    const category = await client.fetch(query, { slug });
    return category || null;
  } catch (error) {
    console.error('Failed to fetch category', error);
    throw new Error('Failed to load category. Please try again later.');
  }
}
```

**Checklist**:
- [ ] File created at lib/sanity-fetchers.ts
- [ ] All fetch functions exported
- [ ] Error handling in each function
- [ ] Uses queries from lib/queries.ts
- [ ] Returns typed data
- [ ] Generic error messages (no sensitive data)

**Acceptance Criteria**:
- ✅ lib/sanity-fetchers.ts exists
- ✅ All fetch functions work
- ✅ Error handling consistent
- ✅ Can replace inline fetch calls

---

### Task 1.3: Create `lib/errors.ts`
**Effort**: 1 hour
**Files Created**: `lib/errors.ts`

**Implementation**:
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

**Checklist**:
- [ ] File created at lib/errors.ts
- [ ] ApiError class defined
- [ ] handleApiError function works
- [ ] logError sanitizes output
- [ ] Stack traces only in development
- [ ] All exports available

**Acceptance Criteria**:
- ✅ lib/errors.ts exists
- ✅ Error handling utilities available
- ✅ Can replace error handling code

---

### Task 1.4: Update `lib/interface.ts` - Eliminate `any` Types
**Effort**: 1 hour
**Files Modified**: `lib/interface.ts`

**Current Issues**:
```typescript
body: any[];  // ❌ No type
```

**Fix**:
```typescript
import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageSource } from 'next-sanity/image';

export interface Product {
  _id: string;
  name: string;
  price: number;
  author: string;
  body?: PortableTextBlock[];  // ✅ Properly typed
  image?: SanityImageSource;
  slug: { current: string };
  quantity?: number;  // For cart
  isbn?: string;
  publisher?: {
    _ref: string;
    _type: 'reference';
  };
  // ... other fields
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}
```

**Checklist**:
- [ ] Open lib/interface.ts
- [ ] Find all `any` types
- [ ] Replace with proper types
- [ ] Import PortableTextBlock if needed
- [ ] Import SanityImageSource if needed
- [ ] Verify TypeScript compilation

**Acceptance Criteria**:
- ✅ Zero `any` types in Product interface
- ✅ All fields properly typed
- ✅ No TypeScript errors
- ✅ Types match Sanity schema

---

### Task 1.5: Create `lib/stripe-types.ts`
**Effort**: 45 minutes
**Files Created**: `lib/stripe-types.ts`

**Implementation**:
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
  description?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface StripeLineItem {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      images?: string[];
    };
  };
  quantity: number;
}
```

**Checklist**:
- [ ] File created at lib/stripe-types.ts
- [ ] CheckoutSession interface defined
- [ ] StripeProduct interface defined
- [ ] StripeLineItem interface defined
- [ ] All types exported

**Acceptance Criteria**:
- ✅ lib/stripe-types.ts exists
- ✅ Can import and use types
- ✅ Matches Stripe API responses

---

## Phase 2: Header Extraction (2 days)

### Task 2.1: Extract `components/cart-nav.tsx`
**Effort**: 45 minutes
**Files Created**: `components/cart-nav.tsx`
**Files Modified**: `components/site-header.tsx`

**Implementation**:
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
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
          data-testid="cart-count"
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
}
```

**Checklist**:
- [ ] File created at components/cart-nav.tsx
- [ ] Accepts no props (uses useCart hook)
- [ ] Displays cart count badge
- [ ] Exports default CartNav function
- [ ] Links to /cart

**Acceptance Criteria**:
- ✅ components/cart-nav.tsx exists
- ✅ Displays cart icon with count
- ✅ Can be imported in site-header

---

### Task 2.2: Extract `components/search-bar.tsx`
**Effort**: 45 minutes
**Files Created**: `components/search-bar.tsx`

**Implementation**:
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
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        data-testid="search-button"
      >
        Search
      </button>
    </form>
  );
}
```

**Checklist**:
- [ ] File created at components/search-bar.tsx
- [ ] Marked with 'use client'
- [ ] Manages search state locally
- [ ] Handles form submission
- [ ] Navigates to /products?search=
- [ ] Encodes query param

**Acceptance Criteria**:
- ✅ components/search-bar.tsx exists
- ✅ Search works correctly
- ✅ Can be imported in site-header

---

### Task 2.3: Extract `components/main-nav.tsx`
**Effort**: 1 hour
**Files Created**: `components/main-nav.tsx`

**Implementation** (extract from existing site-header.tsx):
```typescript
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors">
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/products" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors">
              All Books
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/* Add other nav items */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

**Checklist**:
- [ ] File created at components/main-nav.tsx
- [ ] Navigation menu structure
- [ ] Links to main pages
- [ ] Uses shadcn/ui NavigationMenu
- [ ] Styled consistently

**Acceptance Criteria**:
- ✅ components/main-nav.tsx exists
- ✅ Navigation renders correctly
- ✅ Links functional

---

### Task 2.4: Update `components/site-header.tsx` - Composition Only
**Effort**: 30 minutes
**Files Modified**: `components/site-header.tsx`

**Before**:
- 212 lines with all logic inline

**After**:
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

**Checklist**:
- [ ] Remove all logic from site-header.tsx
- [ ] Import all child components
- [ ] Keep only composition
- [ ] ~40 lines total
- [ ] All functionality preserved

**Acceptance Criteria**:
- ✅ site-header.tsx <50 lines
- ✅ All components composed correctly
- ✅ No logic in component
- ✅ Same visual output

---

## Phase 3: Products Page Refactoring (2 days)

### Task 3.1: Create `components/product-search-filter.tsx`
**Effort**: 1 hour
**Files Created**: `components/product-search-filter.tsx`

**Implementation**:
```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Category } from '@/lib/interface';

interface ProductSearchFilterProps {
  categories: Category[];
}

export function ProductSearchFilter({
  categories,
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

**Checklist**:
- [ ] File created at components/product-search-filter.tsx
- [ ] Marked with 'use client'
- [ ] Accepts categories prop
- [ ] Handles search and filter
- [ ] Updates URL params
- [ ] Uses UI components

**Acceptance Criteria**:
- ✅ components/product-search-filter.tsx exists
- ✅ Search and filter work
- ✅ URL params update correctly

---

### Task 3.2: Create `components/product-sort.tsx`
**Effort**: 30 minutes
**Files Created**: `components/product-sort.tsx`

**Implementation**:
```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleSort}>
      <SelectTrigger data-testid="sort-select" className="w-[200px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="name-asc">Name: A to Z</SelectItem>
        <SelectItem value="name-desc">Name: Z to A</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

**Checklist**:
- [ ] File created at components/product-sort.tsx
- [ ] Marked with 'use client'
- [ ] Sort options defined
- [ ] Updates URL params
- [ ] Uses Select component

**Acceptance Criteria**:
- ✅ components/product-sort.tsx exists
- ✅ Sort dropdown works
- ✅ Updates products correctly

---

### Task 3.3: Create `components/product-list.tsx`
**Effort**: 45 minutes
**Files Created**: `components/product-list.tsx`

**Implementation**:
```typescript
import { ProductCard } from './product-card';
import type { Product } from '@/lib/interface';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products found</p>;
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

**Checklist**:
- [ ] File created at components/product-list.tsx
- [ ] Accepts products array
- [ ] Maps to ProductCard components
- [ ] Shows empty state
- [ ] Styled as grid

**Acceptance Criteria**:
- ✅ components/product-list.tsx exists
- ✅ Renders product grid
- ✅ Handles empty state

---

### Task 3.4: Refactor `app/products/page.tsx`
**Effort**: 1 hour
**Files Modified**: `app/products/page.tsx`

**Before**: 120 lines with fetching, filtering, rendering all mixed

**After**:
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
      <h1 className="text-3xl font-bold mb-6">All Books</h1>

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

**Checklist**:
- [ ] Import fetchers and components
- [ ] Remove all inline logic
- [ ] Use fetchProducts and fetchCategories
- [ ] Compose components
- [ ] ~30 lines total
- [ ] Test search/filter

**Acceptance Criteria**:
- ✅ app/products/page.tsx <40 lines
- ✅ All functionality preserved
- ✅ Search and filter work
- ✅ No regressions

---

## Phase 4: Category Page Refactoring (1 day)

### Task 4.1: Create `components/category-product-card.tsx`
**Effort**: 1 hour
**Files Created**: `components/category-product-card.tsx`

**Implementation**:
```typescript
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { urlForImage } from '@/sanity/lib/image';
import type { Product } from '@/lib/interface';

interface CategoryProductCardProps {
  product: Product;
}

export function CategoryProductCard({ product }: CategoryProductCardProps) {
  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
      data-testid="product-card"
    >
      {product.image && (
        <div className="relative h-48 w-full">
          <Image
            src={urlForImage(product.image).url()}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.author}</p>
        <p className="text-lg font-bold mt-2">€{product.price}</p>

        <div className="flex gap-2 mt-4">
          <Link
            href={`/product/${product.slug.current}`}
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

**Checklist**:
- [ ] File created at components/category-product-card.tsx
- [ ] Accepts product prop
- [ ] Displays product info
- [ ] Links to product detail
- [ ] Has add to cart button
- [ ] Styled consistently

**Acceptance Criteria**:
- ✅ components/category-product-card.tsx exists
- ✅ Displays product card
- ✅ Can be imported in category page

---

### Task 4.2: Refactor `app/category/[slug]/page.tsx`
**Effort**: 45 minutes
**Files Modified**: `app/category/[slug]/page.tsx`

**Before**: 126 lines with fetching and rendering mixed

**After**:
```typescript
import { fetchProductsByCategory, fetchCategoryBySlug } from '@/lib/sanity-fetchers';
import { CategoryProductCard } from '@/components/category-product-card';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, products] = await Promise.all([
    fetchCategoryBySlug(params.slug),
    fetchProductsByCategory(params.slug),
  ]);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{category.title}</h1>

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

**Checklist**:
- [ ] Import fetchers and component
- [ ] Remove inline logic
- [ ] Use fetchProductsByCategory
- [ ] Compose CategoryProductCard
- [ ] ~25 lines total
- [ ] Test category pages

**Acceptance Criteria**:
- ✅ app/category/[slug]/page.tsx <30 lines
- ✅ All functionality preserved
- ✅ Products display correctly
- ✅ No regressions

---

## Phase 5: Error Handling (2 days)

### Task 5.1: Update API Route Error Handling
**Effort**: 1 hour
**Files Modified**: `app/api/checkout/route.ts`, `app/api/session/route.ts`

**Pattern**:
```typescript
import { logError, handleApiError } from '@/lib/errors';

export async function POST(request: Request) {
  try {
    // Business logic
    return Response.json(data);
  } catch (error) {
    logError('checkout', error);
    const { status, message } = handleApiError(error);
    return Response.json({ error: message }, { status });
  }
}
```

**Checklist**:
- [ ] Import error utilities
- [ ] Wrap route in try-catch
- [ ] Call logError with context
- [ ] Use handleApiError
- [ ] Return generic error message
- [ ] Test error paths

**Acceptance Criteria**:
- ✅ All API routes use error handling
- ✅ Errors logged with context
- ✅ No sensitive data leaked
- ✅ User-friendly messages

---

### Task 5.2: Update Component Error Handling
**Effort**: 1 hour
**Files Modified**: `components/cart-summary.tsx`

**Pattern**:
```typescript
'use client';

import { useState } from 'react';
import { logError } from '@/lib/logger';
import { AlertCircle } from 'lucide-react';

export function CartSummary() {
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setError(null);
      // Checkout logic
    } catch (error) {
      logError('checkout', error);
      setError('Checkout failed. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Rest of component
}
```

**Checklist**:
- [ ] Import error utilities
- [ ] Add error state
- [ ] Wrap operations in try-catch
- [ ] Call logError
- [ ] Show user-friendly message
- [ ] Provide recovery option

**Acceptance Criteria**:
- ✅ Components handle errors gracefully
- ✅ Error messages shown to user
- ✅ Logging for debugging

---

## Phase 6: Testing (2 days)

### Task 6.1: Add Unit Tests for Extracted Components
**Effort**: 1 day
**Files Created**: `__tests__/unit/components/*.test.ts`

**Test Examples**:
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@/__tests__/utils/test-helpers';
import { CartNav } from '@/components/cart-nav';

describe('CartNav', () => {
  it('should display cart count', () => {
    const { getByTestId } = render(<CartNav />);
    const count = getByTestId('cart-count');
    expect(count).toBeInTheDocument();
  });
});
```

**Checklist**:
- [ ] Test CartNav component
- [ ] Test SearchBar component
- [ ] Test ProductSearchFilter component
- [ ] Test ProductSort component
- [ ] Test ProductList component
- [ ] Test CategoryProductCard component

**Acceptance Criteria**:
- ✅ 6+ unit tests for new components
- ✅ All tests pass
- ✅ Components are testable

---

### Task 6.2: Run Full Test Suite
**Effort**: 1 day
**Local Testing**: All tests

**Commands**:
```bash
npm run test:run          # Run unit tests
npm run test:coverage     # Generate coverage
npm run test:e2e          # Run E2E tests
```

**Checklist**:
- [ ] All unit tests pass
- [ ] Coverage meets targets
- [ ] All E2E tests pass
- [ ] No regressions
- [ ] Performance acceptable

**Acceptance Criteria**:
- ✅ All tests pass locally
- ✅ No broken functionality
- ✅ Ready to merge

---

## Phase 7: Final Review (1 day)

### Task 7.1: Code Review Checklist
**Effort**: 2 hours
**Code Review**: Check all changes

**Checklist**:
- [ ] No `any` types remain
- [ ] All imports correct
- [ ] Exports available
- [ ] Components <75 lines
- [ ] Pages <40 lines
- [ ] Error handling consistent
- [ ] Data fetchers used consistently
- [ ] Query builders parameterized
- [ ] Types match interfaces
- [ ] Comments for complex logic

**Acceptance Criteria**:
- ✅ Code quality improved
- ✅ Type safety 100%
- ✅ No technical debt added

---

### Task 7.2: Functional Testing
**Effort**: 2 hours
**Manual Testing**: All features

**Test Scenarios**:
- [ ] Search products
- [ ] Filter by category
- [ ] Sort products
- [ ] View product details
- [ ] Add to cart
- [ ] View cart
- [ ] Browse categories
- [ ] Checkout flow

**Acceptance Criteria**:
- ✅ All features work
- ✅ No visual regressions
- ✅ No performance issues

---

## Summary

**Total Tasks**: 22 actionable items
**Total Effort**: 2 weeks
**Deliverables**:
- 5 utility libraries
- 6 extracted components
- 2 refactored page components
- 6+ unit tests
- Full test coverage

**Success Criteria**:
- ✅ site-header.tsx reduced from 212 to ~40 lines
- ✅ products/page.tsx reduced from 120 to ~30 lines
- ✅ All monolithic components extracted
- ✅ 100% type safety (zero `any` types)
- ✅ All error handling consistent
- ✅ All tests pass post-refactoring
- ✅ No functionality regressions

