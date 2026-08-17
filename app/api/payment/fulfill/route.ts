import { NextRequest, NextResponse } from 'next/server'
import { fulfillBookingBySessionId } from '@/lib/fulfill-booking'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionId = body?.sessionId || body?.session_id

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const result = await fulfillBookingBySessionId(sessionId)

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      alreadyExists: result.alreadyExists,
      confirmationNumber: result.booking.confirmationNumber,
      emailSent: result.emailSent,
      emailError: result.emailError,
    })
  } catch (error: any) {
    console.error('Payment fulfill error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fulfill booking' },
      { status: 500 }
    )
  }
}
