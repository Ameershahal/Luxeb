import { NextRequest, NextResponse } from 'next/server'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { isTimeSlotBooked } from '@/lib/booking-availability'
import { toDateKeyFromLocal } from '@/lib/booking-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, type, metadata } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    if (type === 'booking' && metadata?.stylistId && metadata.stylistId !== 'any-available') {
      if (metadata.date && metadata.time) {
        const taken = await isTimeSlotBooked(
          metadata.stylistId,
          toDateKeyFromLocal(new Date(metadata.date)),
          metadata.time
        )
        if (taken) {
          return NextResponse.json(
            { error: 'This time slot is no longer available. Please choose another time.' },
            { status: 409 }
          )
        }
      }
    }

    // Helper function to convert relative URLs to absolute URLs
    const getAbsoluteImageUrl = (imagePath: string | undefined): string | undefined => {
      if (!imagePath) return undefined
      
      // If it's already an absolute URL (starts with http:// or https://), return as is
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
      }
      
      // If it's a relative path, convert to absolute URL
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      // Remove leading slash if present and add base URL
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
      return `${baseUrl}/${cleanPath}`
    }

    // Build line items for Stripe
    const lineItems = items.map((item: any) => {
      const imageUrl = getAbsoluteImageUrl(item.image)
      const description = item.description?.trim() || item.name || 'Booking service'

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            description,
            // Only include images array if we have a valid URL
            ...(imageUrl ? { images: [imageUrl] } : {}),
          },
          unit_amount: formatAmountForStripe(item.price, 'gbp'),
        },
        quantity: item.quantity || 1,
      }
    })

    // Determine if shipping is needed (products need shipping, bookings/courses don't)
    const requiresShipping = type === 'product' || type === 'cart'
    
    // Determine payment methods based on Stripe account region
    // Klarna and Clearpay are only available in specific regions (UK, US, CA, AU, EU)
    // If your Stripe account is in India, these won't be available
    // Use payment configuration if provided, otherwise use direct payment methods
    const sessionConfig: any = {
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/cancel`,
      metadata: metadata || {},
      customer_email: metadata?.email || undefined,
    }

    // Option 1: Use payment method configuration (recommended - managed via Stripe Dashboard)
    if (process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID) {
      sessionConfig.payment_method_configuration = process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID
      // Payment methods will be determined by the configuration in Stripe Dashboard
    } else {
      // Option 2: Use direct payment methods (fallback)
      // Note: Klarna and Clearpay only work if your Stripe account is in supported regions
      // For UK-based business, ensure your Stripe account is set to UK
      // Note: Stripe uses 'afterpay_clearpay' not 'clearpay' as the payment method type
      sessionConfig.payment_method_types = ['card', 'klarna', 'afterpay_clearpay']
    }

    // Only require shipping address for products (not for bookings or courses)
    if (requiresShipping) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'DE', 'AT', 'NL', 'BE', 'DK', 'FI', 'NO', 'SE', 'ES', 'IT', 'FR', 'PL', 'CZ', 'IE'],
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
