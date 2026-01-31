"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const testimonials = [
  {
    id: 1,
    name: "Alexandra M.",
    location: "New York",
    image: "/alexandra-m.png",
    rating: 5,
    text: "Luxe Beauty & Training has transformed my self-care routine. The attention to detail is extraordinary—from the moment you walk in, you're treated like royalty. My nails have never looked better.",
    service: "Nail Artistry",
  },
  {
    id: 2,
    name: "Catherine R.",
    location: "Miami",
    image: "/catherine-r.png",
    rating: 5,
    text: "An oasis of luxury in the city. The products they use are exceptional, and the results speak for themselves. This is the only place I trust for special occasions.",
    service: "Beauty Treatments",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [headerRef, headerVisible] = useScrollReveal()
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const next = () => {
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % testimonials.length
      return nextIndex
    })
  }
  
  const prev = () => {
    setCurrentIndex((prev) => {
      const prevIndex = (prev - 1 + testimonials.length) % testimonials.length
      return prevIndex
    })
  }

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      next()
    } else if (distance < -minSwipeDistance) {
      prev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-2 sm:mb-3 md:mb-4">Client Stories</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground text-balance px-2">
            Words of <span className="italic">Appreciation</span>
          </h2>
        </div>

        {/* Mobile Carousel - Show only active testimonial */}
        <div className="md:hidden space-y-6">
          <div 
            ref={carouselRef}
            className="relative w-full overflow-hidden rounded-xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out will-change-transform"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0"
                  style={{ minWidth: '100%' }}
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    index={index}
                    isActive={true}
                    onMouseEnter={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 px-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                prev()
              }}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-card border-2 border-foreground/30 hover:border-primary active:border-primary shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 hover:scale-105 hover:bg-primary/10 flex items-center justify-center touch-manipulation z-10 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>

            <div className="flex gap-2 items-center px-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`h-2.5 rounded-full transition-all touch-manipulation cursor-pointer ${
                    index === currentIndex ? "w-10 bg-primary" : "w-2.5 bg-border hover:bg-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : "false"}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                next()
              }}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-card border-2 border-foreground/30 hover:border-primary active:border-primary shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 hover:scale-105 hover:bg-primary/10 flex items-center justify-center touch-manipulation z-10 cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
          </div>
        </div>

        {/* Desktop Grid - Show all testimonials */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              isActive={index === currentIndex}
              onMouseEnter={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Separate component to use hooks properly
function TestimonialCard({ 
  testimonial, 
  index, 
  isActive, 
  onMouseEnter 
}: { 
  testimonial: typeof testimonials[0]
  index: number
  isActive: boolean
  onMouseEnter: () => void
}) {
  const [cardRef, cardVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })

  return (
    <div
      ref={cardRef}
      className={`p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-card border border-border transition-all duration-300 scroll-reveal ${
        cardVisible ? 'revealed' : ''
      } ${
        isActive ? "md:scale-105 md:shadow-xl" : "md:opacity-70"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={onMouseEnter}
    >
      {/* Rating */}
      <div className="flex gap-1 mb-3 sm:mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 sm:h-4 sm:w-4 fill-accent text-accent" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-base sm:text-base lg:text-lg text-foreground/80 leading-relaxed mb-5 sm:mb-6">"{testimonial.text}"</p>

      {/* Author */}
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={testimonial.image || "/placeholder.svg"}
          alt={testimonial.name}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:ring-2 hover:ring-primary/50"
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm sm:text-base text-foreground">{testimonial.name}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>

      {/* Service Badge */}
      <div className="mt-4 sm:mt-5 pt-4 border-t border-border">
        <span className="text-[10px] sm:text-xs text-primary font-medium uppercase tracking-wider">{testimonial.service}</span>
      </div>
    </div>
  )
}
