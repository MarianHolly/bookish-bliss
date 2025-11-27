# TEST 2: Input Validation on Checkout API

## Overview
This test verifies that the `/api/checkout` endpoint properly validates all input using Zod schemas and rejects invalid data with 400 errors.

## Files Tested
- `app/api/checkout/route.ts` - Checkout validation and processing

## Prerequisites
1. Have the app running: `npm run dev`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Add a product to cart and click "Proceed to Checkout"

## Test Cases

### Test 2.1: Valid Checkout Request
**Procedure:**
1. Add a book to cart
2. Go to checkout page
3. In Network tab, find POST request to `/api/checkout`
4. View the request body - should look like:
```json
{
  "products": [
    {
      "_id": "some-id",
      "name": "Book Title",
      "price": 19.99,
      "quantity": 1,
      "image": "...",
      "slug": {...},
      "category": [...],
      "author": "..."
    }
  ]
}
```

**Expected Result:**
- Request succeeds with 200 status
- Response contains: `{ "url": "https://checkout.stripe.com/..." }`
- Redirects to Stripe checkout
- No errors

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.2: Negative Price Rejection
**Procedure:**
1. In Network tab, find the `/api/checkout` POST request
2. Right-click → "Edit and Resend"
3. Modify the request body:
```json
{
  "products": [
    {
      "_id": "test-id",
      "name": "Hacked Book",
      "price": -100,
      "quantity": 1
    }
  ]
}
```
4. Send the request
5. Check the response

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Server logs show validation error (not processed)
- No Stripe charge attempt

**Why this matters:**
- Old code: `price: product.price * 100` with no validation
- Attacker could charge negative amounts (get refunded instead of paying)
- New code: `price: z.number().positive("Price must be positive")`
- Zod validation rejects price ≤ 0

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.3: Zero Quantity Rejection
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body:
```json
{
  "products": [
    {
      "_id": "test-id",
      "name": "Test Book",
      "price": 19.99,
      "quantity": 0
    }
  ]
}
```
3. Send the request
4. Check the response

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation catches zero quantity
- No checkout session created

**Why this matters:**
- Old code: No validation on quantity
- Attacker could add 0 quantity items (nonsense orders)
- New code: `quantity: z.number().int().positive("Quantity must be a positive integer")`
- Must be > 0

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.4: Negative Quantity Rejection
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body:
```json
{
  "products": [
    {
      "_id": "test-id",
      "name": "Test Book",
      "price": 19.99,
      "quantity": -5
    }
  ]
}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation rejects negative quantity

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.5: Missing Product ID
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body (remove `_id`):
```json
{
  "products": [
    {
      "name": "Test Book",
      "price": 19.99,
      "quantity": 1
    }
  ]
}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation requires `_id` field

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.6: Missing Product Name
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body (remove `name`):
```json
{
  "products": [
    {
      "_id": "test-id",
      "price": 19.99,
      "quantity": 1
    }
  ]
}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation requires `name` field

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.7: Empty Product Array
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body:
```json
{
  "products": []
}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation requires at least 1 product

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.8: Invalid Price Format (String instead of Number)
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body:
```json
{
  "products": [
    {
      "_id": "test-id",
      "name": "Test Book",
      "price": "not-a-number",
      "quantity": 1
    }
  ]
}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation requires `price` to be a number

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.9: Invalid Quantity Format (Float instead of Integer)
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body:
```json
{
  "products": [
    {
      "_id": "test-id",
      "name": "Test Book",
      "price": 19.99,
      "quantity": 1.5
    }
  ]
}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation requires `quantity` to be an integer

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.10: Very Large Price
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body:
```json
{
  "products": [
    {
      "_id": "test-id",
      "name": "Test Book",
      "price": 999999999999,
      "quantity": 1
    }
  ]
}
```
3. Send the request

**Expected Result:**
- Status: **200 OK** (valid - large but positive number)
- Should create Stripe session with large amount
- Stripe will handle it as valid

**Note:** This tests that we don't artificially limit price. Only validation is that it's positive.

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.11: Extremely Long Product Name
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Modify the request body:
```json
{
  "products": [
    {
      "_id": "test-id",
      "name": "A".repeat(500),
      "price": 19.99,
      "quantity": 1
    }
  ]
}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation limits name to max 200 chars

**Why this matters:**
- Prevents buffer overflow or storage issues
- Old code: No limit, could receive massive strings

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2.12: Missing Entire Products Array
**Procedure:**
1. Edit and resend `/api/checkout` request
2. Send empty JSON object:
```json
{}
```
3. Send the request

**Expected Result:**
- Status: **400 Bad Request**
- Response: `{ "error": "Invalid request data" }`
- Validation requires `products` field

**Status:** ✅ PASS / ❌ FAIL

---

## Server Console Checks

While running these tests, check the server console (`npm run dev` terminal):

**Expected:**
- No Stripe API keys should be logged
- Errors should show as: `[checkout] Invalid...` format
- No full error objects or stack traces in production (only in dev)

**Example Good Log:**
```
[checkout] Product creation failed
```

**Example Bad Log (DON'T SEE THIS):**
```
sk_test_51Ok9HJF... Invalid request
Error: {...full error object with sensitive data...}
```

---

## Summary

| Test | Result | Notes |
|------|--------|-------|
| 2.1 - Valid Request | ✅/❌ | Must pass for checkout to work |
| 2.2 - Negative Price | ✅/❌ | Critical - prevents free/refund attack |
| 2.3 - Zero Quantity | ✅/❌ | Critical - prevents nonsense orders |
| 2.4 - Negative Quantity | ✅/❌ | Critical - prevents abuse |
| 2.5 - Missing _id | ✅/❌ | Critical - requires all fields |
| 2.6 - Missing Name | ✅/❌ | Critical - requires all fields |
| 2.7 - Empty Array | ✅/❌ | Critical - requires at least 1 product |
| 2.8 - Invalid Price Type | ✅/❌ | Critical - type validation |
| 2.9 - Float Quantity | ✅/❌ | Critical - integer only |
| 2.10 - Very Large Price | ✅/❌ | Should allow (Stripe handles) |
| 2.11 - Long Product Name | ✅/❌ | Critical - limits to 200 chars |
| 2.12 - Missing Array | ✅/❌ | Critical - requires products |

**Overall Status:** ✅ ALL PASS / ⚠️ SOME FAILURES

## Technical Details

### Validation Schema:
```typescript
const ProductSchema = z.object({
  _id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required").max(200),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  // ... optional fields
});

const CheckoutSchema = z.object({
  products: z.array(ProductSchema).min(1, "At least one product is required"),
});
```

### Validation Flow:
1. Parse request body as JSON
2. Run `CheckoutSchema.safeParse(body)`
3. If validation fails: Return 400 Bad Request
4. If validation passes: Continue with checkout

This prevents any malformed or malicious data from reaching Stripe or the database.
