import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Course from '@/lib/models/Course'
import Booking from '@/lib/models/Booking'
import Order from '@/lib/models/Order'
import CourseEnrollment from '@/lib/models/CourseEnrollment'

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function formatMoney(amount: number, currency = 'gbp') {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `£${Math.round(amount)}`
  }
}

async function sumCompletedPayments(
  model: typeof Order | typeof Booking | typeof CourseEnrollment,
  dateFilter?: { $gte: Date; $lt?: Date }
) {
  const query: Record<string, unknown> = { 'payment.status': 'completed' }
  if (dateFilter) {
    query['payment.paidAt'] = dateFilter
  }

  const docs = await model.find(query).select('payment.amount payment.currency payment.paidAt')
  return docs.reduce((sum, doc) => sum + (doc.payment?.amount || 0), 0)
}

export async function GET() {
  try {
    await connectDB()

    const now = new Date()
    const monthStart = startOfMonth(now)
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    const todayStart = startOfDay(now)
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    const [
      totalProducts,
      productsAddedThisMonth,
      activeCourses,
      pendingBookings,
      confirmedBookings,
      bookingsToday,
      recentBookings,
      revenueThisMonth,
      revenueLastMonth,
      totalRevenue,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ createdAt: { $gte: monthStart } }),
      Course.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ createdAt: { $gte: todayStart, $lt: tomorrowStart } }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('client services service stylist dateTime status confirmationNumber createdAt'),
      Promise.all([
        sumCompletedPayments(Order, { $gte: monthStart }),
        sumCompletedPayments(Booking, { $gte: monthStart }),
        sumCompletedPayments(CourseEnrollment, { $gte: monthStart }),
      ]).then((parts) => parts.reduce((a, b) => a + b, 0)),
      Promise.all([
        sumCompletedPayments(Order, { $gte: lastMonthStart, $lt: monthStart }),
        sumCompletedPayments(Booking, { $gte: lastMonthStart, $lt: monthStart }),
        sumCompletedPayments(CourseEnrollment, { $gte: lastMonthStart, $lt: monthStart }),
      ]).then((parts) => parts.reduce((a, b) => a + b, 0)),
      Promise.all([
        sumCompletedPayments(Order),
        sumCompletedPayments(Booking),
        sumCompletedPayments(CourseEnrollment),
      ]).then((parts) => parts.reduce((a, b) => a + b, 0)),
    ])

    let revenueChangeLabel = 'No revenue last month'
    if (revenueLastMonth > 0) {
      const change = ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      const sign = change >= 0 ? '+' : ''
      revenueChangeLabel = `${sign}${Math.round(change)}% from last month`
    } else if (revenueThisMonth > 0) {
      revenueChangeLabel = 'New revenue this month'
    }

    const recent = recentBookings.map((booking) => {
      const clientName = [booking.client?.firstName, booking.client?.lastName]
        .filter(Boolean)
        .join(' ')
      const services =
        booking.services?.map((s: { name: string }) => s.name).join(', ') ||
        booking.service?.name ||
        'Booking'
      const stylist = booking.stylist?.name || 'Any available'
      const date = booking.dateTime?.date
        ? new Date(booking.dateTime.date).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
        : '—'

      return {
        id: booking._id.toString(),
        clientName: clientName || 'Unknown client',
        summary: `${services} · ${stylist} · ${date} ${booking.dateTime?.time || ''}`.trim(),
        status: booking.status,
        confirmationNumber: booking.confirmationNumber,
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        productsAddedThisMonth,
        activeCourses,
        pendingBookings,
        confirmedBookings,
        bookingsToday,
        totalRevenue,
        revenueThisMonth,
        revenueFormatted: formatMoney(totalRevenue),
        revenueChangeLabel,
        revenueTrend: revenueThisMonth >= revenueLastMonth ? 'up' : 'down',
      },
      recentBookings: recent,
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
