# Deployment Checklist - Luxe Beauty & Training

## ✅ Completed

### Stripe Payment Integration
- [x] Stripe secret key configured (`sk_live_...`)
- [x] Stripe webhook secret configured (`whsec_...`)
- [x] Webhook endpoint configured in Stripe Dashboard
- [x] Payment checkout flow implemented
- [x] Webhook handler saves to MongoDB

### Features Implemented
- [x] Shopping cart functionality
- [x] Product checkout
- [x] Booking payment
- [x] Course enrollment payment
- [x] MongoDB models (Booking, Order, CourseEnrollment)

## ⚠️ Action Required

### MongoDB Configuration
**Status**: Connection string has placeholder password

**Action Required**:
1. Replace `<db_password>` in `.env.local` with your actual MongoDB password
2. Add `MONGODB_URI` to Vercel environment variables with real password
3. Test connection: Visit `/api/test-db` to verify

**Current**: 
```env
MONGODB_URI=mongodb+srv://onwaroventures_db_user:<db_password>@cluster0.k4jugr1.mongodb.net/luxe-beauty?retryWrites=true&w=majority&appName=Cluster0
```

**Should be**:
```env
MONGODB_URI=mongodb+srv://onwaroventures_db_user:YOUR_ACTUAL_PASSWORD@cluster0.k4jugr1.mongodb.net/luxe-beauty?retryWrites=true&w=majority&appName=Cluster0
```

### Cloudinary (Optional - for file uploads)
**Status**: Placeholder values

**Action Required** (if using file uploads):
1. Get Cloudinary credentials from https://cloudinary.com
2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=your_actual_api_key
   CLOUDINARY_API_SECRET=your_actual_api_secret
   ```
3. Add to Vercel environment variables

## 📋 Vercel Deployment Checklist

### Environment Variables to Add in Vercel:

1. **Stripe** (✅ Ready)
   ```
   STRIPE_SECRET_KEY=sk_live_REDACTED
   STRIPE_WEBHOOK_SECRET=whsec_hgeAJjwH5Xc4ErWCHPYw2mczYRd9stMz
   NEXT_PUBLIC_SITE_URL=https://luxebeautyandtrainingacademy.com
   ```

2. **MongoDB** (⚠️ Needs password)
   ```
   MONGODB_URI=mongodb+srv://onwaroventures_db_user:YOUR_PASSWORD@cluster0.k4jugr1.mongodb.net/luxe-beauty?retryWrites=true&w=majority&appName=Cluster0
   ```

3. **Cloudinary** (Optional)
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## 🧪 Testing Checklist

### Before Going Live:

1. **Test Stripe Payments**
   - [ ] Add product to cart
   - [ ] Complete checkout with test card: `4242 4242 4242 4242`
   - [ ] Verify payment success page loads
   - [ ] Check Stripe Dashboard for payment record

2. **Test MongoDB Connection**
   - [ ] Visit `/api/test-db` - should return `{ success: true }`
   - [ ] Make a test purchase
   - [ ] Check MongoDB Atlas - order should be saved
   - [ ] Make a test booking
   - [ ] Check MongoDB Atlas - booking should be saved

3. **Test Webhooks**
   - [ ] Make a test purchase
   - [ ] Check Stripe Dashboard → Webhooks → Recent events
   - [ ] Verify webhook delivered successfully
   - [ ] Check MongoDB - data should be saved

4. **Test Cart Functionality**
   - [ ] Add multiple products to cart
   - [ ] Update quantities
   - [ ] Remove items
   - [ ] Checkout with cart

## 🔒 Security Checklist

- [x] Stripe secret keys not exposed in client-side code
- [x] MongoDB connection string uses environment variables
- [x] Webhook signature verification implemented
- [ ] All environment variables added to Vercel (not just local)
- [ ] MongoDB network access configured (allow 0.0.0.0/0 for Vercel)

## 📝 Next Steps

1. **Fix MongoDB Password**
   - Replace `<db_password>` in `.env.local`
   - Add to Vercel with real password
   - Test connection

2. **Deploy to Vercel**
   - Push code to GitHub
   - Vercel will auto-deploy
   - Add all environment variables in Vercel dashboard
   - Redeploy if needed

3. **Test Everything**
   - Run through testing checklist above
   - Verify payments work
   - Verify data saves to MongoDB
   - Verify webhooks work

4. **Go Live!**
   - Switch Stripe to live mode (if not already)
   - Test with real payment (small amount)
   - Monitor Stripe Dashboard and MongoDB

## 🆘 Troubleshooting

### If payments fail:
- Check Stripe Dashboard → Logs
- Verify `STRIPE_SECRET_KEY` is correct (starts with `sk_live_`)
- Check browser console for errors

### If MongoDB fails:
- Verify password is correct (no `<db_password>` placeholder)
- Check MongoDB Atlas → Network Access (allow 0.0.0.0/0)
- Test connection: `/api/test-db`

### If webhooks fail:
- Check Stripe Dashboard → Webhooks → Recent events
- Verify `STRIPE_WEBHOOK_SECRET` is correct (starts with `whsec_`)
- Verify webhook URL is correct in Stripe Dashboard

## ✅ Ready to Deploy?

Once you've:
1. ✅ Fixed MongoDB password
2. ✅ Added all environment variables to Vercel
3. ✅ Tested locally

You're ready to deploy! 🚀
