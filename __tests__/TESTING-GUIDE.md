# Security Hardening Testing Guide

## Quick Start

### Prerequisites
- App running locally: `npm run dev`
- Browser DevTools open: Press `F12`
- All environment variables configured in `.env.local`

---

## Test 1: GROQ Injection Protection

**File:** `__tests__/test-1-groq-injection.md`

### Quick Test (5 minutes)
1. Go to `http://localhost:3000/products`
2. Try searching for: `JavaScript` → Should work ✓
3. Try searching for: `"); count()` → Should be safe ✓
4. Try selecting a category → Should filter correctly ✓
5. Check console for errors → Should be none ✓

### Detailed Testing
Follow all 8 test cases in `test-1-groq-injection.md`

### What You're Testing
- Search/filter queries are parameterized (not string interpolation)
- Injection payloads cannot modify the GROQ query
- All query results are legitimate

---

## Test 2: Input Validation on Checkout

**File:** `__tests__/test-2-input-validation.md`

### Quick Test (10 minutes)

**Setup:**
1. Add a book to cart
2. Click "Proceed to Checkout"
3. Open DevTools Network tab (F12 → Network)
4. Find POST request to `/api/checkout`
5. Right-click → "Edit and Resend"

**Test Valid Request:**
1. Send the request as-is
2. Should get 200 OK ✓
3. Should redirect to Stripe checkout ✓

**Test Invalid Request (Negative Price):**
1. Edit the request body, change price to `-100`
2. Send the request
3. Should get **400 Bad Request** ✓
4. Should see error message ✓

**Test Invalid Request (Zero Quantity):**
1. Edit the request body, change quantity to `0`
2. Send the request
3. Should get **400 Bad Request** ✓

### Detailed Testing
Follow all 12 test cases in `test-2-input-validation.md`

### What You're Testing
- All product fields are validated
- Invalid data is rejected with 400 errors
- Zod schema prevents attacks

---

## How to Edit and Resend Requests

### Chrome/Edge DevTools:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Make a request (click checkout button)
4. Right-click the request → **Edit and resend**
5. Modify the request body in the popup
6. Click **Send**

### Firefox DevTools:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Find the request
4. Right-click → **Edit and Resend**
5. Modify and send

### Manual Request with curl:
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "products": [
      {
        "_id": "test",
        "name": "Book",
        "price": -50,
        "quantity": 1
      }
    ]
  }'
```

---

## Expected Results Summary

### Test 1: GROQ Injection
| Scenario | Expected | Status |
|----------|----------|--------|
| Search "JavaScript" | Works normally | ✅ |
| Search `"); count()` | Blocked/safe | ✅ |
| Category filter | Works normally | ✅ |
| Category injection | Blocked/safe | ✅ |
| Product detail page | Works normally | ✅ |
| Product detail injection | 404 or safe | ✅ |

### Test 2: Input Validation
| Scenario | Status Code | Response |
|----------|-------------|----------|
| Valid checkout | 200 | `{ "url": "https://..." }` |
| Negative price | 400 | `{ "error": "Invalid request data" }` |
| Zero quantity | 400 | `{ "error": "Invalid request data" }` |
| Missing field | 400 | `{ "error": "Invalid request data" }` |
| Invalid type | 400 | `{ "error": "Invalid request data" }` |
| Empty array | 400 | `{ "error": "Invalid request data" }` |

---

## Checking Server Logs

### Good Error Logs:
```
[checkout] Error message without sensitive data
[session] Invalid session ID
```

### Bad Error Logs (DON'T SEE):
```
sk_test_51Ok9HJF1IXYkC9JQ...  (actual API key)
Error: {full error object}
stack trace with secrets
```

---

## Test Checklist

### Test 1 (GROQ Injection)
- [ ] Normal search works
- [ ] Injection payloads blocked
- [ ] Category filter works
- [ ] Category injection blocked
- [ ] Product detail page works
- [ ] Product detail injection blocked

### Test 2 (Input Validation)
- [ ] Valid checkout succeeds
- [ ] Negative price rejected
- [ ] Zero quantity rejected
- [ ] Missing fields rejected
- [ ] Invalid types rejected
- [ ] Empty array rejected

### Overall
- [ ] No API keys in console logs
- [ ] Error messages are user-friendly
- [ ] No crashes or 500 errors
- [ ] All 20+ test cases pass

---

## Troubleshooting

### "API key is missing" error
- Check `.env.local` has `STRIPE_SECRET_KEY`
- Restart dev server after adding env vars

### "Too many requests" (429 error)
- Rate limiting is working! Wait 1 hour or restart server
- Or test that rate limiting works as expected

### "CORS policy violation"
- Check request has `Origin: http://localhost:3000` header
- Should be automatic if testing from localhost

### Validation not working
- Make sure you installed dependencies: `npm install zod @upstash/ratelimit @upstash/redis`
- Check `app/api/checkout/route.ts` line 4 imports `zod`
- Restart dev server

---

## Time Estimates

| Test | Time | Difficulty |
|------|------|-----------|
| Test 1 (Quick) | 5 min | Easy |
| Test 1 (Full) | 15 min | Easy |
| Test 2 (Quick) | 10 min | Medium |
| Test 2 (Full) | 30 min | Medium |
| All Tests | 60 min | Medium |

---

## When You're Done

After all tests pass, you can:
1. Commit the security changes
2. Deploy to production
3. Add test results to portfolio documentation

```bash
git add .
git commit -m "test: add security testing suite for GROQ injection and input validation"
```

---

## Questions?

Refer to the detailed test files:
- `__tests__/test-1-groq-injection.md` - GROQ injection details
- `__tests__/test-2-input-validation.md` - Input validation details

Each test has:
- Clear procedures
- Expected results
- Why it matters (security context)
- Technical details (what changed)
