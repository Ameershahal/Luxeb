import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'
import {
  normalizeTimeSlot,
  toDateKey,
  toDateKeyFromLocal,
} from '@/lib/booking-utils'

const ACTIVE_STATUSES = ['confirmed', 'pending'] as const

export async function getBookedTimesForStylist(
  stylistId: string,
  dateKey: string
): Promise<string[]> {
  if (!stylistId || stylistId === 'any-available') return []

  await connectDB()

  const [y, m, d] = dateKey.split('-').map(Number)
  const rangeStart = new Date(y, m - 1, d - 1)
  const rangeEnd = new Date(y, m - 1, d + 1, 23, 59, 59, 999)

  const bookings = await Booking.find({
    'stylist.id': stylistId,
    status: { $in: ACTIVE_STATUSES },
    'dateTime.date': { $gte: rangeStart, $lte: rangeEnd },
  }).select('dateTime')

  const booked = new Set<string>()

  for (const booking of bookings) {
    const bookingDateKey = toDateKey(new Date(booking.dateTime.date))
    if (bookingDateKey === dateKey && booking.dateTime.time) {
      booked.add(normalizeTimeSlot(booking.dateTime.time))
    }
  }

  return Array.from(booked)
}

export async function isTimeSlotBooked(
  stylistId: string,
  date: Date | string,
  time: string
): Promise<boolean> {
  if (!stylistId || stylistId === 'any-available') return false

  const dateKey =
    typeof date === 'string'
      ? date
      : toDateKeyFromLocal(date instanceof Date ? date : new Date(date))

  const booked = await getBookedTimesForStylist(stylistId, dateKey)
  return booked.includes(normalizeTimeSlot(time))
}
