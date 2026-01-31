import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Stylist from '@/lib/models/Stylist'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive') !== 'false'

    const query: any = { isActive }
    if (category && category !== 'all') {
      query.$or = [
        { specialty: category },
        { specialty: 'all' },
      ]
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
