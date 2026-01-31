import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Stylist from '@/lib/models/Stylist'

const existingStylists = [
  {
    name: "Sofia Chen",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "nails" as const,
    rating: 4.9,
    experience: "8 years",
    bio: "Nail art specialist with a passion for intricate designs",
    isActive: true,
  },
  {
    name: "Emma Rose",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "beauty" as const,
    rating: 4.8,
    experience: "6 years",
    bio: "Skincare expert and lash extension artist",
    isActive: true,
  },
  {
    name: "Isabella Vega",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "nails" as const,
    rating: 4.9,
    experience: "5 years",
    bio: "Known for minimalist luxury nail designs",
    isActive: true,
  },
  {
    name: "Any Available",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "all" as const,
    rating: 5.0,
    experience: "",
    bio: "We'll match you with the best available stylist",
    isActive: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    let created = 0
    let skipped = 0

    for (const stylistData of existingStylists) {
      // Check if stylist already exists by name
      const existing = await Stylist.findOne({ name: stylistData.name })
      
      if (existing) {
        skipped++
        continue
      }

      await Stylist.create(stylistData)
      created++
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      message: `Created ${created} stylists, skipped ${skipped} existing ones`,
    })
  } catch (error: any) {
    console.error('Error seeding stylists:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
