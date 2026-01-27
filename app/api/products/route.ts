import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// GET all products
export async function GET(request: NextRequest) {
  try {
    // Check MongoDB connection first
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MongoDB URI not configured',
          message: 'Please set MONGODB_URI in environment variables'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Connect to MongoDB
    try {
      await connectDB()
    } catch (connectionError: any) {
      console.error('MongoDB connection error:', connectionError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          message: connectionError.message || 'Unable to connect to MongoDB. Please check your connection string.',
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }
    
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    
    const query: any = {}
    if (category && category !== 'all') {
      query.category = category
    }
    if (featured === 'true') {
      query.featured = true
    }
    
    // Fetch products from database
    let products
    try {
      products = await Product.find(query).sort({ createdAt: -1 })
    } catch (queryError: any) {
      console.error('Error querying products:', queryError)
      throw new Error(`Database query failed: ${queryError.message}`)
    }
    
    // Convert MongoDB documents to plain objects with string IDs
    const productsWithIds = products.map((product: any) => {
      // Handle both Mongoose documents and plain objects
      const productObj = product.toObject ? product.toObject() : product
      return {
        _id: productObj._id?.toString() || productObj._id,
        name: productObj.name,
        price: productObj.price,
        originalPrice: productObj.originalPrice,
        rating: productObj.rating || 0,
        reviews: productObj.reviews || 0,
        image: productObj.image,
        images: productObj.images || [],
        category: productObj.category,
        description: productObj.description,
        benefits: productObj.benefits || [],
        ingredients: productObj.ingredients,
        howToUse: productObj.howToUse,
        inStock: productObj.inStock !== undefined ? productObj.inStock : true,
        featured: productObj.featured || false,
        createdAt: productObj.createdAt,
        updatedAt: productObj.updatedAt,
      }
    })
    
    return NextResponse.json({ success: true, products: productsWithIds })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    if (error.stack) {
      console.error('Error stack:', error.stack)
    }
    
    // Return error response - ensure it's always valid JSON
    const errorMessage = error?.message || 'Failed to fetch products'
    const errorName = error?.name || 'UnknownError'
    
    // Build a safe error response that will always serialize
    const errorResponse = {
      success: false,
      error: errorMessage,
      message: errorMessage,
    }
    
    console.error('Products API Error:', {
      name: errorName,
      message: errorMessage,
      mongoUriSet: !!process.env.MONGODB_URI,
    })
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const {
      name,
      price,
      originalPrice,
      image,
      images,
      category,
      description,
      benefits,
      ingredients,
      howToUse,
      inStock,
      featured,
    } = body
    
    // Validation
    if (!name || !price || !image || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const product = await Product.create({
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      rating: 0,
      reviews: 0,
      image,
      images: images || [image],
      category,
      description,
      benefits: benefits || [],
      ingredients,
      howToUse,
      inStock: inStock !== undefined ? inStock : true,
      featured: featured || false,
    })
    
    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}
