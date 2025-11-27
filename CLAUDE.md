# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bookish Bliss is an e-commerce bookstore built with Next.js 14, Sanity CMS, and Stripe for payments. The application features a shopping cart system, product filtering/sorting, and category-based browsing.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Core Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **CMS**: Sanity v3 (headless CMS)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Payment**: Stripe Checkout
- **State Management**: React Context API with localStorage persistence

### Key Architectural Patterns

#### 1. Content Management with Sanity
- Sanity Studio accessible at `/studio` route (app/studio/[[...index]]/page.tsx)
- Content schemas defined in `sanity/schemas/`:
  - `product-schema.ts`: Books with author, price, ISBN, category refs, publisher refs
  - `category-schema.ts`: Product categories
  - `publisher-schema.ts`: Book publishers
  - `site-schema.ts`: Site-wide settings
- Sanity client configured in `sanity/lib/client.ts`
- Images served from CDN at `cdn.sanity.io` (configured in next.config.mjs)

#### 2. Shopping Cart System
- Global cart state managed via `CartProvider` context in `context/index.tsx`
- Cart persisted to localStorage using `usehooks-ts` library
- Cart operations: add, remove, increment, decrement, reset
- Access cart via `useCart()` hook from any component

#### 3. Stripe Payment Integration
- Checkout flow handled by API route: `app/api/checkout/route.ts`
- Process:
  1. Client sends cart products to `/api/checkout`
  2. Server creates/finds matching Stripe products
  3. Server creates Stripe Checkout session with line items
  4. Client redirects to Stripe-hosted checkout
  5. Success redirects to `/success?session_id={ID}`
  6. Cancel redirects to `/cancel`
- Currency: EUR
- Fixed shipping: €4.50

#### 4. Product Data Fetching
- All data fetched from Sanity using GROQ queries
- Products filtered by flags: `bestseller`, `recent`
- Typical query pattern:
  ```typescript
  const query = `*[_type == "product" && bestseller == true]{
    "id": _id,
    "slug": slug.current,
    name,
    author,
    price,
    image
  }`;
  const data = await client.fetch(query);
  ```

### Directory Structure

```
app/
├── api/
│   ├── checkout/route.ts     # Stripe checkout session creation
│   └── session/route.ts      # Session management
├── cart/page.tsx             # Shopping cart page
├── category/[slug]/page.tsx  # Dynamic category pages
├── product/[slug]/page.tsx   # Dynamic product detail pages
├── products/page.tsx         # All products with filters/sorting
├── studio/[[...index]]/      # Sanity Studio CMS interface
├── success/page.tsx          # Post-checkout success page
├── cancel/page.tsx           # Checkout cancellation page
└── layout.tsx                # Root layout with CartProvider

components/
├── cart-items.tsx            # Cart item list
├── cart-summary.tsx          # Cart totals and checkout button
├── checkout-session.tsx      # Stripe checkout integration
├── product-card.tsx          # Product grid item
├── product-filter.tsx        # Category/publisher filtering
├── product-sort.tsx          # Sort by price/name
├── product-row.tsx           # Horizontal product carousel
├── slider.tsx                # Homepage hero slider
├── site-header.tsx           # Navigation with cart icon
├── site-footer.tsx           # Footer component
└── ui/                       # shadcn/ui components

context/
└── index.tsx                 # CartProvider and useCart hook

sanity/
├── schemas/                  # Content type definitions
├── lib/client.ts             # Sanity client config
└── lib/image.ts              # Image URL builder

lib/
├── interface.ts              # TypeScript interfaces (Product, Category)
└── utils.ts                  # Utility functions (cn for classnames)
```

## Environment Variables

Required environment variables (create `.env.local`):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
STRIPE_SECRET_KEY=
```

## Important Development Notes

### Adding New Product Fields
1. Update `sanity/schemas/product-schema.ts` with new field definition
2. Update `lib/interface.ts` Product interface
3. Update GROQ queries in page components to include new field
4. Redeploy Sanity Studio changes

### Modifying Cart Behavior
- Cart logic centralized in `context/index.tsx`
- Cart data structure matches Product interface with added `quantity` field
- Cart automatically filters items with quantity <= 0

### Working with Stripe
- Products auto-created in Stripe on first checkout
- Product matching done by name (case-insensitive)
- Prices stored in cents (multiply by 100)
- Stripe API version: 2024-04-10

### Image Handling
- Use `urlForImage()` from `sanity/lib/image.ts` to generate optimized image URLs
- Sanity images support hotspot cropping
- Next.js Image component configured for cdn.sanity.io domain

### Styling Conventions
- Utility-first Tailwind CSS
- shadcn/ui components for UI primitives
- Custom gradient "blob" backgrounds in layout.tsx
- Responsive breakpoints: md, lg, xl, 2xl
