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
