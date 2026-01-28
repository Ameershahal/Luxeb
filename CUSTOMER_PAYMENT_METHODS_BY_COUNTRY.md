# Payment Methods Available to Customers by Country

## Overview
This guide explains which payment methods your customers can use based on their location.

## Payment Methods by Customer Location

### ✅ Available in UK, US, Canada, Australia, EU
- **Card** (Visa, Mastercard, Amex, etc.)
- **Klarna** (Buy now, pay later)
- **Clearpay/Afterpay** (Buy now, pay later)

### ✅ Available in India
- **Card** (Visa, Mastercard, RuPay, etc.)
- **UPI** (Unified Payments Interface) - if you enable it
- **Netbanking** - if you enable it
- **Wallets** (Paytm, etc.) - if you enable it

### ❌ NOT Available in India
- **Klarna** - Not available in India
- **Clearpay/Afterpay** - Not available in India

## How Stripe Handles This

Stripe automatically:
1. **Detects customer location** (based on IP address or shipping address)
2. **Shows only available payment methods** for that location
3. **Hides unavailable methods** (like Klarna/Clearpay for Indian customers)

## What Indian Customers Will See

### If Your Stripe Account is UK-Based:
- ✅ **Card** - Will be available
- ❌ **Klarna** - Will NOT appear (not available in India)
- ❌ **Clearpay** - Will NOT appear (not available in India)

### If Your Stripe Account is India-Based:
- ✅ **Card** - Will be available
- ✅ **UPI** - Will be available (if enabled)
- ✅ **Netbanking** - Will be available (if enabled)
- ❌ **Klarna** - Will NOT appear (not available in India)
- ❌ **Clearpay** - Will NOT appear (not available in India)

## Current Code Behavior

Your current code includes:
```typescript
payment_method_types: ['card', 'klarna', 'afterpay_clearpay']
```

**What happens:**
- **UK customers**: See Card, Klarna, Clearpay ✅
- **Indian customers**: See only Card ✅ (Klarna/Clearpay automatically hidden by Stripe)
- **US customers**: See Card, Klarna, Clearpay ✅

**Stripe automatically filters** payment methods based on customer location, so Indian customers won't see Klarna/Clearpay even if they're in the code.

## If You Want to Serve Indian Customers Better

### Option 1: Add Indian Payment Methods (Requires Indian Stripe Account)

If you want to offer UPI, Netbanking, etc. to Indian customers:

1. **Create an Indian Stripe account** (or use existing one)
2. **Enable Indian payment methods**:
   - UPI
   - Netbanking
   - Wallets
3. **Detect customer location** and use appropriate account/config

### Option 2: Use Card Only (Simplest)

- **Card payments work everywhere** (UK, India, worldwide)
- No region restrictions
- Simple setup
- Indian customers can use international cards

### Option 3: Region-Based Payment Configuration

Create different payment configurations:
- **UK Configuration**: Card, Klarna, Clearpay
- **India Configuration**: Card, UPI, Netbanking

Then detect customer location and use the appropriate configuration.

## Current Setup Summary

**Your Current Code:**
- Includes: `['card', 'klarna', 'afterpay_clearpay']`
- **UK customers**: See all three ✅
- **Indian customers**: See only Card ✅ (Klarna/Clearpay hidden automatically)
- **Other countries**: See available methods based on their location

**This is actually fine!** Stripe handles the filtering automatically. Indian customers will see Card, and UK customers will see all three options.

## Testing from India

If you're testing from India:

1. **You'll see**: Only Card payment method
2. **You won't see**: Klarna or Clearpay (because you're in India)
3. **This is correct behavior** - Stripe is filtering based on your location

To test Klarna/Clearpay:
- Use a VPN to UK/US
- Or test with a UK customer
- Or use Stripe test mode with UK test credentials

## FAQ

### Q: Can Indian customers use Klarna/Clearpay?
**A:** No, these payment methods are not available in India. Indian customers can only use Card (or UPI/Netbanking if you enable them).

### Q: Will Indian customers see Klarna/Clearpay options?
**A:** No, Stripe automatically hides unavailable payment methods based on customer location.

### Q: Do I need to change my code for Indian customers?
**A:** No, your current code is fine. Stripe automatically shows only available payment methods to each customer based on their location.

### Q: Can I add UPI for Indian customers?
**A:** Yes, but you'll need an Indian Stripe account and enable UPI in payment methods. Then update code to include `'upi'` in payment_method_types.

## Recommendation

**For your current setup:**
- ✅ Keep your code as-is: `['card', 'klarna', 'afterpay_clearpay']`
- ✅ UK customers will see all three
- ✅ Indian customers will see only Card (automatically filtered)
- ✅ This works perfectly - no changes needed!

**If you want to add Indian payment methods:**
- Create/use Indian Stripe account
- Enable UPI, Netbanking
- Update code to detect location and use appropriate methods

---

**Bottom Line**: Your current code is fine. Stripe automatically shows only available payment methods to each customer based on their location. Indian customers will see Card, UK customers will see Card + Klarna + Clearpay.
