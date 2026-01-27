# Products API Troubleshooting Guide

## Error: "API Error: {}"

This error occurs when the `/api/products` endpoint returns an error, but the error object appears empty.

## Quick Diagnosis Steps

### 1. Check Server Terminal Logs

Look at your terminal where `npm run dev` is running. You should see detailed error logs like:
```
Error fetching products: [error details]
Error name: [error name]
Error message: [error message]
Error stack: [stack trace]
```

### 2. Test MongoDB Connection

Visit in your browser:
```
http://localhost:3000/api/test-db
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "MongoDB connection successful!",
  "timestamp": "2026-01-27T..."
}
```

**If it fails:**
- Check `MONGODB_URI` in `.env.local`
- Verify MongoDB Atlas network access (should allow `0.0.0.0/0`)
- Check database credentials

### 3. Check Browser Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh `/admin/products`
4. Click on the failed `/api/products` request
5. Check:
   - **Status Code**: Should show the actual HTTP status (500, 404, etc.)
   - **Response Tab**: Shows the actual error response
   - **Headers Tab**: Check if `Content-Type` is `application/json`

### 4. Common Causes & Solutions

#### A. MongoDB Connection Failed

**Symptoms:**
- Error message mentions "connection" or "Mongo"
- `/api/test-db` fails

**Solution:**
1. Verify `MONGODB_URI` in `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```
2. Check MongoDB Atlas:
   - Network Access: Add `0.0.0.0/0` (allow all IPs)
   - Database Access: Verify user has read/write permissions
3. Restart dev server after changing `.env.local`

#### B. Product Model Not Found

**Symptoms:**
- Error mentions "Product is not defined" or "Cannot read property 'find'"

**Solution:**
1. Ensure `lib/models/Product.ts` exists
2. Restart dev server
3. Check for TypeScript compilation errors

#### C. Empty Database (This is OK!)

**Expected Behavior:**
- API should return: `{ success: true, products: [] }`
- Admin page should show "No products found"

**If you get 500 error with empty database:**
- This indicates a connection or query issue, not an empty database issue

#### D. Response Not JSON

**Symptoms:**
- Browser shows HTML error page instead of JSON
- Network tab shows `Content-Type: text/html`

**Solution:**
- Check server logs for the actual error
- Verify API route is accessible
- Check for middleware issues

## Debugging Commands

### Check if API is accessible:
```bash
# In browser console or terminal
fetch('/api/products')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Check MongoDB connection:
```bash
# Visit in browser
http://localhost:3000/api/test-db
```

## Expected API Response

### Success (with products):
```json
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "Product Name",
      "price": 48,
      ...
    }
  ]
}
```

### Success (empty database):
```json
{
  "success": true,
  "products": []
}
```

### Error:
```json
{
  "success": false,
  "error": "Error message here",
  "message": "Error message here",
  "details": {
    "name": "ErrorName",
    "mongoUriSet": true
  }
}
```

## Next Steps

1. **Check server terminal** for detailed error logs
2. **Test MongoDB** with `/api/test-db`
3. **Check browser Network tab** for actual response
4. **Share the error details** from:
   - Server terminal logs
   - Browser Network tab response
   - `/api/test-db` response

## Still Having Issues?

Share:
1. Server terminal error output
2. Browser Network tab response for `/api/products`
3. Response from `/api/test-db`
4. Your `.env.local` (with sensitive data redacted)
