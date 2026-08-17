import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'

export async function GET() {
  try {
    await connectDB()

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(100)

    return NextResponse.json({ success: true, bookings })
  } catch (error: any) {
    console.error('Error fetching admin bookings:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
