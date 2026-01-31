import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Gallery from '@/lib/models/Gallery'

export async function GET() {
  try {
    await connectDB()
    const galleryItems = await Gallery.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, galleryItems })
  } catch (error: any) {
    console.error('Error fetching gallery items:', error)
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
    const { image, category, title, description, isActive } = body

    if (!image || !category || !title) {
      return NextResponse.json(
        { success: false, error: 'Image, category, and title are required' },
        { status: 400 }
      )
    }

    const galleryItem = await Gallery.create({
      image,
      category,
      title,
      description: description || '',
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({ success: true, galleryItem }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
