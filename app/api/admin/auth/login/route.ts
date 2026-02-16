import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  ensureGlobalSettings,
  hashPassword,
  normalizeEmail,
  verifyPassword,
} from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const email = normalizeEmail(body?.email || "")
    const password = String(body?.password || "")

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      )
    }

    const settings = await ensureGlobalSettings()
    const adminEmail = normalizeEmail(settings.adminEmail || DEFAULT_ADMIN_EMAIL)

    let validPassword = false
    if (settings.adminPasswordHash) {
      validPassword = verifyPassword(password, settings.adminPasswordHash)
    } else {
      // Backward compatibility for old installs without stored hash.
      validPassword = email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD
      if (validPassword) {
        settings.adminPasswordHash = hashPassword(DEFAULT_ADMIN_PASSWORD)
        settings.adminEmail = DEFAULT_ADMIN_EMAIL
        await settings.save()
      }
    }

    if (email !== adminEmail || !validPassword) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Login failed" },
      { status: 500 },
    )
  }
}
