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
    title: "Hair Styling",
    description: "Sophisticated cuts, colors, and styling by master stylists who understand your vision.",
    image: "/professional-hair-styling-elegant-woman-salon-dark.jpg",
    benefits: ["Precision Cuts", "Balayage", "Keratin Treatment", "Bridal"],
    href: "/booking?service=hair",
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
    <section className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 lg:mb-20 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">Our Services</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground text-balance">
            Crafted for <span className="italic">Excellence</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <h3 className="font-serif text-2xl lg:text-3xl font-medium text-secondary-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-foreground/80 text-sm leading-relaxed mb-4">{service.description}</p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="text-xs px-3 py-1 rounded-full bg-secondary-foreground/10 text-secondary-foreground/90"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                <Link href={service.href}>
                  <Button
                    variant="secondary"
                    className="rounded-full group/btn bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
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
