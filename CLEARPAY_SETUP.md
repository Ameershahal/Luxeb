# Clearpay Payment Method Setup Guide

## Overview
Clearpay has been integrated as a payment method alongside Card and Klarna payments in your Stripe checkout. Customers can now choose to pay with Clearpay (buy now, pay later), Klarna, or traditional card payments.

## What Was Changed

### Code Updates
- **`app/api/create-checkout-session/route.ts`**: Updated to include `'afterpay_clearpay'` in the `payment_method_types` array (Stripe uses `afterpay_clearpay` as the payment method type name)
- Clearpay locale is automatically determined by Stripe based on customer location (no manual configuration needed)
- Shipping address collection is enabled for products (required by Clearpay for physical goods)
- Shipping address collection is NOT required for bookings or courses (services)

## About Clearpay

Clearpay (known as Afterpay in some regions) is a "buy now, pay later" payment service that allows customers to:
- **Split payments** into 4 interest-free installments
- **Pay every 2 weeks**
- **No interest** if payments are made on time
- **Instant approval** for eligible customers

## Enabling Clearpay in Stripe Dashboard

### Step 1: Enable Clearpay in Stripe Dashboard

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

4. **Enable Clearpay**
   - In the payment methods section, find **Clearpay** (or **Afterpay**)
   - Toggle it to **Enabled**
   - Click **Save** or **Update**

**Method B: Via Settings (Traditional)**

1. **Log in to Stripe Dashboard**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Select your account

2. **Navigate to Payment Methods**
   - Go to **Settings** → **Payment methods** (left sidebar)
   - Or visit: [https://dashboard.stripe.com/settings/payment_methods](https://dashboard.stripe.com/settings/payment_methods)

3. **Enable Clearpay**
   - Find **Clearpay** (or **Afterpay**) in the list of payment methods
   - Toggle it to **Enabled**
   - Click **Save changes**

### Step 2: Configure Clearpay Settings (Optional)

1. **Set Up Clearpay Countries**
   - In the Payment methods settings, click on **Clearpay** to expand options
   - Configure which countries Clearpay should be available in
   - For UK-based business, ensure **United Kingdom** is enabled

2. **Review Clearpay Requirements**
   - Clearpay requires certain information from customers:
     - Full name
     - Email address
     - Phone number
     - Date of birth
     - Shipping address (for physical products)
   - These are automatically collected by Stripe Checkout

## Supported Countries

Clearpay is available in the following countries:
- **United Kingdom** (GB) - Primary market (Clearpay)
- **United States** (US) - Afterpay
- **Canada** (CA) - Afterpay
- **Australia** (AU) - Afterpay
- **New Zealand** (NZ) - Afterpay
- **France** (FR) - Clearpay
- **Spain** (ES) - Clearpay
- **Italy** (IT) - Clearpay

## How It Works

### For Customers

1. **Product Purchase Flow**:
   - Customer adds products to cart
   - Clicks "Proceed to Checkout"
   - On Stripe Checkout page, sees **Card**, **Klarna**, and **Clearpay** options
   - If selecting Clearpay:
     - Enters shipping address (required for products)
     - Enters date of birth (required for Clearpay)
     - Completes Clearpay authorization
     - Order is processed
     - Pays in 4 installments over 6 weeks

2. **Course Enrollment Flow**:
   - Customer clicks "Enroll Now" on a course
   - On Stripe Checkout page, sees all payment options
   - If selecting Clearpay:
     - No shipping address required (service)
     - Completes Clearpay authorization
     - Enrollment is confirmed

3. **Booking Flow**:
   - Customer completes booking form
   - On Stripe Checkout page, sees all payment options
   - If selecting Clearpay:
     - No shipping address required (service)
     - Completes Clearpay authorization
     - Booking is confirmed

### For You (Merchant)

- **Payment Processing**: Clearpay payments are processed through Stripe, just like card payments
- **Webhooks**: Clearpay payment events trigger the same webhook (`checkout.session.completed`)
- **MongoDB**: Orders/bookings/enrollments are saved to MongoDB regardless of payment method
- **Fees**: Stripe charges standard processing fees for Clearpay transactions
- **Payment Schedule**: Clearpay handles the installment payments directly with customers

## Important Notes

### Shipping Address
- **Required for**: Product purchases (physical goods need shipping)
- **Not required for**: Bookings and courses (services don't need shipping)
- This is automatically handled in the code

### Clearpay Eligibility
- Clearpay may not be available for all customers (based on credit checks)
- Minimum order value: Usually £1-£800 (varies by region)
- Maximum order value: Usually £800-£1,000 (varies by region)
- If a customer is not eligible, they can still use card or Klarna payment
- Stripe automatically handles Clearpay eligibility checks

### Payment Schedule
- **4 installments**: Split into 4 equal payments
- **Every 2 weeks**: Payments are due every 2 weeks
- **6 weeks total**: Complete payment over 6 weeks
- **No interest**: If payments are made on time

### Refunds
- Refunds for Clearpay payments are processed through Stripe Dashboard
- Go to: **Payments** → Select payment → **Refund**
- Clearpay will handle refunding the customer according to their payment plan

## Testing Clearpay

### Test Mode

1. **Use Stripe test mode** to test Clearpay
2. **Go to**: [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
3. **Create a test checkout session**
4. **Use Clearpay test credentials**:
   - **Email**: Use any test email
   - **Phone**: Use a valid format (e.g., +44 20 7946 0958)
   - **Date of Birth**: Use a date that makes the person 18+ years old
   - **Address**: Any valid UK address format

### Test Payment Flow

1. Add product to cart
2. Go to checkout
3. Select **Clearpay** as payment method
4. Complete authorization
5. Verify payment appears in Stripe Dashboard

## Troubleshooting

### Clearpay Not Showing in Checkout

**Issue**: Clearpay option doesn't appear on checkout page

**Solutions**:
1. Verify Clearpay is enabled in Stripe Dashboard (Settings → Payment methods)
2. Check that your Stripe account is in a supported country/region
3. Ensure you're using the correct API version (already configured: `2024-12-18.acacia`)
4. Verify the checkout session is being created correctly (check server logs)
5. Check if order amount is within Clearpay limits (£1-£800 typically)

### Clearpay Payment Fails

**Issue**: Customer cannot complete Clearpay payment

**Solutions**:
1. Customer may not be eligible (credit check failed) - they should use card or Klarna instead
2. Verify shipping address is provided for product purchases
3. Check Stripe Dashboard for error details
4. Ensure customer is in a supported country
5. Verify order amount is within Clearpay limits

### Testing Issues

**Issue**: Cannot test Clearpay in test mode

**Solutions**:
1. Use Stripe test mode credentials
2. Ensure test mode is enabled in Stripe Dashboard
3. Use valid test customer information (email, phone, address, date of birth)
4. Check Stripe test mode documentation for Clearpay test scenarios

## Payment Methods Comparison

| Feature | Card | Klarna | Clearpay |
|---------|------|--------|----------|
| **Payment Type** | Immediate | Buy now, pay later | Buy now, pay later |
| **Installments** | No | Yes (4 or 30 days) | Yes (4 installments) |
| **Payment Schedule** | Full payment | Flexible | Every 2 weeks |
| **Interest** | N/A | None (if on time) | None (if on time) |
| **Approval** | Instant | Credit check | Credit check |
| **Shipping Required** | Products only | Products only | Products only |

## Additional Resources

- [Stripe Clearpay Documentation](https://docs.stripe.com/payments/afterpay-clearpay)
- [Clearpay Payment Methods](https://docs.stripe.com/payments/afterpay-clearpay/accept-a-payment)
- [Stripe Test Mode](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## Next Steps

1. ✅ **Enable Clearpay in Stripe Dashboard** (Settings → Payment methods)
2. ✅ **Test Clearpay in test mode** before going live
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

**Note**: Clearpay availability and features may vary by country. Ensure your Stripe account is properly configured for your business location. Clearpay is known as "Afterpay" in some regions (US, Canada, Australia, New Zealand).
