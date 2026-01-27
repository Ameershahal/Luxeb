# How to Test Klarna Checkout Session

## Overview
This guide explains how to create and test a checkout session with Klarna payment method enabled.

## Method 1: Test Through Your Website (Recommended)

### Step 1: Ensure Stripe Test Mode is Active

1. **Check Stripe Dashboard Mode**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Look at the top right corner
   - Toggle should show **"Test mode"** (not "Live mode")
   - If it shows "Live mode", click the toggle to switch to Test mode

### Step 2: Test Product Purchase Flow

1. **Go to Your Website**
   - Visit: `http://localhost:3000` (local) or your test deployment URL
   - Navigate to **Shop** page

2. **Add Product to Cart**
   - Click on any product
   - Click **"Add to Cart"**
   - Verify cart count updates in navbar

3. **Go to Checkout**
   - Click shopping bag icon in navbar
   - Click **"Proceed to Checkout"**

4. **Verify Klarna Appears**
   - You should see Stripe Checkout page
   - Look for payment method options:
     - ✅ **Card** (should be visible)
     - ✅ **Klarna** (should be visible if enabled)
   - If Klarna doesn't appear, see Troubleshooting below

5. **Test Klarna Payment**
   - Select **Klarna** as payment method
   - Fill in required information:
     - Email address
     - Phone number
     - Shipping address (for products)
   - Complete Klarna authorization
   - You'll be redirected to success page

### Step 3: Test Course Enrollment Flow

1. **Go to Courses Section**
   - Navigate to homepage
   - Scroll to **"Professional Courses"** section
   - Or go to `/courses` page

2. **Click "Enroll Now"**
   - Click **"Enroll Now"** on any course
   - This will create a checkout session

3. **Verify Klarna Appears**
   - Stripe Checkout should show both Card and Klarna
   - Note: Shipping address may NOT be required (services)

4. **Test Klarna Payment**
   - Select Klarna
   - Complete payment flow

### Step 4: Test Booking Flow

1. **Go to Booking Page**
   - Navigate to `/booking` page
   - Complete booking wizard:
     - Select service
     - Select stylist
     - Choose date & time
     - Enter client details

2. **Complete Payment**
   - Click **"Confirm & Pay"**
   - Stripe Checkout will open
   - Verify Klarna appears
   - Test Klarna payment

## Method 2: Test Using Stripe Dashboard

### Step 1: Create Test Checkout Session

1. **Go to Stripe Dashboard**
   - Visit: [https://dashboard.stripe.com/test/payment_links](https://dashboard.stripe.com/test/payment_links)
   - Or: **Payments** → **Payment Links** → **Create payment link**

2. **Create Payment Link**
   - Click **"+ Create payment link"**
   - Fill in:
     - **Product name**: "Test Product"
     - **Price**: £50.00
     - **Currency**: GBP
   - Under **Payment methods**, ensure:
     - ✅ **Card** is enabled
     - ✅ **Klarna** is enabled
   - Click **"Create payment link"**

3. **Test the Link**
   - Copy the payment link
   - Open in incognito/private browser window
   - Complete checkout with Klarna

### Step 2: Use Stripe CLI (Advanced)

If you have Stripe CLI installed:

```bash
# Install Stripe CLI (if not installed)
# Visit: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Create test checkout session
stripe checkout sessions create \
  --payment-method-types card klarna \
  --mode payment \
  --success-url "http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}" \
  --cancel-url "http://localhost:3000/payment/cancel" \
  --line-items '[{"price_data":{"currency":"gbp","product_data":{"name":"Test Product"},"unit_amount":5000},"quantity":1}]'
```

## Method 3: Test via API Directly

### Using Browser Console

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Run this code**:

```javascript
fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: [
      {
        name: 'Test Product',
        description: 'Testing Klarna integration',
        price: 50,
        quantity: 1,
        image: '/placeholder.svg'
      }
    ],
    type: 'product',
    metadata: {
      type: 'test',
      testMode: 'true'
    }
  })
})
.then(response => response.json())
.then(data => {
  if (data.url) {
    window.location.href = data.url
  } else {
    console.error('Error:', data)
  }
})
.catch(error => console.error('Error:', error))
```

4. **This will redirect you to Stripe Checkout**
5. **Verify Klarna appears as payment option**

## What to Look For

### ✅ Success Indicators

- **Klarna appears** in payment method options
- **Card also appears** (both should be visible)
- **Shipping address field** appears for products
- **No shipping address** for bookings/courses
- **Checkout completes** successfully
- **Webhook receives** `checkout.session.completed` event
- **MongoDB saves** order/booking/enrollment

### ❌ Common Issues

1. **Klarna Not Showing**
   - Check if Klarna is enabled in Stripe Dashboard
   - Verify you're in Test mode
   - Check browser console for errors
   - Verify API route is working

2. **Shipping Address Required Error**
   - For products: This is normal and required
   - For bookings/courses: Should NOT require shipping
   - Check `app/api/create-checkout-session/route.ts` logic

3. **Payment Fails**
   - Check Stripe Dashboard → Payments for error details
   - Verify test credentials are correct
   - Check webhook logs

## Test Klarna Credentials

When testing Klarna in test mode, use:

- **Email**: Any valid email format (e.g., `test@example.com`)
- **Phone**: Valid format (e.g., `+44 20 7946 0958`)
- **Date of Birth**: Date that makes person 18+ years old
- **Address**: Any valid UK address format

## Verify in Stripe Dashboard

After completing a test payment:

1. **Go to Stripe Dashboard**
   - Visit: [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)

2. **Find Your Test Payment**
   - Look for the most recent payment
   - Click on it to view details

3. **Check Payment Method**
   - Should show **"Klarna"** as payment method
   - Should show payment status (succeeded/failed)

4. **Check Webhook Events**
   - Go to: **Developers** → **Webhooks**
   - Find `checkout.session.completed` event
   - Verify it was received

5. **Check MongoDB** (if connected)
   - Verify order/booking was saved
   - Check database for new entry

## Quick Test Checklist

- [ ] Stripe Dashboard is in **Test mode**
- [ ] Klarna is **enabled** in Payment methods
- [ ] Website loads without errors
- [ ] Can add product to cart
- [ ] Cart count updates correctly
- [ ] Checkout button works
- [ ] Stripe Checkout page loads
- [ ] **Klarna option appears** ✅
- [ ] Card option appears ✅
- [ ] Can select Klarna
- [ ] Can complete Klarna payment
- [ ] Redirects to success page
- [ ] Webhook receives event
- [ ] MongoDB saves data (if applicable)

## Troubleshooting

### Klarna Not Appearing

**Check:**
1. Klarna enabled in Stripe Dashboard?
2. In Test mode?
3. Browser console errors?
4. API route working? (check Network tab)

**Fix:**
- Enable Klarna in Stripe Dashboard
- Switch to Test mode
- Check server logs
- Verify `payment_method_types: ['card', 'klarna']` in code

### Payment Fails

**Check:**
1. Stripe Dashboard → Payments → Error details
2. Webhook logs
3. Browser console errors

**Fix:**
- Use valid test credentials
- Check Stripe account status
- Verify webhook endpoint is accessible

## Next Steps After Testing

1. ✅ **Test in Test Mode** (complete this first)
2. ✅ **Verify all flows work** (products, courses, bookings)
3. ✅ **Switch to Live Mode** (when ready)
4. ✅ **Enable Klarna in Live Mode**
5. ✅ **Test with small real payment**
6. ✅ **Monitor production payments**

---

**Note**: Always test thoroughly in Test mode before going live. Test mode uses fake cards and doesn't charge real money.
