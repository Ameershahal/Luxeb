"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const transformations = [
  {
    id: 1,
    before: "/before-nail-treatment-plain-nails-close-up.jpg",
    after: "/after-luxury-nail-art-gold-dark-red-elegant-manicu.jpg",
    category: "Nail Art",
  },
  {
    id: 2,
    before: "/before-simple-nails-no-polish.jpg",
    after: "/placeholder.svg?height=600&width=500",
    category: "Classic Manicure",
  },
  {
    id: 4,
    before: "/placeholder.svg?height=600&width=500",
    after: "/placeholder.svg?height=600&width=500",
    category: "Brow Styling",
  },
]

export function TransformationGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  const next = () => setCurrentIndex((prev) => (prev + 1) % transformations.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length)

  const current = transformations[currentIndex]

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">Transformations</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground text-balance">
            The Art of <span className="italic">Before & After</span>
          </h2>
        </div>

        {/* Before/After Slider */}
        <div className="relative mx-auto max-w-4xl">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            {/* After Image (Background) */}
            <img
              src={current.after || "/placeholder.svg"}
              alt="After transformation"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={current.before || "/placeholder.svg"}
                alt="Before transformation"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Slider Handle */}
            <div className="absolute inset-y-0 flex items-center" style={{ left: `${sliderPosition}%` }}>
              <div className="relative h-full w-1 bg-primary-foreground/80 shadow-lg">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-foreground shadow-lg flex items-center justify-center">
                  <ChevronLeft className="h-4 w-4 text-secondary absolute -left-1" />
                  <ChevronRight className="h-4 w-4 text-secondary absolute -right-1" />
                </div>
              </div>
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
              aria-label="Before and after comparison slider"
            />

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-sm text-secondary-foreground text-sm font-medium">
              Before
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-primary-foreground text-sm font-medium">
              After
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-sm font-medium">
              {current.category}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full bg-transparent"
              aria-label="Previous transformation"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {transformations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                  aria-label={`Go to transformation ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full bg-transparent"
              aria-label="Next transformation"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
