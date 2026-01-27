# Cloudinary Upload "Stale Request" Fix

## Problem
Getting "Stale request" error when uploading images. This happens because Cloudinary's signed uploads include timestamps that expire after 1 hour.

## Solution Applied

### 1. Updated Upload Route
- Changed from `uploader.upload()` to `upload_stream()` method
- Fresh Cloudinary config for each request
- Better error handling with helpful messages
- File validation (type and size)

### 2. Updated Admin Page
- Added file type validation
- Added file size validation (10MB max)
- Better error messages

## Optional: Use Upload Preset (Recommended)

For even better reliability, create an unsigned upload preset in Cloudinary:

### Steps:
1. Go to Cloudinary Dashboard: https://cloudinary.com/console
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `luxe-beauty-unsigned` (or any name)
   - **Signing mode**: **Unsigned**
   - **Folder**: `luxe-beauty`
   - **Resource type**: **Auto**
5. Click **Save**

### Add to Environment Variables:
Add to `.env.local` and Vercel:
```env
CLOUDINARY_UPLOAD_PRESET=luxe-beauty-unsigned
```

This will use unsigned uploads which don't have timestamp expiration issues.

## Current Status

✅ **Fixed**: Upload route now uses `upload_stream()` which is more reliable
✅ **Fixed**: Better error handling and validation
✅ **Fixed**: Fresh Cloudinary config per request

## Testing

1. Go to `/admin/products`
2. Click "Add Product" or edit existing product
3. Click "Upload" button
4. Select an image file
5. Image should upload successfully

If you still get errors:
- Check Cloudinary credentials in Vercel
- Verify file is an image and under 10MB
- Try creating an upload preset (see above)
