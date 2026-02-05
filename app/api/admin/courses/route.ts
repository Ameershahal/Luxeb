import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'

export async function GET() {
  try {
    await connectDB()
    const courses = await Course.find({}).sort({ createdAt: -1 })
    const list = courses.map((c: any) => ({
      id: c._id.toString(),
      _id: c._id.toString(),
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
      isActive: c.isActive !== false,
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

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const {
      title,
      description,
      price,
      duration,
      location,
      maxStudents,
      image,
      featured,
    } = body

    if (!title || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Title and price are required' },
        { status: 400 }
      )
    }

    const students = maxStudents != null && maxStudents !== ''
      ? `Max ${maxStudents} students`
      : ''

    const course = await Course.create({
      title,
      description: description || '',
      price: Number(price),
      duration: duration || '',
      location: location || '',
      students,
      image: image || '',
      featured: !!featured,
      isActive: true,
    })

    const created = {
      id: course._id.toString(),
      title: course.title,
      description: course.description,
      price: course.price,
      duration: course.duration,
      location: course.location,
      students: course.students,
      image: course.image,
      featured: course.featured,
      isActive: course.isActive,
    }

    return NextResponse.json({ success: true, course: created }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
