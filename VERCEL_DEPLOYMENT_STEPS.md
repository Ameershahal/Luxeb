# How to Deploy Updates to Vercel

## Why Changes Don't Appear in Production

If everything works locally but not on Vercel, it's usually because:
1. **Code hasn't been pushed to Git** - Vercel deploys from your Git repository
2. **Environment variables missing** - Vercel needs all environment variables set
3. **Need to redeploy** - After adding environment variables, you need to redeploy

## Step-by-Step: Deploy Your Changes

### Step 1: Commit and Push Your Code

```bash
# Check what files have changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Add Stripe payment integration and cart functionality"

# Push to GitHub/GitLab/Bitbucket
git push origin main
```

**Important**: Make sure your code is pushed to the branch that Vercel is watching (usually `main` or `master`).

### Step 2: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `luxe-beauty` (or your project name)

2. **Navigate to Settings → Environment Variables**

3. **Add ALL these variables** (copy from your `.env.local`):

   **Stripe:**
   ```
   STRIPE_SECRET_KEY=sk_live_REDACTED
   STRIPE_WEBHOOK_SECRET=whsec_hgeAJjwH5Xc4ErWCHPYw2mczYRd9stMz
   NEXT_PUBLIC_SITE_URL=https://luxebeautyandtrainingacademy.com
   ```

   **MongoDB** (replace `<db_password>` with your actual password):
   ```
   MONGODB_URI=mongodb+srv://onwaroventures_db_user:YOUR_ACTUAL_PASSWORD@cluster0.k4jugr1.mongodb.net/luxe-beauty?retryWrites=true&w=majority&appName=Cluster0
   ```

   **Cloudinary** (if using):
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Set Environment** for each variable:
   - ✅ **Production**
   - ✅ **Preview** 
   - ✅ **Development**

5. **Click "Save"** after adding each variable

### Step 3: Redeploy Your Project

After adding environment variables, you MUST redeploy:

**Option A: Automatic (if you pushed code)**
- Vercel will automatically deploy when you push to Git
- Check the "Deployments" tab to see the new deployment

**Option B: Manual Redeploy**
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (2-5 minutes)

### Step 4: Verify Deployment

1. **Check Build Logs**
   - Go to **Deployments** → Click on the latest deployment
   - Check "Build Logs" for any errors
   - Should see "Build Completed" ✅

2. **Test Your Site**
   - Visit: https://luxebeautyandtrainingacademy.com
   - Test cart functionality
   - Test checkout
   - Check if Stripe payments work

3. **Test API Endpoints**
   - Visit: `https://luxebeautyandtrainingacademy.com/api/test-db`
   - Should return: `{ success: true, message: "MongoDB connection successful!" }`

## Common Issues & Solutions

### Issue: "Changes not showing"
**Solution**: 
- Make sure you pushed code to Git
- Check Vercel is connected to the correct branch
- Redeploy manually

### Issue: "Environment variable not found"
**Solution**:
- Double-check variable names (case-sensitive!)
- Make sure you added them for Production environment
- Redeploy after adding variables

### Issue: "Stripe errors"
**Solution**:
- Verify `STRIPE_SECRET_KEY` starts with `sk_live_` (not `pk_live_`)
- Check webhook secret is correct (`whsec_...`)
- Make sure webhook endpoint URL in Stripe matches your Vercel URL

### Issue: "MongoDB connection failed"
**Solution**:
- Replace `<db_password>` with actual password
- Check MongoDB Atlas → Network Access (allow 0.0.0.0/0)
- Verify connection string format is correct

## Quick Checklist

- [ ] Code pushed to Git (`git push`)
- [ ] All environment variables added to Vercel
- [ ] Environment variables set for Production
- [ ] Project redeployed (automatic or manual)
- [ ] Build completed successfully
- [ ] Tested on production URL

## Still Not Working?

1. **Check Vercel Build Logs**
   - Look for error messages
   - Common errors: missing env vars, build failures

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed API calls

3. **Verify Environment Variables**
   - Go to Vercel → Settings → Environment Variables
   - Make sure all variables are there
   - Check they're set for Production

4. **Test API Routes**
   - Visit `/api/test-db` to test MongoDB
   - Check if Stripe checkout creates sessions

## Need Help?

Share:
- Vercel build logs (if any errors)
- Browser console errors
- Which specific feature isn't working
- Screenshot of Vercel environment variables page
