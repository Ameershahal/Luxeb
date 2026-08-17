import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, booking })
  } catch (error: any) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    )
  }
}
