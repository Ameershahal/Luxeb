import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import {
  DEFAULT_ADMIN_PASSWORD,
  ensureGlobalSettings,
  hashPassword,
  verifyPassword,
} from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const currentPassword = String(body?.currentPassword || "")
    const newPassword = String(body?.newPassword || "")
    const confirmPassword = String(body?.confirmPassword || "")

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "All password fields are required" },
        { status: 400 },
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters" },
        { status: 400 },
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "New password and confirm password do not match" },
        { status: 400 },
      )
    }

    const settings = await ensureGlobalSettings()

    const currentValid = settings.adminPasswordHash
      ? verifyPassword(currentPassword, settings.adminPasswordHash)
      : currentPassword === DEFAULT_ADMIN_PASSWORD

    if (!currentValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 401 },
      )
    }

    settings.adminPasswordHash = hashPassword(newPassword)
    await settings.save()

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update password" },
      { status: 500 },
    )
  }
}
