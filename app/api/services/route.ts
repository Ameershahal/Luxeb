import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Only return active services for public booking
    const services = await Service.find({ isActive: true })
      .sort({ category: 1, name: 1 })
    
    // Convert to format expected by frontend
    const formattedServices = services.map((service: any) => ({
      id: service._id.toString(),
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      description: service.description || '',
      sizes: service.sizes && service.sizes.length > 0 ? service.sizes : undefined,
      subServices: service.subServices && service.subServices.length > 0 ? service.subServices : undefined,
    }))
    
    return NextResponse.json({ success: true, services: formattedServices })
  } catch (error: any) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
