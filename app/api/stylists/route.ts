import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Stylist from '@/lib/models/Stylist'
import Category from '@/lib/models/Category'

function getCategoryMatchers(category: string) {
  const c = category.trim().toLowerCase()
  if (!c || c === 'all') return []

  if (c === 'nails' || c === 'manicure') {
    return [/^all$/i, /nails/i, /manicure/i]
  }

  if (c === 'pedicure') {
    return [/^all$/i, /pedicure/i, /foot/i, /feet/i]
  }

  if (c === 'treatments' || c === 'treatment') {
    return [/^all$/i, /treatments?/i, /beauty/i]
  }

  return [/^all$/i, new RegExp(`^${c}$`, 'i')]
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive') !== 'false'

    const query: any = { isActive }
    if (category && category !== 'all') {
      // Prefer explicit category->stylist assignment from admin.
      const normalized = category.trim().toLowerCase()
      const assignedCategory = await Category.findOne({
        $or: [{ slug: normalized }, { name: new RegExp(`^${normalized}$`, 'i') }],
      })

      const assignedStylistIds = Array.isArray(assignedCategory?.stylistIds)
        ? assignedCategory.stylistIds.filter(Boolean)
        : []

      if (assignedStylistIds.length > 0) {
        query._id = { $in: assignedStylistIds }
      } else {
        // Backward-compatible fallback to specialty matching.
        const matchers = getCategoryMatchers(category)
        query.$or = matchers.map((regex) => ({ specialty: regex }))
      }
    }

    const stylists = await Stylist.find(query).sort({ rating: -1 })
    
    return NextResponse.json({ success: true, stylists })
  } catch (error: any) {
    console.error('Error fetching stylists:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
