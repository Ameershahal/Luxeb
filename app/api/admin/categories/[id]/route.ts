import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/lib/models/Category'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const category = await Category.findById(id)
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('Error fetching category:', error)
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
    const { name, description, isActive } = body

    const updateData: any = {}
    if (name) {
      updateData.name = name
      // Regenerate slug if name changes
      updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
    if (description !== undefined) updateData.description = description
    if (isActive !== undefined) updateData.isActive = isActive

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('Error updating category:', error)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      )
    }
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
    
    // Check if category is used by any services
    const Service = (await import('@/lib/models/Service')).default
    const servicesUsingCategory = await Service.find({ category: id })
    
    if (servicesUsingCategory.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category. It is used by ${servicesUsingCategory.length} service(s). Please remove or reassign services first.` 
        },
        { status: 400 }
      )
    }

    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Category deleted' })
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
