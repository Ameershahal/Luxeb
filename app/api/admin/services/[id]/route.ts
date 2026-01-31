import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const service = await Service.findById(id)
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, service })
  } catch (error: any) {
    console.error('Error fetching service:', error)
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
    const { name, category, duration, price, description, isActive } = body

    const service = await Service.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(category && { category }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    )

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, service })
  } catch (error: any) {
    console.error('Error updating service:', error)
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
    const service = await Service.findByIdAndDelete(id)

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Service deleted' })
  } catch (error: any) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
