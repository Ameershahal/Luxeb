import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Settings from "@/lib/models/Settings"

export async function GET() {
  try {
    await connectDB()
    const settings = await Settings.findOne({ key: "global" })

    return NextResponse.json({
      success: true,
      socialLinks: {
        instagram: settings?.socialLinks?.instagram || "",
        facebook: settings?.socialLinks?.facebook || "",
        tiktok: settings?.socialLinks?.tiktok || "",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 },
    )
  }
}
