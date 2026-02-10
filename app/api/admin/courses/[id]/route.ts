import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
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
      isActive,
      startDates,
    } = body

    const update: Record<string, unknown> = {}

    if (title !== undefined) update.title = title
    if (description !== undefined) update.description = description
    if (price !== undefined && price !== '') update.price = Number(price)
    if (duration !== undefined) update.duration = duration
    if (location !== undefined) update.location = location
    if (image !== undefined) update.image = image
    if (featured !== undefined) update.featured = !!featured
    if (isActive !== undefined) update.isActive = !!isActive

    if (maxStudents !== undefined) {
      update.students =
        maxStudents != null && maxStudents !== ''
          ? `Max ${maxStudents} students`
          : ''
    }

    if (startDates !== undefined) {
      if (Array.isArray(startDates)) {
        const sanitized = startDates.filter((d: unknown) => typeof d === 'string' && String(d).trim()).map((d: string) => String(d).trim())
        // Always set startDates, even if empty array (to clear existing dates)
        update.startDates = sanitized
      } else {
        // If not an array, set to empty array
        update.startDates = []
      }
    }

    const course = await Course.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      course: {
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
      },
    })
  } catch (error: any) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
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
    const course = await Course.findByIdAndDelete(id)

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, message: 'Course deleted' })
  } catch (error: any) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}

