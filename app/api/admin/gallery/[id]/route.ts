import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Gallery from '@/lib/models/Gallery'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const galleryItem = await Gallery.findById(id)
    
    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, galleryItem })
  } catch (error: any) {
    console.error('Error fetching gallery item:', error)
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
    const { image, category, title, description, isActive } = body

    const galleryItem = await Gallery.findByIdAndUpdate(
      id,
      {
        ...(image && { image }),
        ...(category && { category }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    )

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, galleryItem })
  } catch (error: any) {
    console.error('Error updating gallery item:', error)
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
    const galleryItem = await Gallery.findByIdAndDelete(id)

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Gallery item deleted' })
  } catch (error: any) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
