import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { products } from '@/lib/products'

// POST - Seed products from hardcoded data
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Check if products already exist
    const existingProducts = await Product.countDocuments()
    if (existingProducts > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already contains ${existingProducts} products. Use DELETE to clear first.`,
      })
    }

    // Convert hardcoded products to MongoDB format
    const productsToSeed = products.map((product) => ({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      images: product.images,
      category: product.category,
      description: product.description,
      benefits: product.benefits,
      ingredients: product.ingredients,
      howToUse: product.howToUse,
      inStock: product.inStock,
      featured: product.featured,
    }))

    // Insert products
    const insertedProducts = await Product.insertMany(productsToSeed)

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products`,
      count: insertedProducts.length,
    })
  } catch (error: any) {
    console.error('Error seeding products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Clear all products (for testing/resetting)
export async function DELETE() {
  try {
    await connectDB()
    const result = await Product.deleteMany({})
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} products`,
      deletedCount: result.deletedCount,
    })
  } catch (error: any) {
    console.error('Error clearing products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
