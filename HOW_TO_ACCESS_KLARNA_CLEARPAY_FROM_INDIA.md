# How to See Klarna and Clearpay from India

## The Problem

**Klarna and Clearpay are NOT available for Indian Stripe accounts.** They are region-restricted and only available for accounts in:
- United Kingdom (GB)
- United States (US)
- Canada (CA)
- Australia (AU)
- New Zealand (NZ)
- European Union countries

## The Solution

Since your business is **UK-based** (Stockport, Greater Manchester), you need to:

### Option 1: Create a UK Stripe Account (Recommended)

**Step 1: Create New Stripe Account**

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. **Important**: When asked for country, select **"United Kingdom"** (not India)
3. Use your UK business details:
   - **Business Name**: Luxe Beauty & Training
   - **Business Address**: 142C Shaw Heath, Stockport, Greater Manchester, SK2 6QS
   - **Phone**: +44 7450 239432
   - **Email**: info@luxebeautyandtrainingacademy.com
   - **Country**: United Kingdom

**Step 2: Complete UK Business Verification**

1. Provide UK business registration documents (if applicable)
2. Verify your UK business address
3. Complete identity verification
4. Add UK bank account details

**Step 3: Get Your UK API Keys**

1. Go to **Developers** → **API keys**
2. Copy your new **Secret Key** (starts with `sk_live_` or `sk_test_`)
3. Copy your **Publishable Key** (starts with `pk_live_` or `pk_test_`)

**Step 4: Update Environment Variables**

Update your `.env.local` and Vercel with the new UK account keys:

```env
STRIPE_SECRET_KEY=sk_live_REDACTED_uk_account_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Step 5: Enable Payment Methods**

1. In your UK Stripe Dashboard, go to **Settings** → **Payment methods**
2. Enable:
   - ✅ **Card**
   - ✅ **Klarna**
   - ✅ **Clearpay** (or Afterpay)
3. Click **Save changes**

**Step 6: Test**

1. Create a test checkout session
2. You should now see **Card**, **Klarna**, and **Clearpay** options!

---

### Option 2: Change Existing Account Region (If Possible)

**Note**: Stripe typically doesn't allow changing account country after creation. But you can try:

1. Contact Stripe Support: [https://support.stripe.com](https://support.stripe.com)
2. Explain:
   - Your business is UK-based
   - You need UK payment methods (Klarna, Clearpay)
   - Your current account is set to India
   - Request account migration or region change
3. They may help you:
   - Migrate to a UK account
   - Or set up a UK account linked to your business

---

### Option 3: Use VPN (Not Recommended - Temporary Testing Only)

**⚠️ Warning**: This is only for testing, not for production!

1. Use a VPN service to connect to UK
2. Access Stripe Dashboard while connected to UK
3. You might see UK payment methods
4. **But this won't work for actual payments** - your account is still Indian

**Don't use this for production** - you need a proper UK account.

---

## Why This Happens

Stripe shows payment methods based on:
1. **Your account's registered country** (primary factor)
2. **Your IP location** (secondary, for display)
3. **Customer's location** (for actual payment processing)

Since Klarna and Clearpay are not licensed/available in India, Indian Stripe accounts cannot offer them.

## Verification Checklist

After setting up UK account, verify:

- [ ] Stripe Dashboard shows "United Kingdom" as country
- [ ] Settings → Payment methods shows Klarna and Clearpay options
- [ ] You can enable Klarna and Clearpay
- [ ] Test checkout session shows all three payment methods
- [ ] API keys are from UK account (not Indian account)

## Important Notes

1. **You can have multiple Stripe accounts** - one for India, one for UK
2. **Use UK account for UK business** - this is the correct setup
3. **Keep Indian account** - if you also serve Indian customers, you can use it separately
4. **Update environment variables** - make sure production uses UK account keys

## Quick Setup Summary

```
1. Create UK Stripe account → Select "United Kingdom" as country
2. Use UK business address → 142C Shaw Heath, Stockport, SK2 6QS
3. Complete UK verification → Business documents, bank account
4. Get UK API keys → Update .env.local and Vercel
5. Enable payment methods → Card, Klarna, Clearpay
6. Test checkout → Should see all three options!
```

## Support

If you need help:
- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Stripe Sales**: [https://stripe.com/contact/sales](https://stripe.com/contact/sales)
- Explain: "I have a UK business but my Stripe account is in India. I need Klarna and Clearpay which require a UK account."

---

**Bottom Line**: You need a **UK Stripe account** (not Indian) to access Klarna and Clearpay. Since your business is UK-based, this is the correct setup anyway!
