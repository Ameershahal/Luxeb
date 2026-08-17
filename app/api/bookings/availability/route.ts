import { NextRequest, NextResponse } from 'next/server'
import { getBookedTimesForStylist } from '@/lib/booking-availability'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stylistId = searchParams.get('stylistId')
    const date = searchParams.get('date')

    if (!stylistId) {
      return NextResponse.json(
        { success: false, error: 'stylistId is required' },
        { status: 400 }
      )
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'date is required (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    const bookedTimes = await getBookedTimesForStylist(stylistId, date)

    return NextResponse.json({ success: true, bookedTimes })
  } catch (error: any) {
    console.error('Error fetching booking availability:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
