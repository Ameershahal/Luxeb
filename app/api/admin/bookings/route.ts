import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'

// GET - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }

    const bookings = await Booking.find(query)
      .sort({ 'dateTime.date': -1, 'dateTime.time': 1 })
      .limit(100)

    return NextResponse.json({ success: true, data: bookings })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
