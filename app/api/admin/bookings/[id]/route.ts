import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'

// GET - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    
    const booking = await Booking.findById(id)
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: booking })
  } catch (error: any) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update booking (status, date, time, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (body.status) updateData.status = body.status
    if (body.dateTime) {
      updateData['dateTime.date'] = body.dateTime.date
      updateData['dateTime.time'] = body.dateTime.time
    }
    if (body.client) {
      if (body.client.firstName) updateData['client.firstName'] = body.client.firstName
      if (body.client.lastName) updateData['client.lastName'] = body.client.lastName
      if (body.client.email) updateData['client.email'] = body.client.email
      if (body.client.phone) updateData['client.phone'] = body.client.phone
      if (body.client.notes) updateData['client.notes'] = body.client.notes
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: booking })
  } catch (error: any) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const booking = await Booking.findByIdAndDelete(id)
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Booking deleted' })
  } catch (error: any) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
