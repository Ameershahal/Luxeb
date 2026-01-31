import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ProductCategory from '@/lib/models/ProductCategory'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const category = await ProductCategory.findById(id)
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('Error fetching product category:', error)
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

    const category = await ProductCategory.findByIdAndUpdate(
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
    console.error('Error updating product category:', error)
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
    
    // Check if category is used by any products
    const Product = (await import('@/lib/models/Product')).default
    const productsUsingCategory = await Product.find({ category: id })
    
    if (productsUsingCategory.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category. It is used by ${productsUsingCategory.length} product(s). Please remove or reassign products first.` 
        },
        { status: 400 }
      )
    }

    const category = await ProductCategory.findByIdAndDelete(id)

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Category deleted' })
  } catch (error: any) {
    console.error('Error deleting product category:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
