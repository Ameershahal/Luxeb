# Products API 500 Error Debugging Guide

## Error
`GET /api/products 500 in 563ms`

## Common Causes & Solutions

### 1. MongoDB Connection Issue

**Check:**
```bash
# Test MongoDB connection
curl http://localhost:3000/api/test-db
```

**If it fails:**
- Verify `MONGODB_URI` is set in `.env.local`
- Check MongoDB Atlas network access (should allow `0.0.0.0/0`)
- Verify database user credentials
- Check if MongoDB cluster is running

### 2. Product Model Not Found

**Symptoms:**
- Error mentions "Product is not defined" or "Cannot read property 'find'"

**Solution:**
- Ensure `lib/models/Product.ts` exists and exports correctly
- Check that Product model is properly imported
- Restart dev server after creating model

### 3. Empty Database (No Products)

**This is OK!** The API should return an empty array `[]`, not a 500 error.

If you get 500 with empty database, there's likely a query issue.

### 4. Check Server Logs

Look at your terminal/console where `npm run dev` is running. The error details will be logged there.

## Quick Fix Steps

1. **Test MongoDB Connection:**
   ```bash
   # Visit in browser or use curl
   http://localhost:3000/api/test-db
   ```

2. **Check Environment Variables:**
   ```bash
   # In .env.local, verify:
   MONGODB_URI=mongodb+srv://...
   ```

3. **Check Browser Console:**
   - Open browser DevTools
   - Go to Network tab
   - Click on the failed `/api/products` request
   - Check the Response tab for error details

4. **Check Server Terminal:**
   - Look for error logs in the terminal where `npm run dev` is running
   - The error message will show the exact issue

## Expected Behavior

### If Database is Empty:
```json
{
  "success": true,
  "products": []
}
```

### If MongoDB Connection Fails:
```json
{
  "success": false,
  "error": "Database connection failed...",
  "details": { ... }
}
```

## Next Steps

1. Check the server terminal for the exact error message
2. Test MongoDB connection with `/api/test-db`
3. Verify environment variables are set
4. If database is empty, that's fine - just add products via admin panel

## Still Having Issues?

Share the error message from:
- Server terminal (where `npm run dev` runs)
- Browser Network tab (Response for `/api/products`)
- `/api/test-db` endpoint response
