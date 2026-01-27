/**
 * Migration script to import existing products from lib/products.ts to MongoDB
 * 
 * Run this script once to migrate your existing products to the database:
 * npx tsx scripts/migrate-products.ts
 * 
 * Or use Node.js:
 * node -r ts-node/register scripts/migrate-products.ts
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import { products } from '../lib/products'

async function migrateProducts() {
  try {
    console.log('Connecting to MongoDB...')
    await connectDB()
    console.log('Connected to MongoDB!')

    console.log(`\nMigrating ${products.length} products...`)

    let created = 0
    let skipped = 0

    for (const product of products) {
      // Check if product already exists
      const existing = await Product.findOne({ name: product.name })
      
      if (existing) {
        console.log(`⏭️  Skipped: ${product.name} (already exists)`)
        skipped++
        continue
      }

      // Create product in database
      await Product.create({
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
      })

      console.log(`✅ Created: ${product.name}`)
      created++
    }

    console.log(`\n✅ Migration complete!`)
    console.log(`   Created: ${created} products`)
    console.log(`   Skipped: ${skipped} products`)
    console.log(`   Total: ${products.length} products`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateProducts()
