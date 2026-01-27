import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryImage from '@/lib/models/GalleryImage'

// GET - Fetch all gallery images
export async function GET() {
  try {
    await connectDB()
    const images = await GalleryImage.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: images })
  } catch (error: any) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Add new gallery image
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const image = await GalleryImage.create({
      title: body.title,
      image: body.image,
      category: body.category,
      featured: body.featured || false,
    })

    return NextResponse.json({ success: true, data: image }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
