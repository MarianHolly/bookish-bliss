# TEST 1: GROQ Injection Protection

## Overview
This test verifies that GROQ query injection payloads are properly parameterized and cannot be exploited.

## Files Tested
- `app/products/page.tsx` - Search and filter queries
- `app/product/[slug]/page.tsx` - Product detail query
- `app/category/[slug]/page.tsx` - Category and product queries

## Test Cases

### Test 1.1: Search with Normal Input
**Procedure:**
1. Navigate to `http://localhost:3000/products`
2. Use the search box to search for: `JavaScript`
3. Observe the results

**Expected Result:**
- Search returns matching books
- No errors in console
- URL shows: `/products?search=JavaScript`
- Results display normally

**Status:** ✅ PASS / ❌ FAIL

---

### Test 1.2: Search with GROQ Injection Payload
**Procedure:**
1. Navigate to `http://localhost:3000/products`
2. Use the search box to search for: `"); count()`
3. Observe behavior

**Expected Result:**
- No GROQ injection occurs
- Either no results OR graceful error handling
- No console errors related to query syntax
- Server does NOT execute injected code

**Why this matters:**
- The old code was: `&& name match "${search}"`
- Attacker could inject: `"); count()` to become `&& name match ""); count()"`
- Now it's parameterized: `&& name match $searchTerm` with params
- The parameter value is treated as a literal string, not executable code

**Status:** ✅ PASS / ❌ FAIL

---

### Test 1.3: Search with SQL-like Injection
**Procedure:**
1. Navigate to `http://localhost:3000/products`
2. Search for: `* UNION SELECT`
3. Observe behavior

**Expected Result:**
- No injection occurs
- Results handled normally or empty
- No console errors

**Status:** ✅ PASS / ❌ FAIL

---

### Test 1.4: Category Filter with Normal Input
**Procedure:**
1. Navigate to `http://localhost:3000/products`
2. Select a category from the filter
3. Observe results

**Expected Result:**
- Products filtered by selected category
- Correct books display
- No errors
- URL shows: `/products?category=fiction` (or similar)

**Why this matters:**
- The old code was: `slug.current == "${category}"`
- Now it's parameterized with category parameter
- Filter uses the slug as a literal value

**Status:** ✅ PASS / ❌ FAIL

---

### Test 1.5: Category Filter with Injection Payload
**Procedure:**
1. Navigate to `http://localhost:3000/products?category=");%20count()`
2. Or manually modify URL to inject payload
3. Observe behavior

**Expected Result:**
- No injection occurs
- Either no results or 404 (category not found)
- No console errors
- Server handles safely

**Status:** ✅ PASS / ❌ FAIL

---

### Test 1.6: Publisher Filter
**Procedure:**
1. Navigate to `http://localhost:3000/products`
2. Select a publisher from the filter (if available)
3. Observe results

**Expected Result:**
- Products filtered by publisher
- Correct display
- No errors

**Status:** ✅ PASS / ❌ FAIL

---

### Test 1.7: Product Detail Page
**Procedure:**
1. Navigate to any product detail page: `http://localhost:3000/product/[slug]`
2. Page should load normally
3. Try modifying URL slug to injection payload: `http://localhost:3000/product/");%20count()`
4. Observe behavior

**Expected Result:**
- Valid product slug: Shows product details
- Invalid/injection payload: 404 or graceful error
- No console errors

**Why this matters:**
- The old code was: `slug.current == "${params.slug}"`
- Now it's parameterized: `slug.current == $slug`
- Slug is treated as a literal value

**Status:** ✅ PASS / ❌ FAIL

---

### Test 1.8: Category Page
**Procedure:**
1. Navigate to a category page: `http://localhost:3000/category/[slug]`
2. Page loads category and products
3. Try injection in URL: `http://localhost:3000/category/");%20count()`
4. Observe behavior

**Expected Result:**
- Valid category slug: Shows category and products
- Invalid/injection payload: 404 or graceful error
- No console errors

**Status:** ✅ PASS / ❌ FAIL

---

## Summary

| Test | Result | Notes |
|------|--------|-------|
| 1.1 - Normal Search | ✅/❌ | |
| 1.2 - Search Injection | ✅/❌ | Critical - injection blocked |
| 1.3 - SQL-like Injection | ✅/❌ | Syntax not applicable but test anyway |
| 1.4 - Normal Category Filter | ✅/❌ | |
| 1.5 - Category Injection | ✅/❌ | Critical - injection blocked |
| 1.6 - Publisher Filter | ✅/❌ | |
| 1.7 - Product Detail Page | ✅/❌ | Critical - parameterized slug |
| 1.8 - Category Page | ✅/❌ | Critical - parameterized queries |

**Overall Status:** ✅ ALL PASS / ⚠️ SOME FAILURES

## Technical Details

### Before (Vulnerable):
```typescript
const searchFilter = search ? `&& name match "${search}"` : "";
const categoryFilter = category ? ` && references(*[_type=="category" && slug.current == "${category}"]._id)` : "";
```

### After (Secure):
```typescript
if (searchTerm) {
  query += ` && name match $searchTerm`;
  params.searchTerm = searchTerm;
}
if (categorySlug) {
  query += ` && references(*[_type=="category" && slug.current == $categorySlug]._id)`;
  params.categorySlug = categorySlug;
}

const data = await client.fetch(query, params);
```

The `client.fetch()` method from `next-sanity` properly escapes and parameterizes the values, preventing injection attacks.
