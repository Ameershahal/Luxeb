import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'

export async function GET() {
  try {
    await connectDB()
    const courses = await Course.find({}).sort({ createdAt: -1 })
    const list = courses.map((c: any) => {
      // Ensure startDates is always an array, handle null/undefined
      let startDates: string[] = []
      if (c.startDates) {
        if (Array.isArray(c.startDates)) {
          startDates = c.startDates.filter((d: any) => d && String(d).trim())
        } else if (typeof c.startDates === 'string') {
          startDates = [c.startDates]
        }
      }
      
      return {
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
        startDates: startDates,
      }
    })
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
      startDates,
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

    // Sanitize and validate startDates - filter out empty strings
    let sanitizedStartDates: string[] = []
    if (Array.isArray(startDates) && startDates.length > 0) {
      sanitizedStartDates = startDates
        .filter((d: unknown) => {
          if (typeof d !== 'string') return false
          const trimmed = d.trim()
          return trimmed !== '' && trimmed.length > 0
        })
        .map((d: string) => d.trim())
    }

    const courseData: any = {
      title,
      description: description || '',
      price: Number(price),
      duration: duration || '',
      location: location || '',
      students,
      image: image || '',
      featured: !!featured,
      isActive: true,
    }

    // Only set startDates if we have valid dates (don't set empty array)
    if (sanitizedStartDates.length > 0) {
      courseData.startDates = sanitizedStartDates
    }

    const course = await Course.create(courseData)

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
      startDates: Array.isArray(course.startDates) ? course.startDates : [],
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
