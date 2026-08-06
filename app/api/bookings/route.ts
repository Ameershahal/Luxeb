import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'
import { sendBookingNotification } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')

    const query: any = {}
    if (email) {
      query['client.email'] = email
    }
    if (status) {
      query.status = status
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({ bookings })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const booking = await Booking.create(body)

    // Notify salon owner (do not fail booking create if email fails)
    try {
      await sendBookingNotification({
        confirmationNumber: booking.confirmationNumber,
        client: booking.client,
        services: booking.services,
        service: booking.service,
        stylist: booking.stylist,
        dateTime: booking.dateTime,
        payment: booking.payment,
        status: booking.status,
      })
    } catch (emailError: any) {
      console.error('Booking notification email failed:', emailError?.message || emailError)
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
} 
 