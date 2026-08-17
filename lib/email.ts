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
    size?: string
    subServiceName?: string
  }[]
  service?: {
    name?: string
    category?: string
    duration?: number
    price?: number
    size?: string
    subServiceName?: string
  }
  stylist?: {
    name?: string
    specialty?: string
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
    paidAt?: Date | string
  }
  status?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

function formatCategory(category?: string) {
  if (!category) return ''
  return category
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getServices(payload: BookingNotificationPayload) {
  if (payload.services && payload.services.length > 0) return payload.services
  if (payload.service?.name) return [payload.service]
  return []
}

function getServiceLabel(service: {
  name: string
  category?: string
  subServiceName?: string
  size?: string
}) {
  const parts = [service.name]
  if (service.subServiceName) parts.push(`– ${service.subServiceName}`)
  if (service.size) parts.push(`(${service.size})`)
  return parts.join(' ')
}

function getServicesSummary(payload: BookingNotificationPayload) {
  const services = getServices(payload)
  if (services.length === 0) return 'Booking'
  return services.map((s) => getServiceLabel(s)).join(', ')
}

function buildServicesText(payload: BookingNotificationPayload) {
  const services = getServices(payload)
  if (services.length === 0) return 'No services listed'

  return services
    .map((s, index) => {
      const lines = [
        `${index + 1}. ${getServiceLabel(s)}`,
        `   Category: ${formatCategory(s.category) || '—'}`,
        `   Duration: ${s.duration ? `${s.duration} min` : '—'}`,
        `   Price paid: ${formatMoney(s.price, payload.payment?.currency || 'gbp')}`,
      ]
      return lines.join('\n')
    })
    .join('\n\n')
}

function buildServicesHtml(payload: BookingNotificationPayload) {
  const services = getServices(payload)
  const currency = payload.payment?.currency || 'gbp'

  if (services.length === 0) {
    return '<p style="margin:0;color:#555">No service details available.</p>'
  }

  const rows = services
    .map(
      (s) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee">
          <strong>${escapeHtml(getServiceLabel(s))}</strong><br>
          <span style="color:#666;font-size:13px">${escapeHtml(formatCategory(s.category) || '—')}${s.duration ? ` · ${s.duration} min` : ''}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">
          ${escapeHtml(formatMoney(s.price, currency))}
        </td>
      </tr>`
    )
    .join('')

  const total = services.reduce((sum, s) => sum + (s.price || 0), 0)

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #eee;border-radius:8px;overflow:hidden">
      <thead>
        <tr style="background:#faf7f7">
          <th style="padding:10px 12px;text-align:left;color:#777;font-weight:600">Service paid for</th>
          <th style="padding:10px 12px;text-align:right;color:#777;font-weight:600">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="background:#faf7f7">
          <td style="padding:12px;font-weight:600">Total paid</td>
          <td style="padding:12px;text-align:right;font-weight:600">${escapeHtml(formatMoney(payload.payment?.amount ?? total, currency))}</td>
        </tr>
      </tfoot>
    </table>
  `
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
  const servicesSummary = getServicesSummary(booking)
  const currency = booking.payment?.currency || 'gbp'

  const subject = `New paid booking – ${clientName} – ${servicesSummary}`

  const text = [
    'NEW PAID BOOKING – Luxe Beauty & Training',
    '',
    `Confirmation: ${booking.confirmationNumber || 'Pending'}`,
    `Status: ${booking.status || 'confirmed'}`,
    '',
    'CLIENT DETAILS',
    `Name: ${clientName}`,
    `Email: ${booking.client?.email || '—'}`,
    `Phone: ${booking.client?.phone || '—'}`,
    booking.client?.notes ? `Notes: ${booking.client.notes}` : null,
    '',
    'SERVICES PAID FOR',
    buildServicesText(booking),
    '',
    'APPOINTMENT',
    `Date: ${formatDate(booking.dateTime?.date)}`,
    `Time: ${booking.dateTime?.time || '—'}`,
    `Stylist: ${booking.stylist?.name || 'Any / not selected'}`,
    booking.stylist?.specialty ? `Specialty: ${booking.stylist.specialty}` : null,
    '',
    'PAYMENT',
    `Total paid: ${formatMoney(booking.payment?.amount, currency)}`,
    `Status: ${booking.payment?.status || 'completed'}`,
    booking.payment?.stripeSessionId
      ? `Stripe session: ${booking.payment.stripeSessionId}`
      : null,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const html = `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:620px;margin:0 auto;color:#1a1a1a;background:#fff">
      <div style="padding:24px 24px 16px;border-bottom:3px solid #F9DFDF">
        <h1 style="font-size:24px;font-weight:normal;margin:0 0 8px">New paid booking</h1>
        <p style="margin:0;color:#666">Luxe Beauty &amp; Training Academy</p>
        <p style="margin:8px 0 0;color:#888;font-size:13px">Confirmation <strong>${escapeHtml(booking.confirmationNumber || 'Pending')}</strong></p>
      </div>

      <div style="padding:24px">
        <h2 style="font-size:16px;font-weight:600;margin:0 0 12px;color:#444;text-transform:uppercase;letter-spacing:0.04em">Client details</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          <tr><td style="padding:6px 0;color:#777;width:120px">Name</td><td style="padding:6px 0"><strong>${escapeHtml(clientName)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#777">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(booking.client?.email || '')}" style="color:#111">${escapeHtml(booking.client?.email || '—')}</a></td></tr>
          <tr><td style="padding:6px 0;color:#777">Phone</td><td style="padding:6px 0"><a href="tel:${escapeHtml(booking.client?.phone || '')}" style="color:#111">${escapeHtml(booking.client?.phone || '—')}</a></td></tr>
          ${booking.client?.notes ? `<tr><td style="padding:6px 0;color:#777;vertical-align:top">Notes</td><td style="padding:6px 0">${escapeHtml(booking.client.notes)}</td></tr>` : ''}
        </table>

        <h2 style="font-size:16px;font-weight:600;margin:0 0 12px;color:#444;text-transform:uppercase;letter-spacing:0.04em">Services paid for</h2>
        ${buildServicesHtml(booking)}

        <h2 style="font-size:16px;font-weight:600;margin:24px 0 12px;color:#444;text-transform:uppercase;letter-spacing:0.04em">Appointment</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          <tr><td style="padding:6px 0;color:#777;width:120px">Date</td><td style="padding:6px 0">${escapeHtml(formatDate(booking.dateTime?.date))}</td></tr>
          <tr><td style="padding:6px 0;color:#777">Time</td><td style="padding:6px 0">${escapeHtml(booking.dateTime?.time || '—')}</td></tr>
          <tr><td style="padding:6px 0;color:#777">Stylist</td><td style="padding:6px 0">${escapeHtml(booking.stylist?.name || 'Any / not selected')}</td></tr>
        </table>

        <p style="margin:0;font-size:13px;color:#888">Payment status: ${escapeHtml(booking.payment?.status || 'completed')} · ${escapeHtml(formatMoney(booking.payment?.amount, currency))}</p>
      </div>
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

    console.log('Booking notification email sent to', notificationEmail)
    return { ok: true }
  } catch (err: any) {
    console.error('Resend booking notification error:', err)
    return { ok: false, error: err?.message || 'Failed to send email' }
  }
}
