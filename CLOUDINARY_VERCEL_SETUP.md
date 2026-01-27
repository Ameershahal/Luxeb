# Cloudinary Setup for Vercel Production

## ✅ Local Setup Complete

You've successfully configured Cloudinary in your `.env.local` file:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dg95jeppy`
- `CLOUDINARY_API_KEY=335112954767467`
- `CLOUDINARY_API_SECRET=QoXWF4Rr_u6r79_fb_yR_n45V5s`
- `CLOUDINARY_URL=cloudinary://335112954767467:QoXWF4Rr_u6r79_fb_yR_n45V5s@dg95jeppy`

## ⚠️ Important: Add to Vercel

**These environment variables are only set locally.** You need to add them to Vercel for production!

## Steps to Add Cloudinary to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `luxe-beauty` (or your project name)

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add Each Variable**
   Add these 4 environment variables:

   **Variable 1:**
   - **Key**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **Value**: `dg95jeppy`
   - **Environment**: Select all (Production, Preview, Development)

   **Variable 2:**
   - **Key**: `CLOUDINARY_API_KEY`
   - **Value**: `335112954767467`
   - **Environment**: Select all (Production, Preview, Development)

   **Variable 3:**
   - **Key**: `CLOUDINARY_API_SECRET`
   - **Value**: `QoXWF4Rr_u6r79_fb_yR_n45V5s`
   - **Environment**: Select all (Production, Preview, Development)

   **Variable 4 (Optional but recommended):**
   - **Key**: `CLOUDINARY_URL`
   - **Value**: `cloudinary://335112954767467:QoXWF4Rr_u6r79_fb_yR_n45V5s@dg95jeppy`
   - **Environment**: Select all (Production, Preview, Development)

4. **Save and Redeploy**
   - Click **Save** after adding each variable
   - After adding all variables, trigger a new deployment:
     - Go to **Deployments** tab
     - Click **Redeploy** on the latest deployment
     - Or push a new commit to trigger automatic deployment

## Verify Cloudinary is Working

### Test Upload Endpoint

After deploying, test the upload endpoint:

```bash
# Test locally (should work)
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/test-image.jpg"

# Test production (after adding env vars to Vercel)
curl -X POST https://luxebeautyandtrainingacademy.com/api/upload \
  -F "file=@/path/to/test-image.jpg"
```

### Expected Response

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/dg95jeppy/image/upload/v1234567890/luxe-beauty/...",
  "public_id": "luxe-beauty/..."
}
```

## Where Cloudinary is Used

1. **Admin Gallery Upload** (`/admin/gallery`)
   - Upload portfolio images
   - Currently uses manual URL input, but Cloudinary API is ready

2. **File Upload API** (`/api/upload`)
   - Endpoint: `POST /api/upload`
   - Accepts file uploads
   - Returns Cloudinary URL

3. **Future Features**
   - Product image uploads
   - Course image uploads
   - Profile picture uploads

## Security Notes

✅ **Good Practices:**
- `CLOUDINARY_API_SECRET` is server-side only (not prefixed with `NEXT_PUBLIC_`)
- Upload endpoint validates file types
- Files are uploaded to `luxe-beauty` folder in Cloudinary

⚠️ **Recommendations:**
- Consider adding file size limits
- Add file type validation (images only)
- Consider adding authentication to upload endpoint

## Cloudinary Dashboard

You can manage your uploaded files at:
- **Dashboard**: https://cloudinary.com/console
- **Media Library**: https://cloudinary.com/console/media_library

## Troubleshooting

### Error: "Cloudinary is not configured"
- **Cause**: Environment variables not set in Vercel
- **Fix**: Add all Cloudinary env vars to Vercel Dashboard

### Error: "Upload failed"
- **Cause**: Invalid API credentials or network issue
- **Fix**: Verify credentials in Cloudinary Dashboard → Settings → API Keys

### Images not appearing
- **Cause**: CORS or URL issues
- **Fix**: Check Cloudinary settings → Security → Allowed URL patterns

## Next Steps

1. ✅ Add Cloudinary env vars to Vercel (Critical!)
2. ✅ Test upload endpoint after deployment
3. ⚠️ Consider adding file upload UI to admin gallery page
4. ⚠️ Add file size/type validation
5. ⚠️ Add authentication to upload endpoint

---

**Remember**: Cloudinary credentials are configured locally but **must be added to Vercel** for production to work!
