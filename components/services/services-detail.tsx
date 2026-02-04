"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Loader2 } from "lucide-react"

type ServiceFromApi = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  description?: string
}

type CategoryGroup = {
  id: string
  title: string
  description: string
  image: string
  services: { name: string; duration: string; price: number }[]
}

// Optional: default images/descriptions for known categories (used when we have no DB description)
const categoryDefaults: Record<string, { description: string; image: string }> = {
  nails: {
    description: "From classic elegance to avant-garde designs, our nail artists create miniature masterpieces.",
    image: "/elegant-manicure-nail-art-close-up-with-gold-and-d.jpg",
  },
  beauty: {
    description: "Comprehensive beauty services designed to enhance your natural radiance and confidence.",
    image: "/luxury-facial-beauty-treatment-spa-elegant-woman.jpg",
  },
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}min` : `${h}h`
}

export function ServicesDetail() {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        setError(null)
        const res = await fetch("/api/services")
        const data = await res.json()

        if (!data.success || !data.services?.length) {
          setCategories([])
          return
        }

        const services = data.services as ServiceFromApi[]
        const byCategory = new Map<string, ServiceFromApi[]>()
        for (const s of services) {
          const cat = (s.category || "other").toLowerCase().replace(/\s+/g, "-")
          if (!byCategory.has(cat)) byCategory.set(cat, [])
          byCategory.get(cat)!.push(s)
        }

        const list: CategoryGroup[] = Array.from(byCategory.entries()).map(([id, items]) => {
          const defaults = categoryDefaults[id] || {
            description: `Our range of ${id.replace(/-/g, " ")} services.`,
            image: "/placeholder.svg",
          }
          return {
            id,
            title: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " "),
            description: defaults.description,
            image: defaults.image,
            services: items.map((s) => ({
              name: s.name,
              duration: typeof s.duration === "number" ? formatDuration(s.duration) : String(s.duration),
              price: s.price,
            })),
          }
        })

        setCategories(list)
      } catch (e) {
        console.error("Error fetching services:", e)
        setError("Unable to load services. Please try again later.")
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">{error}</p>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">No services available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <div
            key={category.id}
            id={category.id}
            className={`grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start py-12 sm:py-16 lg:py-24 ${
              index !== 0 ? "border-t border-border" : ""
            }`}
          >
            <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mb-3 sm:mb-4">
                {category.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                {category.description}
              </p>

              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {category.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between gap-3 py-2 sm:py-3 border-b border-border last:border-0"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium text-sm sm:text-base text-foreground">{service.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        {service.duration}
                      </p>
                    </div>
                    <span className="text-primary font-semibold text-sm sm:text-base flex-shrink-0">
                      £{service.price}
                    </span>
                  </div>
                ))}
              </div>

              <Link href={`/booking?service=${category.id}`} className="inline-block">
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 sm:px-6 group text-sm sm:text-base h-10 sm:h-11">
                  Book {category.title}
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
