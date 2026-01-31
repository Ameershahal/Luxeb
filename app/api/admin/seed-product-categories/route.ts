import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ProductCategory from '@/lib/models/ProductCategory'

const existingCategories = [
  {
    name: "Nails",
    description: "Nail care products and accessories",
    isActive: true,
  },
  {
    name: "Beauty",
    description: "Beauty and skincare products",
    isActive: true,
  },
  {
    name: "Hair",
    description: "Hair care products",
    isActive: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    let created = 0
    let skipped = 0

    for (const categoryData of existingCategories) {
      // Check if category already exists by name
      const existing = await ProductCategory.findOne({ name: categoryData.name })
      
      if (existing) {
        skipped++
        continue
      }

      // Generate slug from name
      const slug = categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      await ProductCategory.create({
        ...categoryData,
        slug,
      })
      created++
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      message: `Created ${created} categories, skipped ${skipped} existing ones`,
    })
  } catch (error: any) {
    console.error('Error seeding product categories:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
