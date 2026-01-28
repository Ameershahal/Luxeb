# Vercel Not Deploying from Git - Troubleshooting Guide

## Your Git Repository
- **Repository**: `https://github.com/trizentautomotive1-design/luxe.git`
- **Branch**: `main`

## Common Reasons Vercel Doesn't Deploy

### Issue 1: Vercel Not Connected to Git Repository

**Check**:
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings → Git**
4. Check if it shows your GitHub repository

**If not connected**:
1. Click **"Connect Git Repository"**
2. Select GitHub
3. Find and select: `trizentautomotive1-design/luxe`
4. Click **"Import"**

### Issue 2: Wrong Branch Configured

**Check**:
1. Vercel Dashboard → Your Project → Settings → Git
2. Check **"Production Branch"** - should be `main`

**If wrong**:
1. Change Production Branch to `main`
2. Save
3. Redeploy

### Issue 3: Changes Not Pushed to Git

**Check**:
```bash
# Check if you have uncommitted changes
git status

# Check if you've pushed to remote
git log origin/main..main
```

**Fix**:
```bash
# If you have uncommitted changes:
git add .
git commit -m "Your commit message"
git push origin main
```

### Issue 4: Vercel Webhook Not Working

**Check**:
1. Go to GitHub: https://github.com/trizentautomotive1-design/luxe/settings/hooks
2. Look for Vercel webhook
3. Check if it's active and recent deliveries

**If webhook missing or broken**:
1. Go to Vercel → Settings → Git
2. Click **"Disconnect"** then **"Connect Git Repository"** again
3. This will recreate the webhook

### Issue 5: Build Failing Silently

**Check**:
1. Vercel Dashboard → Deployments tab
2. Look at latest deployment
3. Check if it shows "Error" or "Failed"

**If build failing**:
- Click on the failed deployment
- Check "Build Logs"
- Look for error messages
- Fix errors and push again

## Step-by-Step: Fix Vercel Git Connection

### Step 1: Verify Your Code is Pushed

```bash
# Check current status
git status

# If you have changes, commit and push:
git add .
git commit -m "Update cart functionality and fixes"
git push origin main
```

### Step 2: Check Vercel Connection

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your project

2. **Check Git Settings**
   - Settings → Git
   - Should show: `trizentautomotive1-design/luxe`
   - Production Branch: `main`

3. **If Not Connected**:
   - Click "Connect Git Repository"
   - Select GitHub
   - Authorize if needed
   - Select `trizentautomotive1-design/luxe`
   - Click "Import"

### Step 3: Verify Webhook

1. **Go to GitHub**
   - https://github.com/trizentautomotive1-design/luxe/settings/hooks
   - Should see a Vercel webhook
   - Status should be "Active"

2. **Test Webhook**
   - Make a small change (add a comment)
   - Commit and push
   - Check if Vercel automatically deploys

### Step 4: Manual Trigger (If Needed)

If automatic deployment isn't working:

1. **Vercel Dashboard → Deployments**
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Or click **"Create Deployment"** → Select branch `main`

## Quick Checklist

- [ ] Code pushed to GitHub (`git push origin main`)
- [ ] Vercel connected to correct repository
- [ ] Production branch set to `main`
- [ ] GitHub webhook active
- [ ] Latest commit shows in GitHub
- [ ] Vercel shows deployment triggered

## Force a New Deployment

### Option 1: Make a Small Change and Push

```bash
# Make a small change (like adding a comment)
# Then commit and push
git add .
git commit -m "Trigger deployment"
git push origin main
```

### Option 2: Manual Deployment in Vercel

1. Vercel Dashboard → Deployments
2. Click **"Create Deployment"**
3. Select branch: `main`
4. Click **"Deploy"**

### Option 3: Disconnect and Reconnect Git

1. Vercel → Settings → Git
2. Click **"Disconnect"**
3. Click **"Connect Git Repository"**
4. Select your repository again
5. This will trigger a new deployment

## Verify Deployment

After pushing or triggering deployment:

1. **Check Vercel Dashboard**
   - Go to Deployments tab
   - Should see new deployment starting
   - Status: "Building..." → "Ready"

2. **Check Build Logs**
   - Click on deployment
   - Check "Build Logs" for errors
   - Should see "Build Completed" ✅

3. **Test Your Site**
   - Visit: https://luxebeautyandtrainingacademy.com
   - Check if changes are live

## Still Not Working?

### Check These:

1. **GitHub Repository Access**
   - Make sure Vercel has access to your GitHub account
   - Vercel → Settings → Git → Check permissions

2. **Repository Visibility**
   - If private, make sure Vercel has access
   - Check GitHub → Settings → Applications → Vercel

3. **Branch Protection**
   - Check if `main` branch has protection rules
   - Might prevent webhook from working

4. **Vercel Plan Limits**
   - Check if you've hit deployment limits
   - Free plan has limits

## Need Help?

Share:
- Screenshot of Vercel → Settings → Git page
- Screenshot of GitHub → Settings → Hooks page
- Latest deployment status from Vercel
- Any error messages from build logs
