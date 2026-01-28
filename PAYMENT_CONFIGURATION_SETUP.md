# Payment Method Configuration Setup Guide

## Overview
This guide explains how to use Stripe Payment Method Configurations to manage your payment methods (Card, Klarna, Clearpay) through the Stripe Dashboard instead of hardcoding them in your code.

## Two Approaches

### Approach 1: Direct Payment Methods (Current - Recommended for Simple Setup)
- Payment methods are specified directly in code: `payment_method_types: ['card', 'klarna', 'clearpay']`
- Simple and straightforward
- Easy to understand and maintain
- **No configuration needed** - just enable payment methods in Stripe Dashboard

### Approach 2: Payment Method Configuration (Advanced)
- Payment methods are managed via Stripe Dashboard configurations
- More flexible for complex setups
- Better for managing multiple configurations
- Requires creating a configuration and using its ID

## When to Use Payment Method Configuration

Use a payment configuration if you:
- Need different payment methods for different checkout flows
- Want to manage payment methods entirely through Stripe Dashboard
- Have multiple Stripe accounts or connected accounts
- Need to change payment methods without code deployments

**For most use cases, Approach 1 (direct payment methods) is sufficient.**

## Setting Up Payment Method Configuration (Optional)

### Step 1: Create Payment Configuration in Stripe Dashboard

1. **Go to Stripe Dashboard**
   - Visit: [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Navigate to **Payments** → **Payment methods**

2. **Create New Configuration**
   - Click **"+ Create"** button
   - Select **"New configuration"**
   - Name your configuration (e.g., "Luxe Beauty Payment Methods")

3. **Enable Payment Methods**
   - In the next step, enable the payment methods you want:
     - ✅ **Card**
     - ✅ **Klarna**
     - ✅ **Clearpay** (or Afterpay)
   - Configure any additional settings
   - Click **"Create configuration"**

4. **Copy Configuration ID**
   - After creating, you'll see a Configuration ID (starts with `pmc_`)
   - Example: `pmc_1SQsXD8fxwznxhZ730CEzG3C`
   - **Copy this ID** - you'll need it for your code

### Step 2: Add Configuration ID to Environment Variables

1. **Add to `.env.local`** (for local development):
   ```env
   STRIPE_PAYMENT_METHOD_CONFIGURATION_ID=pmc_your_configuration_id_here
   ```

2. **Add to Vercel** (for production):
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `STRIPE_PAYMENT_METHOD_CONFIGURATION_ID` = `pmc_your_configuration_id_here`
   - Select **Production**, **Preview**, and **Development** environments
   - Click **Save**

### Step 3: Update Code (Already Done)

The code has been updated to automatically use the configuration ID if it's set in environment variables. If you set `STRIPE_PAYMENT_METHOD_CONFIGURATION_ID`, it will use that configuration instead of the hardcoded payment methods.

## How It Works

### Without Configuration ID (Current Setup)
```typescript
payment_method_types: ['card', 'klarna', 'clearpay']
```
- Payment methods are specified directly in code
- You enable them in Stripe Dashboard → Settings → Payment methods

### With Configuration ID
```typescript
payment_method_configuration: process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID
```
- Payment methods are determined by the configuration
- You manage them entirely in Stripe Dashboard → Payment configurations
- Can change payment methods without code changes

## Current Code Implementation

The code supports both approaches:

```typescript
const sessionConfig: any = {
  payment_method_types: ['card', 'klarna', 'clearpay'], // Used if no config ID
  // ... other settings
}

// If configuration ID is set, use it instead
if (process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID) {
  sessionConfig.payment_method_configuration = process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID
  // Optionally remove payment_method_types when using configuration
}
```

## Recommendation

**For your current setup, you don't need a payment configuration.**

Simply:
1. ✅ Enable Card, Klarna, and Clearpay in **Stripe Dashboard → Settings → Payment methods**
2. ✅ The code already specifies the payment methods
3. ✅ Everything will work automatically

**Only create a payment configuration if:**
- You need different payment methods for different scenarios
- You want to manage everything through the dashboard
- You have specific requirements that need configurations

## Testing

### Test Without Configuration
1. Ensure payment methods are enabled in Stripe Dashboard
2. Create a checkout session
3. Verify all three payment methods appear

### Test With Configuration
1. Create a payment configuration in Stripe Dashboard
2. Add the configuration ID to environment variables
3. Restart your development server
4. Create a checkout session
5. Verify payment methods from the configuration appear

## Troubleshooting

### Payment Methods Not Appearing

**If using direct payment methods:**
- Check that Card, Klarna, and Clearpay are enabled in Stripe Dashboard
- Verify you're in the correct mode (Test/Live)
- Check server logs for errors

**If using payment configuration:**
- Verify configuration ID is correct in environment variables
- Check that payment methods are enabled in the configuration
- Ensure configuration is active/enabled
- Restart server after adding environment variable

### Configuration ID Not Working

- Verify the ID starts with `pmc_`
- Check that the configuration exists in Stripe Dashboard
- Ensure environment variable is set correctly
- Restart server after adding environment variable

## Next Steps

1. **If you want to use configurations:**
   - Create configuration in Stripe Dashboard
   - Copy configuration ID
   - Add to environment variables
   - Restart server

2. **If you want to keep it simple (recommended):**
   - Just enable payment methods in Stripe Dashboard
   - No configuration needed
   - Everything works as-is

---

**Note**: The current code works perfectly without a payment configuration. Only set one up if you have specific requirements that need it.
