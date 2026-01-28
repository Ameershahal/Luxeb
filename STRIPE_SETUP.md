# Stripe Payment Integration Setup Guide

## Overview
Stripe has been integrated into the Luxe Beauty & Training website for processing payments for:
- **Bookings**: Service appointments with upfront payment
- **Products**: Direct product purchases from the shop

## Environment Variables

Add these environment variables to your `.env.local` file (for local development) and Vercel dashboard (for production):

```env
# Stripe Secret Key (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Stripe Webhook Secret (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Your site URL (for redirects)
NEXT_PUBLIC_SITE_URL=https://luxebeautyandtrainingacademy.com
```

## Getting Your Stripe Keys

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete the account setup

### 2. Get Your API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_` for test mode, `sk_live_` for production)
4. Add it to `STRIPE_SECRET_KEY` in your environment variables

### 3. Set Up Webhooks (Required for Production)

Webhooks allow Stripe to notify your application when payments are completed.

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Set the endpoint URL to:
   ```
   https://luxebeautyandtrainingacademy.com/api/webhooks/stripe
   ```
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to `STRIPE_WEBHOOK_SECRET` in your environment variables

### 4. Test Mode vs Live Mode

- **Test Mode**: Use test keys (`sk_test_...`) for development
- **Live Mode**: Use live keys (`sk_live_...`) for production

**Important**: Never commit your secret keys to git. Always use environment variables.

## How It Works

### Booking Flow
1. Customer completes booking form
2. Clicks "Pay & Confirm Booking"
3. Redirected to Stripe Checkout
4. Completes payment
5. Redirected to success page (`/payment/success`)
6. Webhook processes the payment and saves booking

### Product Purchase Flow
1. Customer views product
2. Clicks "Buy Now"
3. Redirected to Stripe Checkout
4. Completes payment
5. Redirected to success page
6. Webhook processes the payment and updates inventory

## API Routes

### `/api/create-checkout-session`
Creates a Stripe Checkout session and returns the checkout URL.

**Request Body:**
```json
{
  "items": [
    {
      "name": "Service Name",
      "description": "Service description",
      "price": 100,
      "quantity": 1,
      "image": "https://..."
    }
  ],
  "type": "booking" | "product",
  "metadata": {
    "type": "booking",
    "serviceId": "...",
    // ... other metadata
  }
}
```

### `/api/webhooks/stripe`
Handles Stripe webhook events (payment confirmations, failures, etc.)

## Testing

### Test Cards (Test Mode Only)
Use these test card numbers in Stripe Checkout:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any postal code.

### Testing Webhooks Locally
For local development, use Stripe CLI:

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe` (Mac) or download from [Stripe Docs](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the webhook secret and add it to `.env.local`

## Currency

The integration uses **GBP (British Pounds)** as the default currency. Prices are displayed as `£` and converted to pence (smallest currency unit) for Stripe.

## Security Notes

1. **Never expose secret keys** in client-side code
2. **Always verify webhook signatures** (already implemented)
3. **Use HTTPS** in production
4. **Store sensitive data** in environment variables
5. **Validate payment amounts** server-side before processing

## Troubleshooting

### Payment Not Processing
- Check Stripe Dashboard → **Payments** for error details
- Verify environment variables are set correctly
- Check browser console for errors

### Webhook Not Working
- Verify webhook endpoint URL is correct
- Check webhook secret matches
- View webhook logs in Stripe Dashboard
- Ensure endpoint is accessible (not blocked by firewall)

### Currency Issues
- Ensure prices are in GBP (British Pounds)
- Check `formatAmountForStripe` function converts correctly (multiplies by 100)

## Next Steps

1. Set up your Stripe account
2. Add environment variables to Vercel
3. Configure webhook endpoint
4. Test with test cards
5. Switch to live mode when ready

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
