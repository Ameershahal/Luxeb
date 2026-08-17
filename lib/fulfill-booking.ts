import Stripe from 'stripe'
import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'
import { sendBookingNotification } from '@/lib/email'
import { stripe } from '@/lib/stripe'
import { isTimeSlotBooked } from '@/lib/booking-availability'
import { toDateKeyFromLocal } from '@/lib/booking-utils'

type BookingService = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  size?: string
  subServiceName?: string
}

async function parseServicesFromSession(session: Stripe.Checkout.Session): Promise<BookingService[]> {
  let services: BookingService[] = []

  if (session.metadata?.servicesJson) {
    try {
      services = JSON.parse(session.metadata.servicesJson as string)
    } catch {
      services = []
    }
  }

  if (services.length === 0 && session.metadata?.serviceId) {
    services = [{
      id: session.metadata.serviceId || '',
      name: session.metadata.serviceName || '',
      category: session.metadata.serviceCategory || '',
      duration: parseInt(session.metadata.serviceDuration || '0', 10),
      price: session.amount_total ? session.amount_total / 100 : 0,
    }]
  }

  if (services.length === 0) {
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      services = lineItems.data.map((item) => ({
        id: item.id,
        name:
          item.description ||
          (item.price?.product as Stripe.Product | undefined)?.name ||
          'Service',
        category: session.metadata?.serviceCategory || 'Booking',
        duration: 0,
        price: item.amount_total ? item.amount_total / 100 : 0,
      }))
    } catch {
      services = []
    }
  }

  return services
}

function buildBookingData(session: Stripe.Checkout.Session, services: BookingService[]) {
  return {
    service: services[0] || undefined,
    services,
    stylist: session.metadata?.stylistId ? {
      id: session.metadata.stylistId,
      name: session.metadata.stylistName || '',
      image: session.metadata.stylistImage || '',
      specialty: session.metadata.stylistSpecialty || '',
    } : null,
    dateTime: {
      date: session.metadata?.date ? new Date(session.metadata.date) : new Date(),
      time: session.metadata?.time || '',
    },
    client: {
      firstName: session.metadata?.clientName?.split(' ')[0] || '',
      lastName: session.metadata?.clientName?.split(' ').slice(1).join(' ') || '',
      email: session.customer_email || session.metadata?.email || '',
      phone: session.metadata?.phone || '',
      notes: session.metadata?.notes || '',
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
}

export async function fulfillBookingFromSession(
  session: Stripe.Checkout.Session,
  options: { sendEmail?: boolean } = { sendEmail: true }
) {
  if (session.metadata?.type !== 'booking') {
    return { ok: false as const, error: 'Not a booking session' }
  }

  if (session.payment_status !== 'paid') {
    return { ok: false as const, error: 'Payment not completed' }
  }

  await connectDB()

  const existing = await Booking.findOne({ 'payment.stripeSessionId': session.id })
  if (existing) {
    if (options.sendEmail) {
      const emailResult = await sendBookingNotification({
        confirmationNumber: existing.confirmationNumber,
        client: existing.client,
        services: existing.services,
        service: existing.service,
        stylist: existing.stylist,
        dateTime: existing.dateTime,
        payment: existing.payment,
        status: existing.status,
      })
      return {
        ok: true as const,
        alreadyExists: true,
        booking: existing,
        emailSent: emailResult.ok,
        emailError: emailResult.error,
      }
    }
    return { ok: true as const, alreadyExists: true, booking: existing, emailSent: false }
  }

  const services = await parseServicesFromSession(session)
  const bookingData = buildBookingData(session, services)

  const stylistId = session.metadata?.stylistId
  const bookingTime = session.metadata?.time
  const bookingDate = session.metadata?.date

  if (stylistId && stylistId !== 'any-available' && bookingTime && bookingDate) {
    const taken = await isTimeSlotBooked(
      stylistId,
      toDateKeyFromLocal(new Date(bookingDate)),
      bookingTime
    )
    if (taken) {
      return { ok: false as const, error: 'This time slot is no longer available' }
    }
  }

  const booking = await Booking.create(bookingData)
  console.log('Booking saved to database:', session.id)

  let emailSent = false
  let emailError: string | undefined

  if (options.sendEmail) {
    const emailResult = await sendBookingNotification({
      confirmationNumber: booking.confirmationNumber,
      client: booking.client,
      services: booking.services,
      service: booking.service,
      stylist: booking.stylist,
      dateTime: booking.dateTime,
      payment: booking.payment,
      status: booking.status,
    })
    emailSent = emailResult.ok
    emailError = emailResult.error
    if (!emailResult.ok) {
      console.error('Booking notification email failed:', emailResult.error)
    }
  }

  return {
    ok: true as const,
    alreadyExists: false,
    booking,
    emailSent,
    emailError,
  }
}

export async function fulfillBookingBySessionId(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return fulfillBookingFromSession(session)
}
