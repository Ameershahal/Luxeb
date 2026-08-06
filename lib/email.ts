import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const notificationEmail =
  process.env.BOOKING_NOTIFICATION_EMAIL || 'academynails25@gmail.com'
const fromEmail =
  process.env.RESEND_FROM_EMAIL || 'Luxe Beauty <onboarding@resend.dev>'

export type BookingNotificationPayload = {
  confirmationNumber?: string
  client: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    notes?: string
  }
  services?: {
    name: string
    category?: string
    duration?: number
    price?: number
  }[]
  service?: {
    name?: string
    category?: string
    duration?: number
    price?: number
  }
  stylist?: {
    name?: string
  } | null
  dateTime?: {
    date?: Date | string
    time?: string
  }
  payment?: {
    amount?: number
    currency?: string
    status?: string
    stripeSessionId?: string
  }
  status?: string
}

function formatDate(date?: Date | string) {
  if (!date) return 'Not specified'
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return String(date)
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatMoney(amount?: number, currency = 'gbp') {
  if (typeof amount !== 'number') return '—'
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  } catch {
    return `${amount} ${currency.toUpperCase()}`
  }
}

function buildServicesList(payload: BookingNotificationPayload) {
  const services =
    payload.services && payload.services.length > 0
      ? payload.services
      : payload.service?.name
        ? [payload.service]
        : []

  if (services.length === 0) return 'No services listed'

  return services
    .map((s) => {
      const bits = [s.name]
      if (s.category) bits.push(`(${s.category})`)
      if (s.duration) bits.push(`· ${s.duration} min`)
      if (typeof s.price === 'number') bits.push(`· ${formatMoney(s.price)}`)
      return `• ${bits.join(' ')}`
    })
    .join('\n')
}

export async function sendBookingNotification(
  booking: BookingNotificationPayload
): Promise<{ ok: boolean; error?: string }> {
  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not configured; skipping booking email')
    return { ok: false, error: 'RESEND_API_KEY missing' }
  }

  const resend = new Resend(resendApiKey)
  const clientName =
    [booking.client?.firstName, booking.client?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || 'Unknown client'

  const subject = `New booking: ${clientName}${booking.confirmationNumber ? ` (${booking.confirmationNumber})` : ''}`

  const text = [
    'New booking received at Luxe Beauty & Training',
    '',
    `Confirmation: ${booking.confirmationNumber || 'Pending'}`,
    `Status: ${booking.status || 'confirmed'}`,
    '',
    'Client',
    `Name: ${clientName}`,
    `Email: ${booking.client?.email || '—'}`,
    `Phone: ${booking.client?.phone || '—'}`,
    booking.client?.notes ? `Notes: ${booking.client.notes}` : null,
    '',
    'Appointment',
    `Date: ${formatDate(booking.dateTime?.date)}`,
    `Time: ${booking.dateTime?.time || '—'}`,
    `Stylist: ${booking.stylist?.name || 'Any / not selected'}`,
    '',
    'Services',
    buildServicesList(booking),
    '',
    'Payment',
    `Amount: ${formatMoney(booking.payment?.amount, booking.payment?.currency || 'gbp')}`,
    `Status: ${booking.payment?.status || '—'}`,
    booking.payment?.stripeSessionId
      ? `Stripe session: ${booking.payment.stripeSessionId}`
      : null,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h1 style="font-size:22px;font-weight:normal;margin:0 0 16px">New booking</h1>
      <p style="margin:0 0 20px;color:#555">Luxe Beauty &amp; Training</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#777">Confirmation</td><td style="padding:6px 0"><strong>${booking.confirmationNumber || 'Pending'}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#777">Status</td><td style="padding:6px 0">${booking.status || 'confirmed'}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Client</td><td style="padding:6px 0">${clientName}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Email</td><td style="padding:6px 0"><a href="mailto:${booking.client?.email || ''}">${booking.client?.email || '—'}</a></td></tr>
        <tr><td style="padding:6px 0;color:#777">Phone</td><td style="padding:6px 0"><a href="tel:${booking.client?.phone || ''}">${booking.client?.phone || '—'}</a></td></tr>
        <tr><td style="padding:6px 0;color:#777">Date</td><td style="padding:6px 0">${formatDate(booking.dateTime?.date)}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Time</td><td style="padding:6px 0">${booking.dateTime?.time || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Stylist</td><td style="padding:6px 0">${booking.stylist?.name || 'Any / not selected'}</td></tr>
        <tr><td style="padding:6px 0;color:#777;vertical-align:top">Services</td><td style="padding:6px 0;white-space:pre-line">${buildServicesList(booking)}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Amount</td><td style="padding:6px 0">${formatMoney(booking.payment?.amount, booking.payment?.currency || 'gbp')}</td></tr>
        ${booking.client?.notes ? `<tr><td style="padding:6px 0;color:#777">Notes</td><td style="padding:6px 0">${booking.client.notes}</td></tr>` : ''}
      </table>
    </div>
  `

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [notificationEmail],
      subject,
      text,
      html,
      replyTo: booking.client?.email || undefined,
    })

    if (error) {
      console.error('Resend booking notification failed:', error)
      return { ok: false, error: error.message }
    }

    return { ok: true }
  } catch (err: any) {
    console.error('Resend booking notification error:', err)
    return { ok: false, error: err?.message || 'Failed to send email' }
  }
}
