# Phase 4B Design Polish - Task List

**Status**: In Progress
**Last Updated**: 2025-11-30

---

## Phase 1: Foundation & Dark Mode

- [ ] **1.1** Create `context/theme.tsx` with ThemeProvider and useTheme hook
  - System preference detection via `prefers-color-scheme`
  - localStorage persistence
  - Theme type: 'light' | 'dark' | 'system'

- [ ] **1.2** Update `app/layout.tsx`
  - Wrap children with ThemeProvider
  - Remove 4 gradient blob divs (lines 36-39)
  - Add clean background styling

- [ ] **1.3** Update `tailwind.config.ts`
  - Configure `darkMode: 'class'`
  - Add light mode color palette
  - Add dark mode color palette
  - Add to exports

- [ ] **1.4** Update `app/globals.css`
  - Add CSS variables for both light/dark modes
  - Override Tailwind defaults if needed
  - Test color inheritance

- [ ] **1.5** Update `components/site-header.tsx`
  - Add theme toggle button (Moon/Sun icon from lucide)
  - Position before cart icon
  - Add click handler to toggle theme
  - Style button appropriately

- [ ] **1.6** Test dark mode
  - Verify theme persists on page reload
  - Check system preference detection
  - Test toggle button functionality
  - Visual inspection on all pages

---

## Phase 2: Product & Component Redesigns

### 2A: Product Card

- [ ] **2A.1** Update `components/product-card.tsx`
  - Add price display with € symbol
  - Add bestseller badge (top-right corner)
  - Improve author styling (smaller, gray text)
  - Add "Add to Cart" button
  - Update image aspect ratio to 3:4
  - Add proper hover effects
  - Ensure responsive sizing

### 2B: Product List & Grid

- [ ] **2B.1** Update `components/product-list.tsx`
  - Change grid to: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  - Set gap to `gap-4` (16px)
  - Update test data attributes if needed

### 2C: Products Page

- [ ] **2C.1** Update `app/products/page.tsx`
  - Redesign hero section
  - H1: "Explore Our Collection"
  - Body: "Discover thousands of carefully curated books"
  - Add padding and spacing (48px top/bottom)
  - Light gray background for hero
  - Improve filter layout for sidebar

- [ ] **2C.2** Update `components/product-filter.tsx`
  - Better styling for filter sections
  - Add "Clear Filters" button
  - Improve accordion styling
  - Better spacing

---

## Phase 3: Category & Homepage

### 3A: Category Pages

- [ ] **3A.1** Update `app/category/[slug]/page.tsx`
  - Add breadcrumb navigation
  - Remove diagonal layout CSS `[&>*:nth-child(even)]:mr-24 [&>*:nth-child(odd)]:ml-24`
  - Replace with proper grid layout
  - Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  - Update spacing

- [ ] **3A.2** Update `components/category-product-card.tsx`
  - Ensure consistent styling with ProductCard
  - Update layout to match grid

### 3B: Homepage

- [ ] **3B.1** Update `app/page.tsx`
  - Improve hero slider section
  - Add "Featured Categories" section (3-column grid)
  - Add "New Arrivals" section
  - Add "Bestsellers" section
  - Add "Newsletter Signup" section
  - Ensure consistent spacing between sections
  - Remove any remaining gradient blob references

- [ ] **3B.2** Update `components/slider.tsx` if needed
  - Improve styling
  - Better contrast for text overlay
  - Smooth transitions

### 3C: Product Detail Page

- [ ] **3C.1** Update `app/product/[slug]/page.tsx`
  - Implement 2-column layout (desktop: image left, info right)
  - Add breadcrumb navigation
  - Improve typography hierarchy
  - Add related products section
  - Better add-to-cart section styling
  - Mobile: single column layout

---

## Phase 4: Navigation & New Pages

### 4A: New Pages

- [ ] **4A.1** Create `app/not-found.tsx`
  - H1: "Oops! Page Not Found"
  - Message about page not existing
  - Suggested links: Home, Products, Sample categories
  - Centered layout with whitespace

- [ ] **4A.2** Create `app/privacy/page.tsx`
  - Wide layout (max-width: 900px)
  - Sections: Data collection, Usage, Sharing, Security, Rights
  - Add table of contents
  - Include Stripe and Sanity references
  - Proper typography hierarchy

- [ ] **4A.3** Create `app/terms/page.tsx`
  - Wide layout (max-width: 900px)
  - Sections: Acceptance, Use License, Disclaimer, Limitations, Revisions
  - Numbered sections
  - Professional tone

- [ ] **4A.4** Create `app/contact/page.tsx`
  - Intro text
  - Form: Name, Email, Subject, Message, Category dropdown
  - Success message handling
  - Light gray background for form
  - Optional: Email address display

- [ ] **4A.5** Create `app/faq/page.tsx`
  - Categories/sections
  - Accordion or expandable Q&A pairs
  - Optional: Search/filter functionality
  - Common questions about: Shipping, Returns, Orders, Accounts

- [ ] **4A.6** Create `app/shipping/page.tsx`
  - Shipping information
  - Return policies
  - Refund process
  - Delivery timeframes
  - Contact info for support

### 4B: Footer Restructure

- [ ] **4B.1** Update `components/site-footer.tsx`
  - Change layout to 4-column (desktop), 2-column (tablet), 1-column (mobile)
  - **Column 1**: Company name + description + social icons
  - **Column 2**: Shop (Products, Categories, Bestsellers, New Arrivals)
  - **Column 3**: Support (Contact, FAQ, Shipping, Privacy)
  - **Column 4**: Newsletter signup form
  - Update all link URLs to correct routes
  - Remove: `/blog`, `/about`, `/telegram`
  - Update styling and spacing

---

## Phase 5: Polish & Testing

### 5A: Cart Page

- [ ] **5A.1** Update `app/cart/page.tsx`
  - 2-column layout (desktop): left items, right summary
  - Left column: Cart items with remove/quantity controls
  - Right column: Sticky order summary
  - Subtotal, Shipping (€4.50), Tax, Total
  - Mobile: Single column, summary below items
  - Update styling and spacing

### 5B: Component Standardization

- [ ] **5B.1** Verify all buttons
  - Primary, secondary, ghost, outline variants
  - Consistent padding and sizing
  - Proper hover/active states
  - Dark mode compatible

- [ ] **5B.2** Verify all cards
  - Consistent border radius (12px)
  - Consistent shadows
  - Consistent padding
  - Hover effects (shadow increase, slight scale)

- [ ] **5B.3** Verify form components
  - Input fields: borders, focus states, padding
  - Checkboxes: sizing, checked state
  - Labels: font weight, spacing
  - Dark mode compatibility

### 5C: Animations & Micro-interactions

- [ ] **5C.1** Add toast notification for "Add to Cart"
  - Slide in from bottom-right
  - Message: "Added to cart ✓"
  - Auto-dismiss after 3 seconds
  - Success (green) styling

- [ ] **5C.2** Add form submission states
  - Loading spinner on submit button
  - Button text: "Submitting..."
  - Disabled state while loading
  - Success/error feedback

- [ ] **5C.3** Add smooth transitions
  - Button/link hovers: 150ms
  - Page transitions: 300ms
  - Hero animations: 500ms
  - Ensure `prefers-reduced-motion` respected

- [ ] **5C.4** Verify hover effects
  - Cards: shadow-md increase + scale 1.02
  - Images: scale 1.05 or brightness increase
  - Links: underline + color change
  - Buttons: color change + shadow increase

### 5D: Accessibility & Testing

- [ ] **5D.1** Light mode accessibility
  - Text contrast ≥ 4.5:1
  - All interactive elements keyboard accessible
  - Focus states visible
  - Form labels properly associated

- [ ] **5D.2** Dark mode accessibility
  - Text contrast ≥ 4.5:1 in dark mode
  - All text readable
  - Buttons accessible
  - Images display well

- [ ] **5D.3** Responsive testing
  - Mobile (320px, 375px)
  - Tablet (768px)
  - Desktop (1024px, 1440px)
  - Extra large (1920px)
  - All breakpoints: sm, md, lg, xl, 2xl

- [ ] **5D.4** Image & alt text audit
  - All images have meaningful alt text
  - Product images display correctly
  - Hero images load properly
  - Responsive image sizing

- [ ] **5D.5** Form testing
  - All form fields work
  - Validation displays properly
  - Error messages clear
  - Success feedback visible

### 5E: Performance Verification

- [ ] **5E.1** Build verification
  - `npm run build` completes successfully
  - No new errors or warnings
  - Build size maintained or improved

- [ ] **5E.2** Lighthouse audit
  - Performance ≥ 90
  - Accessibility ≥ 90
  - Best Practices ≥ 90
  - SEO ≥ 90

- [ ] **5E.3** Core Web Vitals
  - LCP (Largest Contentful Paint) < 2.0s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

- [ ] **5E.4** Animation performance
  - No layout shifts from animations
  - Smooth 60fps transitions
  - No jank on hover effects

---

## Verification Checklist

- [ ] All new pages created and accessible
- [ ] All footer links functional
- [ ] Dark mode works in all browsers
- [ ] Product cards display all required info
- [ ] Category pages use grid layout (not diagonal)
- [ ] Homepage sections properly spaced
- [ ] Cart page has 2-column layout
- [ ] Product detail page has proper layout
- [ ] All forms functional
- [ ] Newsletter signup displays properly
- [ ] Social icons in footer work
- [ ] Mobile responsive on all breakpoints
- [ ] WCAG AA compliance verified
- [ ] No performance regression
- [ ] Build completes without errors

---

## Notes

- Test dark mode as you implement each phase, not just at the end
- Keep design system specs handy (colors, typography, spacing)
- Update components incrementally and test frequently
- Use browser dev tools to verify responsive design
- Test with real data from Sanity
- Verify all links before final commit
