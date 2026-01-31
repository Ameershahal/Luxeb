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
    const { name, category, duration, price, description, isActive } = body

    if (!name || !category || !duration || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, category, duration, and price are required' },
        { status: 400 }
      )
    }

    const service = await Service.create({
      name,
      category,
      duration: parseInt(duration),
      price: parseFloat(price),
      description: description || '',
      isActive: isActive !== undefined ? isActive : true,
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
