import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function GET() {
  try {
    await connectDB()
    const services = await Service.find({}).sort({ category: 1, name: 1 })
    return NextResponse.json({ success: true, services })
  } catch (error: any) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, category, duration, price, description, isActive, sizes, subServices } = body

    if (!name || !category || !duration) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and duration are required' },
        { status: 400 }
      )
    }

    const sanitizedSizes = Array.isArray(sizes) && sizes.length > 0
      ? sizes
          .filter((s: any) => s && ['S', 'M', 'L', 'XL'].includes(s.size) && typeof s.price === 'number')
          .map((s: any) => ({ size: s.size, price: Number(s.price) }))
      : undefined

    const hasSizes = sanitizedSizes && sanitizedSizes.length > 0
    const resolvedPrice = hasSizes
      ? (price !== undefined && price !== '' ? parseFloat(price) : Math.min(...sanitizedSizes.map((s: any) => s.price)))
      : parseFloat(price)
    if (!hasSizes && (price === undefined || price === '')) {
      return NextResponse.json(
        { success: false, error: 'Price is required when no size prices are set' },
        { status: 400 }
      )
    }

    const sanitizedSubServices = Array.isArray(subServices) && subServices.length > 0
      ? subServices
          .filter((s: any) => s && typeof s.name === 'string' && s.name.trim() && typeof s.price === 'number')
          .map((s: any) => ({ name: String(s.name).trim(), price: Number(s.price) }))
      : undefined

    const service = await Service.create({
      name,
      category,
      duration: parseInt(duration),
      price: resolvedPrice,
      description: description || '',
      isActive: isActive !== undefined ? isActive : true,
      ...(hasSizes && { sizes: sanitizedSizes }),
      ...(sanitizedSubServices && sanitizedSubServices.length > 0 && { subServices: sanitizedSubServices }),
    })

    return NextResponse.json({ success: true, service }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
