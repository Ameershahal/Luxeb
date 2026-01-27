# Klarna Payment Method Setup Guide

## Overview
Klarna has been integrated as a payment method alongside Card and Clearpay payments in your Stripe checkout. Customers can now choose to pay with Klarna (buy now, pay later), Clearpay, or traditional card payments.

## What Was Changed

### Code Updates
- **`app/api/create-checkout-session/route.ts`**: Updated to include `'klarna'` in the `payment_method_types` array
- Klarna locale is automatically determined by Stripe based on customer location (no manual configuration needed)
- Shipping address collection is enabled for products (required by Klarna for physical goods)
- Shipping address collection is NOT required for bookings or courses (services)

## Enabling Klarna in Stripe Dashboard

### Step 1: Enable Klarna in Stripe Dashboard

**Method A: Via Payment Configurations (New Interface)**

1. **Log in to Stripe Dashboard**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Select your account

2. **Navigate to Payment Methods**
   - Go to **Payments** → **Payment methods** (top navigation)
   - You should see your "Default" payment configuration

3. **Edit Payment Configuration**
   - Click on the **"Default"** configuration row
   - This will open the configuration details

4. **Enable Klarna**
   - In the payment methods section, find **Klarna**
   - Toggle it to **Enabled**
   - Click **Save** or **Update**

**Method B: Via Settings (Traditional)**

1. **Log in to Stripe Dashboard**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Select your account

2. **Navigate to Payment Methods**
   - Go to **Settings** → **Payment methods** (left sidebar)
   - Or visit: [https://dashboard.stripe.com/settings/payment_methods](https://dashboard.stripe.com/settings/payment_methods)

3. **Enable Klarna**
   - Find **Klarna** in the list of payment methods
   - Toggle it to **Enabled**
   - Click **Save changes**

### Step 2: Configure Klarna Settings (Optional)

1. **Set Up Klarna Countries**
   - In the Payment methods settings, click on **Klarna** to expand options
   - Configure which countries Klarna should be available in
   - For UK-based business, ensure **United Kingdom** is enabled

2. **Review Klarna Requirements**
   - Klarna requires certain information from customers:
     - Full name
     - Email address
     - Phone number
     - Shipping address (for physical products)
   - These are automatically collected by Stripe Checkout

### Step 3: Test Klarna Payments

#### Test Mode
1. Use Stripe test mode to test Klarna
2. Go to [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
3. Create a test checkout session
4. Use Klarna test credentials:
   - **Email**: Use any test email
   - **Phone**: Use a valid format (e.g., +44 20 7946 0958)
   - **Date of Birth**: Use a date that makes the person 18+ years old

#### Test Klarna Payment Methods
- **Pay in 4**: Split payment into 4 interest-free installments
- **Pay in 30 days**: Pay within 30 days
- **Financing**: Longer-term financing options (if available)

## How It Works

### For Customers

1. **Product Purchase Flow**:
   - Customer adds products to cart
   - Clicks "Proceed to Checkout"
   - On Stripe Checkout page, sees **Card**, **Klarna**, and **Clearpay** options
   - If selecting Klarna:
     - Enters shipping address (required for products)
     - Chooses Klarna payment option
     - Completes Klarna authorization
     - Order is processed

2. **Course Enrollment Flow**:
   - Customer clicks "Enroll Now" on a course
   - On Stripe Checkout page, sees both payment options
   - If selecting Klarna:
     - No shipping address required (service)
     - Completes Klarna authorization
     - Enrollment is confirmed

3. **Booking Flow**:
   - Customer completes booking form
   - On Stripe Checkout page, sees both payment options
   - If selecting Klarna:
     - No shipping address required (service)
     - Completes Klarna authorization
     - Booking is confirmed

### For You (Merchant)

- **Payment Processing**: Klarna payments are processed through Stripe, just like card payments
- **Webhooks**: Klarna payment events trigger the same webhook (`checkout.session.completed`)
- **MongoDB**: Orders/bookings/enrollments are saved to MongoDB regardless of payment method
- **Fees**: Stripe charges standard processing fees for Klarna transactions

## Supported Countries

Klarna is available in the following countries (configured in checkout):
- **United Kingdom** (GB) - Primary market
- **United States** (US)
- **Canada** (CA)
- **Australia** (AU)
- **Germany** (DE)
- **Austria** (AT)
- **Netherlands** (NL)
- **Belgium** (BE)
- **Denmark** (DK)
- **Finland** (FI)
- **Norway** (NO)
- **Sweden** (SE)
- **Spain** (ES)
- **Italy** (IT)
- **France** (FR)
- **Poland** (PL)
- **Czech Republic** (CZ)
- **Ireland** (IE)

## Important Notes

### Shipping Address
- **Required for**: Product purchases (physical goods need shipping)
- **Not required for**: Bookings and courses (services don't need shipping)
- This is automatically handled in the code

### Klarna Eligibility
- Klarna may not be available for all customers (based on credit checks)
- If a customer is not eligible, they can still use card payment
- Stripe automatically handles Klarna eligibility checks

### Refunds
- Refunds for Klarna payments are processed through Stripe Dashboard
- Go to: **Payments** → Select payment → **Refund**
- Klarna will handle refunding the customer according to their payment plan

## Troubleshooting

### Klarna Not Showing in Checkout

**Issue**: Klarna option doesn't appear on checkout page

**Solutions**:
1. Verify Klarna is enabled in Stripe Dashboard (Settings → Payment methods)
2. Check that your Stripe account is in a supported country/region
3. Ensure you're using the correct API version (already configured: `2024-12-18.acacia`)
4. Verify the checkout session is being created correctly (check server logs)

### Klarna Payment Fails

**Issue**: Customer cannot complete Klarna payment

**Solutions**:
1. Customer may not be eligible (credit check failed) - they should use card instead
2. Verify shipping address is provided for product purchases
3. Check Stripe Dashboard for error details
4. Ensure customer is in a supported country

### Testing Issues

**Issue**: Cannot test Klarna in test mode

**Solutions**:
1. Use Stripe test mode credentials
2. Ensure test mode is enabled in Stripe Dashboard
3. Use valid test customer information (email, phone, address)
4. Check Stripe test mode documentation for Klarna test cards

## Additional Resources

- [Stripe Klarna Documentation](https://stripe.com/docs/payments/klarna)
- [Klarna Payment Methods](https://stripe.com/docs/payments/klarna#payment-methods)
- [Stripe Test Mode](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## Next Steps

1. ✅ **Enable Klarna in Stripe Dashboard** (Settings → Payment methods)
2. ✅ **Test Klarna in test mode** before going live
3. ✅ **Monitor payments** in Stripe Dashboard
4. ✅ **Set up webhook endpoints** (already configured)
5. ✅ **Test end-to-end flow** with a test purchase

## Support

If you encounter any issues:
1. Check Stripe Dashboard for payment details and errors
2. Review server logs for API errors
3. Consult Stripe documentation
4. Contact Stripe support if needed

---

**Note**: Klarna availability and features may vary by country. Ensure your Stripe account is properly configured for your business location.
