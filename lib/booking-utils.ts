/** Match URL slug (e.g. from home page links) to API category value. */
export function categoryMatchesSlug(category: string, slug: string): boolean {
  const cat = category.trim().toLowerCase()
  const s = slug.trim().toLowerCase()
  if (s === "nails") return cat === "nails" || /manicure/i.test(cat)
  if (s === "pedicure") return /pedicure|foot|feet/i.test(cat)
  if (s === "treatments") return /treatments|treatment|beauty/i.test(cat)
  return cat === s
}

type ApiService = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  sizes?: { size: string; price: number }[]
  subServices?: { name: string; price: number }[]
}

export type ResolvedPreselectEntry = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  size?: string
  subServiceName?: string
}

/** Resolve preselect param to a booking entry from API services. Returns null if not found. */
export function resolvePreselect(
  services: ApiService[],
  categorySlug: string,
  preselectName: string
): ResolvedPreselectEntry | null {
  let decoded: string
  try {
    decoded = decodeURIComponent(preselectName)
  } catch {
    return null
  }
  const filtered = services.filter((s) => categoryMatchesSlug(s.category, categorySlug))
  const match = filtered.find(
    (s) => s.name.trim().toLowerCase() === decoded.trim().toLowerCase()
  )
  if (!match) return null
  const hasSubs = match.subServices && match.subServices.length > 0
  if (hasSubs) {
    const first = match.subServices![0]
    return {
      id: match.id,
      name: `${match.name} - ${first.name}`,
      category: match.category,
      duration: match.duration,
      price: first.price,
      subServiceName: first.name,
    }
  }
  const hasSizes = match.sizes && match.sizes.length > 0
  const size = hasSizes ? match.sizes![0].size : undefined
  const sizeOption = hasSizes && size ? match.sizes!.find((s) => s.size === size) : null
  const price = sizeOption ? sizeOption.price : match.price
  return {
    id: match.id,
    name: match.name,
    category: match.category,
    duration: match.duration,
    price,
    ...(size && { size }),
  }
}

export const SALON_TIMEZONE = 'Europe/London'

/** YYYY-MM-DD in salon timezone */
export function toDateKey(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: SALON_TIMEZONE })
}

/** Build YYYY-MM-DD from local calendar parts (date picker selection) */
export function toDateKeyFromLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function normalizeTimeSlot(time: string): string {
  const trimmed = time.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return trimmed
  return `${parseInt(match[1], 10)}:${match[2]} ${match[3].toUpperCase()}`
}

export function convertTo24Hour(time12h: string): string {
  const [time, period] = time12h.split(' ')
  const [hours, minutes] = time.split(':')
  let hour24 = parseInt(hours, 10)
  if (period === 'PM' && hour24 !== 12) hour24 += 12
  if (period === 'AM' && hour24 === 12) hour24 = 0
  return `${hour24.toString().padStart(2, '0')}:${minutes}`
}
