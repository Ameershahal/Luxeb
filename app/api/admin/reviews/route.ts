import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Review from "@/lib/models/Review"

export async function GET() {
  try {
    await connectDB()
    const reviews = await Review.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, reviews })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, location, image, rating, text, service, isActive } = body

    if (!name || !text || rating === undefined || rating === null || rating === "") {
      return NextResponse.json(
        { success: false, error: "Name, review text and rating are required" },
        { status: 400 },
      )
    }

    const parsedRating = Number(rating)
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 },
      )
    }

    const review = await Review.create({
      name: String(name).trim(),
      location: String(location || "").trim(),
      image: String(image || "").trim(),
      rating: parsedRating,
      text: String(text).trim(),
      service: String(service || "").trim(),
      isActive: isActive !== false,
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create review" },
      { status: 500 },
    )
  }
}
