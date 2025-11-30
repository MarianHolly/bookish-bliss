# Phase 4B Design Polish - Implementation Checklist

**Status**: Ready to Begin
**Start Date**: 2025-11-30
**Completed Date**: [TBD]

---

## Phase 1: Foundation & Dark Mode ⬜

**Status**: Not Started
**Expected Duration**: 3-4 days
**Priority**: CRITICAL (blocks all other phases)

### Theme Context & System Integration
- [ ] Create `context/theme.tsx`
  - [ ] ThemeProvider component
  - [ ] useTheme hook
  - [ ] System preference detection
  - [ ] localStorage persistence
  - [ ] Theme type definition

- [ ] Update `app/layout.tsx`
  - [ ] Wrap with ThemeProvider
  - [ ] Remove 4 gradient blob divs
  - [ ] Add clean background color
  - [ ] Test theme provider wrapping

### Design System Configuration
- [ ] Update `tailwind.config.ts`
  - [ ] Set `darkMode: 'class'`
  - [ ] Light color palette (primary, accent, neutral, status)
  - [ ] Dark color palette (primary, accent, neutral, status)
  - [ ] Typography scale config
  - [ ] Spacing scale (8px grid)
  - [ ] Shadows config
  - [ ] Border radius config

- [ ] Update `app/globals.css`
  - [ ] CSS variables for light mode
  - [ ] CSS variables for dark mode
  - [ ] Background colors
  - [ ] Text colors
  - [ ] Border colors
  - [ ] Shadow definitions

### Header & Navigation
- [ ] Update `components/site-header.tsx`
  - [ ] Import theme hook
  - [ ] Add theme toggle button
  - [ ] Position: before cart icon
  - [ ] Icon: Moon/Sun from lucide-react
  - [ ] Click handler for toggle
  - [ ] Proper styling in both modes

### Testing & Verification
- [ ] Test theme persistence
  - [ ] Toggle theme
  - [ ] Reload page
  - [ ] Theme should persist
  - [ ] Check localStorage

- [ ] Test system preference
  - [ ] First visit should detect OS setting
  - [ ] Change OS dark mode
  - [ ] App should reflect change

- [ ] Visual inspection
  - [ ] All text readable (light & dark)
  - [ ] Buttons visible (light & dark)
  - [ ] Links visible (light & dark)
  - [ ] No contrast issues
  - [ ] Blobs completely removed

---

## Phase 2: Product & Component Redesigns ⬜

**Status**: Not Started
**Expected Duration**: 3-4 days
**Depends On**: Phase 1

### Product Card Enhancement
- [ ] Update `components/product-card.tsx`
  - [ ] Add price display with € symbol
  - [ ] Price styling (larger, accent color)
  - [ ] Add bestseller badge
  - [ ] Badge position: top-right corner
  - [ ] Badge styling (accent background, white text)
  - [ ] Author: smaller, gray text
  - [ ] Add "Add to Cart" button
  - [ ] Button styling: primary color
  - [ ] Image aspect ratio: 3:4
  - [ ] Image hover: scale 1.05
  - [ ] Card hover: shadow increase
  - [ ] Responsive sizing across breakpoints

- [ ] Test product card
  - [ ] Displays price correctly
  - [ ] Badge shows for bestsellers only
  - [ ] Button clickable (add to cart)
  - [ ] Hover effects smooth
  - [ ] Responsive on mobile

### Product List Grid
- [ ] Update `components/product-list.tsx`
  - [ ] Grid columns: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  - [ ] Gap: `gap-4` (16px)
  - [ ] Update grid class names
  - [ ] Test grid responsiveness

### Products Page
- [ ] Update `app/products/page.tsx`
  - [ ] Hero section title: "Explore Our Collection"
  - [ ] Hero section subtitle: "Discover thousands of carefully curated books"
  - [ ] Hero background: light gray (F9FAFB)
  - [ ] Hero padding: 48px top/bottom
  - [ ] Center hero text
  - [ ] Hero container styling
  - [ ] Filter sidebar styling improvements
  - [ ] Results header styling

- [ ] Update `components/product-filter.tsx`
  - [ ] Accordion styling improvements
  - [ ] Add "Clear Filters" button
  - [ ] Better section headers
  - [ ] Improved spacing
  - [ ] Better checkbox styling
  - [ ] Filter labels clearer

- [ ] Test products page
  - [ ] Grid displays correctly
  - [ ] Filters work properly
  - [ ] Responsive on all breakpoints
  - [ ] Looks good in both light/dark modes

---

## Phase 3: Category & Homepage ⬜

**Status**: Not Started
**Expected Duration**: 4-5 days
**Depends On**: Phase 1, 2

### Category Page Redesign
- [ ] Update `app/category/[slug]/page.tsx`
  - [ ] Add breadcrumb navigation
  - [ ] Format: "Bookish Bliss > Categories > [Category Name]"
  - [ ] Breadcrumb styling: small text, gray, hover underline
  - [ ] Remove diagonal layout CSS
  - [ ] Implement proper grid layout
  - [ ] Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  - [ ] Gap: `gap-4`
  - [ ] Update product container padding/spacing

- [ ] Update `components/category-product-card.tsx`
  - [ ] Align styling with ProductCard
  - [ ] Ensure consistent appearance
  - [ ] Test in category page

- [ ] Test category pages
  - [ ] Grid displays correctly
  - [ ] Breadcrumbs visible and functional
  - [ ] Responsive on all breakpoints
  - [ ] Hero section still works
  - [ ] Looks good in both modes

### Homepage Redesign
- [ ] Update `app/page.tsx`
  - [ ] Hero slider section styling
  - [ ] Add "Featured Categories" section
  - [ ] Featured categories: 3-column grid
  - [ ] Featured categories: clickable to category pages
  - [ ] Add "New Arrivals" section
  - [ ] New Arrivals: grid of products
  - [ ] New Arrivals: CTA link to view all
  - [ ] Add "Bestsellers" section
  - [ ] Bestsellers: grid of products
  - [ ] Bestsellers: CTA link to view all
  - [ ] Add "Newsletter Signup" section
  - [ ] Newsletter: centered layout
  - [ ] Newsletter: email input + subscribe button
  - [ ] Newsletter: description text
  - [ ] Consistent section spacing (padding, margins)
  - [ ] Remove any gradient blob references

- [ ] Update `components/slider.tsx` if needed
  - [ ] Improve hero styling
  - [ ] Better text contrast (dark overlay)
  - [ ] Smooth transitions between slides
  - [ ] Responsive sizing

- [ ] Test homepage
  - [ ] All sections display correctly
  - [ ] Sections properly spaced
  - [ ] Buttons/links functional
  - [ ] Responsive on mobile/tablet/desktop
  - [ ] Looks good in both light/dark modes

### Product Detail Page
- [ ] Update `app/product/[slug]/page.tsx`
  - [ ] 2-column layout (desktop): image left, info right
  - [ ] Mobile: single column layout
  - [ ] Add breadcrumb navigation
  - [ ] Image section: responsive sizing
  - [ ] Info section: proper typography
  - [ ] H1: product name
  - [ ] Author: "By {author}" - medium gray text
  - [ ] Price: large, accent color, € symbol
  - [ ] Description: full text
  - [ ] Details: ISBN, Publisher, Year, Pages
  - [ ] Stock status: badge (green/gray)
  - [ ] Add to Cart: large button with quantity selector
  - [ ] Related Products section: 4 products
  - [ ] Related Products title: "Related Books"

- [ ] Test product detail page
  - [ ] Layout correct on desktop
  - [ ] Layout stacks on mobile
  - [ ] All info displays correctly
  - [ ] Breadcrumbs functional
  - [ ] Related products display
  - [ ] Add to cart works
  - [ ] Responsive and styled properly

---

## Phase 4: Navigation & New Pages ⬜

**Status**: Not Started
**Expected Duration**: 4-5 days
**Depends On**: Phase 1, 2, 3

### 404 Not Found Page
- [ ] Create `app/not-found.tsx`
  - [ ] Title: "Oops! Page Not Found"
  - [ ] Message: friendly explanation
  - [ ] Visual element: icon or illustration
  - [ ] Button: "Go to Home" → `/`
  - [ ] Button: "Browse Products" → `/products`
  - [ ] Links: popular categories
  - [ ] Centered layout with whitespace
  - [ ] Styled with design system colors
  - [ ] Works in light/dark modes

### Privacy Policy Page
- [ ] Create `app/privacy/page.tsx`
  - [ ] Layout: max-width 900px, centered
  - [ ] H1: "Privacy Policy"
  - [ ] Last updated date
  - [ ] Table of contents (links to sections)
  - [ ] Sections with proper headings:
    - [ ] Information We Collect
    - [ ] How We Use Information
    - [ ] Information Sharing
    - [ ] Data Security
    - [ ] User Rights
    - [ ] Changes to Policy
    - [ ] Contact Us
  - [ ] Include Stripe references
  - [ ] Include Sanity references
  - [ ] Professional tone
  - [ ] Proper typography and spacing

### Terms & Conditions Page
- [ ] Create `app/terms/page.tsx`
  - [ ] Layout: max-width 900px, centered
  - [ ] H1: "Terms & Conditions"
  - [ ] Effective date
  - [ ] Numbered sections:
    - [ ] Acceptance of Terms
    - [ ] Use License
    - [ ] Disclaimer
    - [ ] Limitations of Liability
    - [ ] Accuracy of Materials
    - [ ] Links
    - [ ] Modifications
    - [ ] Governing Law
  - [ ] Professional tone
  - [ ] Clear numbering and structure

### Contact Page
- [ ] Create `app/contact/page.tsx`
  - [ ] H1: "Contact Us"
  - [ ] Intro text
  - [ ] Contact form:
    - [ ] Name field
    - [ ] Email field
    - [ ] Subject field
    - [ ] Category dropdown
    - [ ] Message textarea
    - [ ] Submit button
  - [ ] Form styling: light gray background
  - [ ] Form validation
  - [ ] Success message
  - [ ] Optional: Email address display
  - [ ] Optional: Phone number

### FAQ Page
- [ ] Create `app/faq/page.tsx`
  - [ ] H1: "Frequently Asked Questions"
  - [ ] Intro text
  - [ ] Accordion sections:
    - [ ] Shipping & Delivery
    - [ ] Returns & Refunds
    - [ ] Orders & Accounts
    - [ ] Products & Availability
  - [ ] Q&A pairs in accordions
  - [ ] Expandable sections
  - [ ] Optional: Search/filter by question
  - [ ] Professional styling

### Shipping & Returns Page
- [ ] Create `app/shipping/page.tsx`
  - [ ] H1: "Shipping & Returns"
  - [ ] Sections:
    - [ ] Shipping Information
    - [ ] Delivery Timeframes
    - [ ] Return Policy
    - [ ] Return Process Steps
    - [ ] Refund Timeline
    - [ ] Contact Support
  - [ ] Proper headings and structure
  - [ ] Contact information
  - [ ] Professional tone

### Footer Restructure
- [ ] Update `components/site-footer.tsx`
  - [ ] Remove old data object with blog/about/telegram links
  - [ ] 4-column layout (desktop)
  - [ ] 2-column layout (tablet)
  - [ ] 1-column layout (mobile)

  **Column 1: Company**
  - [ ] Logo or "Bookish Bliss" text
  - [ ] Description: "Your favorite online bookstore"
  - [ ] Social icons: Instagram, Twitter, GitHub
  - [ ] Update social URLs to actual accounts

  **Column 2: Shop**
  - [ ] Products → `/products`
  - [ ] Categories (or link to browse)
  - [ ] Bestsellers (with query param)
  - [ ] New Arrivals (with query param)

  **Column 3: Support**
  - [ ] Contact → `/contact`
  - [ ] FAQ → `/faq`
  - [ ] Shipping → `/shipping`
  - [ ] Privacy Policy → `/privacy`

  **Column 4: Newsletter**
  - [ ] H5: "Stay Updated"
  - [ ] Input: Email field
  - [ ] Button: Subscribe
  - [ ] Checkbox: "I agree to emails"

  - [ ] Update styling
  - [ ] Proper spacing and alignment
  - [ ] Dark mode compatible
  - [ ] Responsive layout
  - [ ] Copyright text at bottom

- [ ] Test footer
  - [ ] All links functional
  - [ ] Layout responsive
  - [ ] Social icons work
  - [ ] Newsletter form displays
  - [ ] Styled correctly in both modes

---

## Phase 5: Polish & Testing ⬜

**Status**: Not Started
**Expected Duration**: 3-4 days
**Depends On**: All previous phases

### Cart Page Redesign
- [ ] Update `app/cart/page.tsx`
  - [ ] Desktop layout: 2 columns
  - [ ] Left column: cart items
  - [ ] Right column: sticky order summary
  - [ ] Sticky positioning: top-20, max-width-300px

  **Left Column (Items)**
  - [ ] H2: "Your Cart"
  - [ ] Item list styling
  - [ ] Each item: image, title, author, price
  - [ ] Quantity selector: +/- buttons
  - [ ] Remove button
  - [ ] Divider between items
  - [ ] Empty state message
  - [ ] CTA: "Continue Shopping" when empty

  **Right Column (Summary)**
  - [ ] H3: "Order Summary"
  - [ ] Subtotal line item
  - [ ] Shipping: "€4.50"
  - [ ] Tax line item
  - [ ] Total: large, accent color
  - [ ] Progress: "Step 1/2: Review Cart"
  - [ ] Button: "Proceed to Checkout"
  - [ ] Link: "Continue Shopping"

  - [ ] Mobile layout: single column
  - [ ] Summary below items (not sticky)
  - [ ] Proper spacing and styling

- [ ] Test cart page
  - [ ] Layout correct on desktop
  - [ ] Layout stacks on mobile
  - [ ] All items display
  - [ ] Quantity controls work
  - [ ] Remove button works
  - [ ] Checkout button functional
  - [ ] Responsive across breakpoints

### Component Standardization
- [ ] Button variants
  - [ ] Primary: Accent color, white text
  - [ ] Secondary: Gray background, gray text
  - [ ] Ghost: Transparent, accent text
  - [ ] Outline: Border + accent text
  - [ ] All variants: consistent padding
  - [ ] All variants: hover effects
  - [ ] All variants: dark mode compatible

- [ ] Card styling
  - [ ] Border radius: 12px (lg)
  - [ ] Shadows: sm (default), md (hover)
  - [ ] Padding: 16-24px
  - [ ] Hover: shadow-md + scale 1.02
  - [ ] Dark mode: proper colors

- [ ] Form components
  - [ ] Input: border, padding, focus ring
  - [ ] Input: placeholder text, dark mode
  - [ ] Checkbox: sizing, styling, focus state
  - [ ] Labels: font weight 500, spacing
  - [ ] All dark mode compatible

### Animations & Micro-interactions
- [ ] Toast notifications
  - [ ] Add to Cart toast
  - [ ] Message: "Added to cart ✓"
  - [ ] Position: bottom-right
  - [ ] Color: success (green)
  - [ ] Animation: slide in
  - [ ] Auto-dismiss: 3 seconds
  - [ ] Works in both modes

- [ ] Form submissions
  - [ ] Loading spinner on button
  - [ ] Button text: "Submitting..."
  - [ ] Disabled state
  - [ ] Success message display
  - [ ] Error message display

- [ ] Transitions
  - [ ] Fast transitions: 150ms (hovers)
  - [ ] Normal transitions: 300ms (page)
  - [ ] Slow transitions: 500ms (hero)
  - [ ] Respect `prefers-reduced-motion`

- [ ] Hover effects
  - [ ] Cards: shadow + scale
  - [ ] Images: scale 1.05
  - [ ] Links: underline + color
  - [ ] Buttons: color + shadow
  - [ ] All smooth and not jarring

### Accessibility Testing
- [ ] Light mode WCAG AA compliance
  - [ ] Text contrast ≥ 4.5:1
  - [ ] All buttons accessible
  - [ ] All links understandable
  - [ ] Form labels associated
  - [ ] Focus states visible

- [ ] Dark mode WCAG AA compliance
  - [ ] Text contrast ≥ 4.5:1
  - [ ] All text readable
  - [ ] All buttons accessible
  - [ ] Links visible and understandable
  - [ ] Focus states visible

- [ ] Keyboard navigation
  - [ ] Tab through all interactive elements
  - [ ] Enter/Space works for buttons
  - [ ] Escape closes modals/drawers
  - [ ] Focus visible on all elements
  - [ ] Logical tab order

- [ ] Responsive breakpoints
  - [ ] Mobile: 320px (iPhone SE)
  - [ ] Mobile: 375px (iPhone)
  - [ ] Tablet: 768px (iPad)
  - [ ] Desktop: 1024px
  - [ ] Desktop: 1440px
  - [ ] Large: 1920px
  - [ ] All look good, no overflow

- [ ] Images & alt text
  - [ ] All product images have alt text
  - [ ] Hero images have alt text
  - [ ] Category images have alt text
  - [ ] Decorative images have empty alt
  - [ ] All images load properly
  - [ ] Responsive sizing works

- [ ] Form accessibility
  - [ ] All inputs have labels
  - [ ] Labels associated with inputs
  - [ ] Error messages clear
  - [ ] Success messages clear
  - [ ] Required fields indicated
  - [ ] All fields keyboard accessible

### Performance Verification
- [ ] Build verification
  - [ ] `npm run build` succeeds
  - [ ] No errors in console
  - [ ] No warnings (or acceptable ones)
  - [ ] Build size stable/improved

- [ ] Lighthouse scores
  - [ ] Performance: ≥ 90
  - [ ] Accessibility: ≥ 90
  - [ ] Best Practices: ≥ 90
  - [ ] SEO: ≥ 90

- [ ] Core Web Vitals
  - [ ] LCP (Largest Contentful Paint): < 2.0s
  - [ ] FID (First Input Delay): < 100ms
  - [ ] CLS (Cumulative Layout Shift): < 0.1
  - [ ] All metrics green on real device

- [ ] Animation performance
  - [ ] No layout shifts during animations
  - [ ] 60fps on hover effects
  - [ ] Smooth transitions
  - [ ] No jank on page scroll

---

## Final Verification ⬜

- [ ] All new pages created
- [ ] All new pages accessible via footer/nav
- [ ] All footer links functional
- [ ] Dark mode works correctly
  - [ ] Toggle button visible
  - [ ] Theme persists
  - [ ] All pages styled correctly
  - [ ] System preference detected
- [ ] Product cards complete
  - [ ] Price displayed
  - [ ] Author visible
  - [ ] Bestseller badge shows
  - [ ] Add to cart button works
- [ ] Category pages
  - [ ] Grid layout (not diagonal)
  - [ ] Breadcrumbs visible
  - [ ] Products display correctly
- [ ] Homepage sections
  - [ ] Featured categories section
  - [ ] New arrivals section
  - [ ] Bestsellers section
  - [ ] Newsletter section
  - [ ] All properly spaced
- [ ] Cart page
  - [ ] 2-column layout (desktop)
  - [ ] Single column (mobile)
  - [ ] All controls work
  - [ ] Summary correct
- [ ] Mobile responsive
  - [ ] All pages tested
  - [ ] No overflow issues
  - [ ] Touch targets adequate
  - [ ] Text readable
- [ ] No performance regression
  - [ ] Build size similar
  - [ ] LCP still < 2.0s
  - [ ] Lighthouse scores 90+
- [ ] Accessibility
  - [ ] WCAG AA compliant
  - [ ] Keyboard navigation works
  - [ ] Screen reader friendly
  - [ ] Contrast sufficient
- [ ] No broken links
  - [ ] Internal links work
  - [ ] External links work
  - [ ] 404 page accessible

---

## Sign-Off

**Developer**: _______________

**Date Completed**: _______________

**Notes**:

