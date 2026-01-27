import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'

// GET - Fetch all courses
export async function GET() {
  try {
    await connectDB()
    const courses = await Course.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: courses })
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new course
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const course = await Course.create({
      title: body.title,
      description: body.description,
      price: body.price,
      duration: body.duration,
      location: body.location,
      maxStudents: body.maxStudents || 10,
      currentStudents: body.currentStudents || 0,
      image: body.image,
      category: body.category || 'training',
      status: body.status || 'active',
    })

    return NextResponse.json({ success: true, data: course }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
