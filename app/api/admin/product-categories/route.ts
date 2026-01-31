import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ProductCategory from '@/lib/models/ProductCategory'

export async function GET() {
  try {
    await connectDB()
    const categories = await ProductCategory.find({}).sort({ name: 1 })
    return NextResponse.json({ success: true, categories })
  } catch (error: any) {
    console.error('Error fetching product categories:', error)
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
    const { name, description, isActive } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const category = await ProductCategory.create({
      name,
      slug,
      description: description || '',
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product category:', error)
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
