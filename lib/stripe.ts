import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
