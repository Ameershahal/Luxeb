import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Gallery from '@/lib/models/Gallery'

export async function GET() {
  try {
    await connectDB()
    const items = await Gallery.find({ isActive: true }).sort({ createdAt: -1 })
    const list = items.map((item: any) => ({
      id: item._id.toString(),
      image: item.image || '',
      category: item.category,
      title: item.title,
      description: item.description || '',
    }))
    return NextResponse.json({ success: true, galleryItems: list })
  } catch (error: any) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
