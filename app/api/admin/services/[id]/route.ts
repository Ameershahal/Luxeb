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
    const { name, category, duration, price, description, isActive, sizes } = body

    let sanitizedSizes: { size: string; price: number }[] | undefined
    if (Array.isArray(sizes)) {
      if (sizes.length === 0) {
        sanitizedSizes = undefined
      } else {
        const list = sizes
          .filter((s: any) => s && ['S', 'M', 'L', 'XL'].includes(s.size) && typeof s.price === 'number')
          .map((s: any) => ({ size: s.size, price: Number(s.price) }))
        if (list.length > 0) sanitizedSizes = list
      }
    }

    const hasSizes = sanitizedSizes && sanitizedSizes.length > 0
    const resolvedPrice =
      price !== undefined && price !== ''
        ? parseFloat(price)
        : hasSizes
          ? Math.min(...sanitizedSizes!.map((s) => s.price))
          : undefined

    const update: Record<string, unknown> = {
      ...(name && { name }),
      ...(category && { category }),
      ...(duration !== undefined && { duration: parseInt(duration) }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
    }
    if (resolvedPrice !== undefined) update.price = resolvedPrice
    if (Array.isArray(sizes)) {
      if (sizes.length === 0) {
        update.sizes = undefined
      } else if (sanitizedSizes && sanitizedSizes.length > 0) {
        update.sizes = sanitizedSizes
      }
    }

    const service = await Service.findByIdAndUpdate(
      id,
      update,
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
