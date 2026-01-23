# Vercel Deployment Guide

## Common Issues and Solutions

### 1. Environment Variables (REQUIRED)

Your project uses Cloudinary for file uploads. You **must** set these environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these three variables:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Important:** 
- Replace `your_actual_*` with your real Cloudinary credentials
- Make sure to add them for **Production**, **Preview**, and **Development** environments
- After adding, **redeploy** your project

### 2. Build Configuration

Your `next.config.mjs` is configured correctly:
- TypeScript errors are ignored (for now)
- Images are unoptimized (works for static exports if needed)

### 3. Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables** (see step 1)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Check build logs for any errors

### 4. Common Build Errors

#### Error: "Module not found" or "Cannot find module"
- **Solution:** Make sure all dependencies are in `package.json` and run `npm install` locally first

#### Error: "Environment variable not found"
- **Solution:** Add all required environment variables in Vercel dashboard

#### Error: "Build failed" or "TypeScript errors"
- **Solution:** Your config has `ignoreBuildErrors: true`, but check the build logs for specific issues

### 5. Testing the Build Locally

Before deploying, test the build locally:

```bash
npm run build
```

If this fails, fix the errors before deploying to Vercel.

### 6. If Upload Feature Doesn't Work

If the Cloudinary upload API route fails:
- Check that environment variables are set correctly
- Verify your Cloudinary credentials are valid
- Check Vercel function logs in the dashboard

### 7. Optional: Create `vercel.json` for Custom Configuration

If you need custom routing or headers, create a `vercel.json` file:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## Quick Checklist

- [ ] Code is pushed to Git repository
- [ ] Environment variables are set in Vercel
- [ ] `npm run build` works locally
- [ ] All dependencies are in `package.json`
- [ ] No critical errors in build logs

## Need Help?

If deployment still fails:
1. Check the build logs in Vercel dashboard
2. Share the specific error message
3. Verify all environment variables are correct
