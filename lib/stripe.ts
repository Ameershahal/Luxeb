import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Validate that it's a secret key, not a publishable key
const secretKey = process.env.STRIPE_SECRET_KEY
if (secretKey.startsWith('pk_')) {
  throw new Error('STRIPE_SECRET_KEY must be a secret key (starts with sk_), not a publishable key (pk_). Get your secret key from: https://dashboard.stripe.com/apikeys')
}

if (!secretKey.startsWith('sk_')) {
  throw new Error('Invalid STRIPE_SECRET_KEY format. Secret keys should start with sk_test_ or sk_live_')
}

export const stripe = new Stripe(secretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const formatAmountForStripe = (amount: number, currency: string = 'gbp'): number => {
  // Convert to smallest currency unit (pence for GBP, cents for USD)
  return Math.round(amount * 100)
}

export const formatAmountFromStripe = (amount: number, currency: string = 'gbp'): number => {
  // Convert from smallest currency unit
  return amount / 100
}
