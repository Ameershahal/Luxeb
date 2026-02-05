import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'

export async function GET() {
  try {
    await connectDB()
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 })
    const list = courses.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      description: c.description || '',
      price: c.price,
      duration: c.duration || '',
      location: c.location || '',
      students: c.students || '',
      image: c.image || '',
      featured: !!c.featured,
      rating: c.rating ?? 0,
      reviews: c.reviews ?? 0,
    }))
    return NextResponse.json({ success: true, courses: list })
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
