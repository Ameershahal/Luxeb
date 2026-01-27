# Cart Not Working in Production - Debugging Guide

## Common Issues & Solutions

### Issue 1: Cart Count Not Updating
**Symptoms**: Items added but cart badge doesn't show count

**Possible Causes**:
1. JavaScript errors preventing state updates
2. localStorage blocked by browser
3. React state not re-rendering

**Solutions**:
- ✅ Added `isMounted` check to prevent SSR issues
- ✅ Added event listener for cart updates
- ✅ Added local state in navbar to force re-render

### Issue 2: Not Redirecting to Checkout
**Symptoms**: Click "Proceed to Checkout" but nothing happens

**Possible Causes**:
1. API route failing
2. JavaScript error preventing redirect
3. Stripe API key issues

**Solutions**:
- ✅ Added better error handling
- ✅ Added loading state
- ✅ Added console logging

## How to Debug

### Step 1: Check Browser Console

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Try adding item to cart**
4. **Look for errors** (red messages)

**Common Errors**:
- `localStorage is not defined` → SSR issue (should be fixed now)
- `Cannot read property 'addToCart'` → Cart context not loaded
- `Failed to fetch` → API route issue
- `Stripe error` → API key or configuration issue

### Step 2: Check Network Tab

1. **Open DevTools → Network tab**
2. **Try adding to cart**
3. **Look for `/api/create-checkout-session` request**
4. **Check if it succeeds (200) or fails (400/500)**

**If request fails**:
- Check the error message
- Verify Stripe keys in Vercel
- Check API route logs

### Step 3: Check localStorage

1. **Open DevTools → Application tab (Chrome) or Storage tab (Firefox)**
2. **Go to Local Storage → Your domain**
3. **Look for `luxe-beauty-cart`**
4. **Check if it updates when you add items**

**If localStorage is empty**:
- Browser might be blocking it
- Try in incognito mode
- Check browser privacy settings

### Step 4: Test API Route Directly

Visit: `https://luxebeautyandtrainingacademy.com/api/test-db`

Should return: `{ success: true }`

If it fails, MongoDB connection issue.

## Quick Fixes

### Fix 1: Clear Browser Cache
```bash
# In browser:
Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
# Clear cache and cookies
# Reload page
```

### Fix 2: Check Vercel Environment Variables
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Verify all variables are set
4. Redeploy

### Fix 3: Check Browser Console for Errors
- Open DevTools (F12)
- Console tab
- Look for red error messages
- Share errors if you need help

## Production vs Local Differences

### Why It Works Locally But Not in Production:

1. **Environment Variables**
   - Local: Uses `.env.local`
   - Production: Uses Vercel environment variables
   - **Fix**: Add all env vars to Vercel

2. **Build Process**
   - Local: Development mode (hot reload)
   - Production: Optimized build
   - **Fix**: Check build logs for errors

3. **API Routes**
   - Local: `localhost:3000/api/...`
   - Production: `https://luxebeautyandtrainingacademy.com/api/...`
   - **Fix**: Verify API routes work in production

4. **Browser Settings**
   - Local: Usually allows localStorage
   - Production: Some browsers block localStorage
   - **Fix**: Check browser console for localStorage errors

## Testing Checklist

- [ ] Open browser console (F12)
- [ ] Try adding item to cart
- [ ] Check for JavaScript errors
- [ ] Check Network tab for API calls
- [ ] Verify localStorage has cart data
- [ ] Try checkout - check for errors
- [ ] Test in incognito mode
- [ ] Test on different browser

## Still Not Working?

Share these details:
1. **Browser console errors** (screenshot)
2. **Network tab** - failed requests (screenshot)
3. **What happens** when you click "Add to Cart"
4. **What happens** when you click "Proceed to Checkout"
5. **Browser and version** (Chrome, Firefox, Safari, etc.)
