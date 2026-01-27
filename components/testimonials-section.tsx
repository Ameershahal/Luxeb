"use client"

import { useState } from "react"
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
    name: "Victoria S.",
    location: "Los Angeles",
    image: "/victoria-s.png",
    rating: 5,
    text: "The hair styling team here truly understands the balance between classic elegance and modern trends. I've been coming here for two years and refuse to go anywhere else.",
    service: "Hair Styling",
  },
  {
    id: 3,
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

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-12 lg:mb-16 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">Client Stories</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground text-balance">
            Words of <span className="italic">Appreciation</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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

        {/* Navigation (Mobile) */}
        <div className="flex items-center justify-center gap-4 mt-8 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="rounded-full bg-transparent transition-all duration-300 hover:scale-110 hover:bg-primary/10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="rounded-full bg-transparent transition-all duration-300 hover:scale-110 hover:bg-primary/10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
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
      className={`p-6 lg:p-8 rounded-2xl bg-card border border-border transition-all duration-300 interactive-card scroll-reveal ${
        cardVisible ? 'revealed' : ''
      } ${
        isActive ? "md:scale-105 md:shadow-xl" : "md:opacity-70"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={onMouseEnter}
    >
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground/80 leading-relaxed mb-6">"{testimonial.text}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <img
          src={testimonial.image || "/placeholder.svg"}
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover transition-transform duration-300 hover:scale-110 hover:ring-2 hover:ring-primary/50"
        />
        <div>
          <p className="font-medium text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>

      {/* Service Badge */}
      <div className="mt-4 pt-4 border-t border-border">
        <span className="text-xs text-primary font-medium uppercase tracking-wider">{testimonial.service}</span>
      </div>
    </div>
  )
}
