import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Stylist from '@/lib/models/Stylist'

export async function GET() {
  try {
    await connectDB()
    const stylists = await Stylist.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, stylists })
  } catch (error: any) {
    console.error('Error fetching stylists:', error)
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
    const { name, image, specialty, rating, experience, bio, isActive, availableTimes } = body

    if (!name || !specialty) {
      return NextResponse.json(
        { success: false, error: 'Name and specialty are required' },
        { status: 400 }
      )
    }

    const stylist = await Stylist.create({
      name,
      image: image || '/placeholder.svg?height=200&width=200',
      specialty,
      rating: rating || 5.0,
      experience: experience || '',
      bio: bio || '',
      isActive: isActive !== undefined ? isActive : true,
      availableTimes: availableTimes || [],
    })

    return NextResponse.json({ success: true, stylist }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating stylist:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
