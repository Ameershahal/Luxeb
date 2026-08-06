import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'
import Order from '@/lib/models/Order'
import CourseEnrollment from '@/lib/models/CourseEnrollment'
import { sendBookingNotification } from '@/lib/email'

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Connect to MongoDB
  try {
    await connectDB()
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message)
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Payment successful for session:', session.id)
      
      try {
        // Save booking if it's a booking payment
        if (session.metadata?.type === 'booking') {
          let services: { id: string; name: string; category: string; duration: number; price: number }[] = []
          if (session.metadata.servicesJson) {
            try {
              services = JSON.parse(session.metadata.servicesJson as string)
            } catch {
              services = []
            }
          }
          if (services.length === 0 && session.metadata.serviceId) {
            services = [{
              id: session.metadata.serviceId || '',
              name: session.metadata.serviceName || '',
              category: session.metadata.serviceCategory || '',
              duration: parseInt(session.metadata.serviceDuration || '0'),
              price: session.amount_total ? session.amount_total / 100 : 0,
            }]
          }
          const bookingData = {
            service: services[0] || undefined,
            services,
            stylist: session.metadata.stylistId ? {
              id: session.metadata.stylistId,
              name: session.metadata.stylistName || '',
              image: session.metadata.stylistImage || '',
              specialty: session.metadata.stylistSpecialty || '',
            } : null,
            dateTime: {
              date: session.metadata.date ? new Date(session.metadata.date) : new Date(),
              time: session.metadata.time || '',
            },
            client: {
              firstName: session.metadata.clientName?.split(' ')[0] || '',
              lastName: session.metadata.clientName?.split(' ').slice(1).join(' ') || '',
              email: session.customer_email || session.metadata.email || '',
              phone: session.metadata.phone || '',
              notes: session.metadata.notes || '',
            },
            payment: {
              stripeSessionId: session.id,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency || 'gbp',
              status: 'completed' as const,
              paidAt: new Date(),
            },
            status: 'confirmed' as const,
          }

          const booking = await Booking.create(bookingData)
          console.log('Booking saved to database:', session.metadata)

          // Notify salon owner (do not fail webhook if email fails)
          try {
            await sendBookingNotification({
              confirmationNumber: booking.confirmationNumber,
              client: booking.client,
              services: booking.services,
              service: booking.service,
              stylist: booking.stylist,
              dateTime: booking.dateTime,
              payment: booking.payment,
              status: booking.status,
            })
          } catch (emailError: any) {
            console.error('Booking notification email failed:', emailError?.message || emailError)
          }
        }
        
        // Save order if it's a product purchase
        if (session.metadata?.type === 'product') {
          // Retrieve line items to get product details
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
          
          const orderData = {
            items: lineItems.data.map((item: any) => ({
              productId: session.metadata?.productId || '',
              productName: item.description || item.price_data?.product_data?.name || 'Product',
              price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
              quantity: item.quantity || 1,
              image: item.price?.product_data?.images?.[0],
            })),
            customer: {
              name: session.customer_details?.name,
              email: session.customer_email || session.customer_details?.email || '',
              phone: session.customer_details?.phone,
            },
            payment: {
              stripeSessionId: session.id,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency || 'gbp',
              status: 'completed' as const,
              paidAt: new Date(),
            },
            status: 'processing' as const,
          }

          await Order.create(orderData)
          console.log('Order saved to database:', session.metadata)
        }

        // Save course enrollment if it's a course payment
        if (session.metadata?.type === 'course') {
          const enrollmentData: any = {
            course: {
              id: session.metadata.courseId || '',
              title: session.metadata.courseName || '',
              description: session.metadata.courseDescription || '',
              duration: session.metadata.duration || '',
              location: session.metadata.location || '',
              price: session.amount_total ? session.amount_total / 100 : 0,
            },
            student: {
              name: session.customer_details?.name || session.metadata.studentName || '',
              email: session.customer_email || session.customer_details?.email || '',
              phone: session.customer_details?.phone || session.metadata.studentPhone || '',
            },
            payment: {
              stripeSessionId: session.id,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency || 'gbp',
              status: 'completed' as const,
              paidAt: new Date(),
            },
            status: 'confirmed' as const,
          }

          // Add selected start date if provided
          if (session.metadata.selectedStartDate) {
            enrollmentData.selectedStartDate = session.metadata.selectedStartDate
          }

          await CourseEnrollment.create(enrollmentData)
          console.log('Course enrollment saved to database:', session.metadata)
        }
      } catch (error: any) {
        console.error('Error saving to database:', error.message)
        // Don't fail the webhook, just log the error
      }
      
      break

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent failed:', failedPayment.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
