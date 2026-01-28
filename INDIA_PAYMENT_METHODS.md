# Payment Methods for India - Important Information

## Why You Can't See Klarna and Clearpay

**Klarna and Clearpay are NOT available in India.** These payment methods are region-restricted and only available in:

- **United Kingdom** (GB)
- **United States** (US)
- **Canada** (CA)
- **Australia** (AU)
- **New Zealand** (NZ)
- **European Union** (various countries)

## Your Business Location

Your business is **UK-based** (Stockport, Greater Manchester), so you should:

1. **Ensure your Stripe account is registered in the UK**
2. **Set your Stripe account region to United Kingdom**
3. **Then Klarna and Clearpay will be available**

## How to Check/Change Your Stripe Account Region

### Check Current Region

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click on your account name (top right)
3. Go to **Settings** → **Account**
4. Check **"Country"** - it should show **"United Kingdom"**

### If Your Account is Set to India

**Option 1: Create a UK Stripe Account (Recommended)**

1. **Create a new Stripe account** with UK as the country
2. Use your UK business address: `142C Shaw Heath, Stockport, Greater Manchester, SK2 6QS`
3. Complete UK business verification
4. Transfer your API keys to the new account

**Option 2: Contact Stripe Support**

- If you need to change your account region, contact Stripe support
- They can help migrate your account or set up a UK account

## Payment Methods Available in India (If You Serve Indian Customers)

If you want to accept payments from Indian customers, Stripe supports:

### Available in India:
- ✅ **Card** (Visa, Mastercard, RuPay, etc.)
- ✅ **UPI** (Unified Payments Interface) - Very popular in India
- ✅ **Netbanking** (Bank transfers)
- ✅ **Wallets** (Paytm, etc.)

### NOT Available in India:
- ❌ **Klarna**
- ❌ **Clearpay/Afterpay**

## Solution for Your UK Business

Since your business is **UK-based**, you should:

1. **Use a UK Stripe account** (not Indian)
2. **Enable Card, Klarna, and Clearpay** in Stripe Dashboard
3. **These will work for UK customers**

## If You Want to Serve Both UK and Indian Customers

You have two options:

### Option 1: Use Payment Configuration (Recommended)

1. Create **two payment configurations** in Stripe Dashboard:
   - **UK Configuration**: Card, Klarna, Clearpay
   - **India Configuration**: Card, UPI, Netbanking

2. Detect customer location and use appropriate configuration

3. Update code to use configuration based on customer country

### Option 2: Use Card Only (Simplest)

- Just use **Card** payments
- Works in both UK and India
- No region restrictions

## Current Code Behavior

The current code includes:
- `payment_method_types: ['card', 'klarna', 'afterpay_clearpay']`

**This will work if:**
- Your Stripe account is in UK/US/CA/AU/EU
- You're serving customers in those regions

**This won't work if:**
- Your Stripe account is in India
- You're trying to use Klarna/Clearpay from India

## Quick Fix: Use Card Only (Temporary)

If you need to test immediately, you can temporarily use only Card:

```typescript
payment_method_types: ['card']
// Or with Clearpay: ['card', 'klarna', 'afterpay_clearpay']
```

Then enable Klarna/Clearpay once your Stripe account is set to UK.

## Next Steps

1. ✅ **Check your Stripe account country** (Settings → Account)
2. ✅ **If it's India, create/switch to UK account**
3. ✅ **Enable payment methods in Stripe Dashboard**
4. ✅ **Test checkout with UK account**

## Contact Stripe Support

If you need help:
- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- Explain you have a UK business but account might be set to India
- They can help you set up correctly

---

**Important**: Your business address is in the UK, so your Stripe account should also be UK-based to access Klarna and Clearpay.
