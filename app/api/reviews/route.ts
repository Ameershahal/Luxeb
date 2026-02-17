import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Review from "@/lib/models/Review"

export async function GET() {
  try {
    await connectDB()
    const reviews = await Review.find({ isActive: true }).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, reviews })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 },
    )
  }
}
