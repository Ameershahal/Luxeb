import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Service from '@/lib/models/Service'

const existingServices = [
  // Nails
  {
    name: "Classic Manicure",
    category: "nails" as const,
    duration: 45,
    price: 45,
    description: "Essential nail care with polish of your choice",
    isActive: true,
  },
  {
    name: "Gel Manicure",
    category: "nails" as const,
    duration: 60,
    price: 65,
    description: "Long-lasting gel polish with cuticle care",
    isActive: true,
  },
  {
    name: "Luxury Spa Manicure",
    category: "nails" as const,
    duration: 75,
    price: 85,
    description: "Full treatment with massage and premium products",
    isActive: true,
  },
  {
    name: "Nail Art Design",
    category: "nails" as const,
    duration: 90,
    price: 120,
    description: "Custom artistic designs by our nail artists",
    isActive: true,
  },
  // Beauty
  {
    name: "Signature Facial",
    category: "beauty" as const,
    duration: 60,
    price: 125,
    description: "Customized facial for radiant skin",
    isActive: true,
  },
  {
    name: "Lash Extensions",
    category: "beauty" as const,
    duration: 90,
    price: 185,
    description: "Classic or volume lash application",
    isActive: true,
  },
  {
    name: "Brow Styling",
    category: "beauty" as const,
    duration: 30,
    price: 55,
    description: "Shaping, tinting, and lamination",
    isActive: true,
  },
  {
    name: "Bridal Makeup",
    category: "beauty" as const,
    duration: 90,
    price: 225,
    description: "Flawless makeup for your special day",
    isActive: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    let created = 0
    let skipped = 0

    for (const serviceData of existingServices) {
      // Check if service already exists by name
      const existing = await Service.findOne({ name: serviceData.name })
      
      if (existing) {
        skipped++
        continue
      }

      await Service.create(serviceData)
      created++
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      message: `Created ${created} services, skipped ${skipped} existing ones`,
    })
  } catch (error: any) {
    console.error('Error seeding services:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
