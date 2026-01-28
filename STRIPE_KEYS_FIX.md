# Stripe Keys Configuration Fix

## Problem
You're getting this error:
```
This API call cannot be made with a publishable API key. Please use a secret API key.
```

## Solution

You have the **wrong type of key** in your `STRIPE_SECRET_KEY` environment variable.

### Current Issue
- ❌ `STRIPE_SECRET_KEY=pk_live_...` (This is a **publishable key**, not a secret key)
- ✅ Should be: `STRIPE_SECRET_KEY=sk_live_...` (This is a **secret key**)

## How to Fix

### Step 1: Get Your Correct Stripe Keys

1. **Go to Stripe Dashboard**: [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

2. **Find Your Secret Key**:
   - Look for the key that starts with `sk_live_` (for production) or `sk_test_` (for testing)
   - **DO NOT** use the key that starts with `pk_live_` or `pk_test_` (that's the publishable key)

3. **Get Your Webhook Secret**:
   - Go to: [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
   - Click on your webhook endpoint
   - Copy the "Signing secret" (starts with `whsec_`)

### Step 2: Update Your Environment Variables

**In `.env.local` (for local development):**
```env
STRIPE_SECRET_KEY=sk_live_REDACTED_ACTUAL_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE
```

**In Vercel (for production):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `STRIPE_SECRET_KEY` with your secret key (starts with `sk_live_`)
3. Update `STRIPE_WEBHOOK_SECRET` with your webhook secret (starts with `whsec_`)
4. Redeploy your project

## Key Types Explained

| Key Type | Starts With | Used For | Where to Find |
|----------|-------------|----------|---------------|
| **Secret Key** | `sk_live_` or `sk_test_` | Server-side API calls | [API Keys Page](https://dashboard.stripe.com/apikeys) |
| **Publishable Key** | `pk_live_` or `pk_test_` | Client-side (browser) | [API Keys Page](https://dashboard.stripe.com/apikeys) |
| **Webhook Secret** | `whsec_` | Webhook signature verification | [Webhooks Page](https://dashboard.stripe.com/webhooks) |

## Important Notes

1. **Never commit secret keys to git** - Always use environment variables
2. **Secret keys** (`sk_`) are for server-side use only
3. **Publishable keys** (`pk_`) are safe to use in client-side code
4. **Webhook secrets** (`whsec_`) are for verifying webhook signatures

## Testing

After updating your keys:
1. Restart your development server
2. Try adding a product to cart and checking out
3. The error should be resolved

## Still Having Issues?

- Verify your keys are correct in Stripe Dashboard
- Make sure you're using the right environment (test vs live)
- Check that environment variables are set correctly in Vercel
- Restart your server after changing environment variables
