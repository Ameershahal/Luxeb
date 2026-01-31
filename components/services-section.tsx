"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const services = [
  {
    title: "Nail Artistry",
    description: "Exquisite manicures, intricate nail art, and luxurious treatments using premium products.",
    image: "/elegant-manicure-nail-art-close-up-with-gold-and-d.jpg",
    benefits: ["Gel & Shellac", "Nail Art", "Spa Manicure", "Extensions"],
    href: "/booking?service=nails",
  },
  {
    title: "Beauty Treatments",
    description: "Comprehensive beauty services designed to enhance your natural radiance.",
    image: "/luxury-facial-beauty-treatment-spa-elegant-woman.jpg",
    benefits: ["Facials", "Lash Extensions", "Brow Styling", "Makeup"],
    href: "/booking?service=beauty",
  },
]

export function ServicesSection() {
  const [headerRef, headerVisible] = useScrollReveal()

  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-3 sm:mb-4">Our Services</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground text-balance">
            Crafted for <span className="italic">Excellence</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => {
            const [cardRef, cardVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
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

                {/* Benefits */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {service.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary-foreground/10 text-secondary-foreground/90"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

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
