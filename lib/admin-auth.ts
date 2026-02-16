import { randomBytes, scryptSync, timingSafeEqual } from "crypto"
import Settings from "@/lib/models/Settings"

export const DEFAULT_ADMIN_EMAIL = "admin@luxebeauty.com"
export const DEFAULT_ADMIN_PASSWORD = "admin123"

export function normalizeEmail(email: string): string {
  return String(email || "").trim().toLowerCase()
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) return false
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false

  const hashBuffer = Buffer.from(hash, "hex")
  const testBuffer = scryptSync(password, salt, 64)
  if (hashBuffer.length !== testBuffer.length) return false
  return timingSafeEqual(hashBuffer, testBuffer)
}

export async function ensureGlobalSettings() {
  const existing = await Settings.findOne({ key: "global" })
  if (existing) {
    return existing
  }

  return Settings.create({
    key: "global",
    adminEmail: DEFAULT_ADMIN_EMAIL,
    adminPasswordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    socialLinks: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
  })
}
