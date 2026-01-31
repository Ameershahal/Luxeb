import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Stylist from '@/lib/models/Stylist'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const stylist = await Stylist.findById(id)
    
    if (!stylist) {
      return NextResponse.json(
        { success: false, error: 'Stylist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, stylist })
  } catch (error: any) {
    console.error('Error fetching stylist:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const { name, image, specialty, rating, experience, bio, isActive, availableTimes } = body

    const stylist = await Stylist.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(image && { image }),
        ...(specialty && { specialty }),
        ...(rating !== undefined && { rating }),
        ...(experience !== undefined && { experience }),
        ...(bio !== undefined && { bio }),
        ...(isActive !== undefined && { isActive }),
        ...(availableTimes !== undefined && { availableTimes }),
      },
      { new: true, runValidators: true }
    )

    if (!stylist) {
      return NextResponse.json(
        { success: false, error: 'Stylist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, stylist })
  } catch (error: any) {
    console.error('Error updating stylist:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const stylist = await Stylist.findByIdAndDelete(id)

    if (!stylist) {
      return NextResponse.json(
        { success: false, error: 'Stylist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Stylist deleted' })
  } catch (error: any) {
    console.error('Error deleting stylist:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
