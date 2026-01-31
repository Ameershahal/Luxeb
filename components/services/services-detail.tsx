"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"

const serviceCategories = [
  {
    id: "nails",
    title: "Nail Artistry",
    description: "From classic elegance to avant-garde designs, our nail artists create miniature masterpieces.",
    image: "/elegant-manicure-nail-art-close-up-with-gold-and-d.jpg",
    services: [
      { name: "Classic Manicure", duration: "45 min", price: 45 },
      { name: "Gel Manicure", duration: "60 min", price: 65 },
      { name: "Luxury Spa Manicure", duration: "75 min", price: 85 },
      { name: "Nail Art Design", duration: "90 min", price: 120 },
      { name: "Classic Pedicure", duration: "45 min", price: 55 },
      { name: "Luxury Spa Pedicure", duration: "75 min", price: 95 },
      { name: "Gel Extensions", duration: "120 min", price: 150 },
      { name: "Nail Repair", duration: "30 min", price: 25 },
    ],
  },
  {
    id: "beauty",
    title: "Beauty Treatments",
    description: "Comprehensive beauty services designed to enhance your natural radiance and confidence.",
    image: "/luxury-facial-beauty-treatment-spa-elegant-woman.jpg",
    services: [
      { name: "Signature Facial", duration: "60 min", price: 125 },
      { name: "Hydrating Facial", duration: "75 min", price: 155 },
      { name: "Anti-Aging Facial", duration: "90 min", price: 195 },
      { name: "Classic Lash Extensions", duration: "90 min", price: 185 },
      { name: "Volume Lash Extensions", duration: "120 min", price: 245 },
      { name: "Lash Lift & Tint", duration: "60 min", price: 95 },
      { name: "Brow Styling", duration: "30 min", price: 55 },
      { name: "Bridal Makeup", duration: "90 min", price: 225 },
    ],
  },
]

export function ServicesDetail() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {serviceCategories.map((category, index) => (
          <div
            key={category.id}
            id={category.id}
            className={`grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start py-12 sm:py-16 lg:py-24 ${
              index !== 0 ? "border-t border-border" : ""
            }`}
          >
            {/* Image */}
            <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mb-3 sm:mb-4">{category.title}</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">{category.description}</p>

              {/* Services List */}
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
                    <span className="text-primary font-semibold text-sm sm:text-base flex-shrink-0">£{service.price}</span>
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
