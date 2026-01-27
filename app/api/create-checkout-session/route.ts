import { NextRequest, NextResponse } from 'next/server'
import { stripe, formatAmountForStripe } from '@/lib/stripe'

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
      
      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            description: item.description || '',
            // Only include images array if we have a valid URL
            ...(imageUrl ? { images: [imageUrl] } : {}),
          },
          unit_amount: formatAmountForStripe(item.price, 'gbp'),
        },
        quantity: item.quantity || 1,
      }
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/cancel`,
      metadata: metadata || {},
      customer_email: metadata?.email || undefined,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
