import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Review from "@/lib/models/Review"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    const review = await Review.findByIdAndDelete(id)
    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: "Review deleted" })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete review" },
      { status: 500 },
    )
  }
}
