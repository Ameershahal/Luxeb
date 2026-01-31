import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Gallery from '@/lib/models/Gallery'

const existingGalleryItems = [
  {
    image: "/after-luxury-nail-art-gold-dark-red-elegant-manicu.jpg",
    category: "nails" as const,
    title: "Gold & Burgundy Elegance",
    description: "Intricate gold leaf design on a deep burgundy base",
    isActive: true,
  },
  {
    image: "/gallery-nail-art-minimalist-french-gold.jpg",
    category: "nails" as const,
    title: "Modern French",
    description: "Minimalist French tips with gold accents",
    isActive: true,
  },
  {
    image: "/gallery-makeup-bridal-natural-glow.jpg",
    category: "beauty" as const,
    title: "Bridal Radiance",
    description: "Natural, luminous bridal makeup look",
    isActive: true,
  },
  {
    image: "/gallery-nail-art-geometric-black-gold.jpg",
    category: "nails" as const,
    title: "Geometric Luxe",
    description: "Bold geometric patterns in black and gold",
    isActive: true,
  },
  {
    image: "/gallery-lash-extensions-volume.jpg",
    category: "beauty" as const,
    title: "Volume Lashes",
    description: "Full, fluttery volume lash extensions",
    isActive: true,
  },
  {
    image: "/gallery-nail-art-marble-rose-gold.jpg",
    category: "nails" as const,
    title: "Rose Gold Marble",
    description: "Delicate marble effect with rose gold veining",
    isActive: true,
  },
  {
    image: "/gallery-brow-styling-lamination.jpg",
    category: "beauty" as const,
    title: "Brow Lamination",
    description: "Perfectly styled and laminated brows",
    isActive: true,
  },
  {
    image: "/gallery-nail-art-floral-delicate.jpg",
    category: "nails" as const,
    title: "Botanical Art",
    description: "Hand-painted delicate floral designs",
    isActive: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    let created = 0
    let skipped = 0

    for (const itemData of existingGalleryItems) {
      // Check if item already exists by image URL
      const existing = await Gallery.findOne({ image: itemData.image })
      
      if (existing) {
        skipped++
        continue
      }

      await Gallery.create(itemData)
      created++
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      message: `Created ${created} gallery items, skipped ${skipped} existing ones`,
    })
  } catch (error: any) {
    console.error('Error seeding gallery items:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
