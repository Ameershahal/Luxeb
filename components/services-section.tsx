"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

type ServiceFromApi = { id: string; name: string; category: string }

const serviceCards = [
  {
    title: "Manicure",
    description: "Exquisite manicures, intricate nail art, and luxurious treatments using premium products.",
    image: "/manicure.jpeg",
    categoryMatch: (cat: string) => /manicure/i.test(cat) || /nails/i.test(cat),
    categorySlug: "nails",
    href: "/booking?service=nails",
  },
  {
    title: "Pedicure",
    description: "Advanced Pedicure & Foot Health",
    image: "/pedicure.jpeg",
    categoryMatch: (cat: string) => /pedicure|foot|feet/i.test(cat),
    categorySlug: "pedicure",
    href: "/booking?service=pedicure",
  },
  {
    title: "Treatment",
    description: "Specialised treatments and premium care.",
    image: "/treatment.jpeg",
    categoryMatch: (cat: string) => /treatment|treatments|beauty/i.test(cat),
    categorySlug: "treatments",
    href: "/booking?service=treatments",
  },
]

export function ServicesSection() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, string[]>>({})

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.services?.length) return
        const list: ServiceFromApi[] = data.services
        const byCategory: Record<string, string[]> = {}
        serviceCards.forEach((card) => {
          const names = list
            .filter((s) => card.categoryMatch(s.category))
            .map((s) => s.name)
          byCategory[card.title] = names.length ? names : []
        })
        setServicesByCategory(byCategory)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">Our Services</p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((service, index) => {
            const [cardRef, cardVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
            const benefits = servicesByCategory[service.title] ?? []
            return (
            <div 
              key={service.title} 
              ref={cardRef}
              className={`group relative overflow-hidden rounded-2xl bg-card interactive-card scroll-reveal ${cardVisible ? 'revealed' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-secondary-foreground mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-foreground/80 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">{service.description}</p>

                {/* Real services from API - click to go to booking with that service preselect */}
                {benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 relative z-10">
                    {benefits.map((name) => (
                      <Link
                        key={name}
                        href={`/booking?service=${service.categorySlug}&preselect=${encodeURIComponent(name)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 cursor-pointer text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary-foreground/10 text-secondary-foreground/90 hover:bg-secondary-foreground/20 transition-colors"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                )}

                <Link href={service.href} className="block">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto rounded-full group/btn bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 text-xs sm:text-sm h-9 sm:h-10"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
