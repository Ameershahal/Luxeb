import { NextRequest, NextResponse } from "next/server"
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

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    const socialLinks = {
      instagram: typeof body?.instagram === "string" ? body.instagram.trim() : "",
      facebook: typeof body?.facebook === "string" ? body.facebook.trim() : "",
      tiktok: typeof body?.tiktok === "string" ? body.tiktok.trim() : "",
    }

    const settings = await Settings.findOneAndUpdate(
      { key: "global" },
      { $set: { socialLinks } },
      { upsert: true, new: true, runValidators: true },
    )

    return NextResponse.json({
      success: true,
      socialLinks: {
        instagram: settings.socialLinks?.instagram || "",
        facebook: settings.socialLinks?.facebook || "",
        tiktok: settings.socialLinks?.tiktok || "",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save settings" },
      { status: 500 },
    )
  }
}
