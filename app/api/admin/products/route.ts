import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// GET - Fetch all products
export async function GET() {
  try {
    await connectDB()
    const products = await Product.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: products })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const product = await Product.create({
      name: body.name,
      price: body.price,
      originalPrice: body.originalPrice,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      image: body.image,
      images: body.images || [],
      category: body.category,
      description: body.description,
      benefits: body.benefits || [],
      ingredients: body.ingredients,
      howToUse: body.howToUse,
      inStock: body.inStock !== undefined ? body.inStock : true,
      featured: body.featured || false,
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
