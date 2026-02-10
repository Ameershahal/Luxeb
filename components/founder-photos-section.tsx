"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// Add your founder photos here - update these paths with actual images
const founderPhotos = [
  {
    id: 1,
    src: "/founder2.jpeg",
    alt: "Ioana Andreiana - Founder of Luxe Beauty & Training",
    caption: "Ioana Andreiana, Founder & Creative Director",
  },
  {
    id: 2,
    src: "/founder3.jpeg",
    alt: "Ioana Andreiana at work",
    caption: "Creating beauty with passion",
  },
  {
    id: 3,
    src: "/founder4.jpeg",
    alt: "Ioana Andreiana - Professional portrait",
    caption: "The art of beauty and excellence",
  },
  {
    id: 4,
    src: "/founder-4.jpg", // Add your photos here
    alt: "Ioana Andreiana in studio",
    caption: "Our beautiful studio space",
  },
]

export function FounderPhotosSection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [headerRef, headerVisible] = useScrollReveal()

  // Filter out photos that don't exist (placeholder handling)
  const availablePhotos = founderPhotos.filter((photo) => {
    // Show all founder photos (founder2.jpeg, founder3.jpeg, founder4.jpeg, founder.jpeg)
    // Filter out placeholder images
    return photo.src === "/founder2.jpeg" || 
           photo.src === "/founder3.jpeg" || 
           photo.src === "/founder4.jpeg" ||
           photo.src === "/founder.jpeg" ||
           (photo.src !== "/founder-2.jpg" && photo.src !== "/founder-3.jpg" && photo.src !== "/founder-4.jpg")
  })

  const currentIndex = selectedImage !== null ? availablePhotos.findIndex((p) => p.id === selectedImage) : -1

  const goToPrevious = () => {
    if (selectedImage !== null && currentIndex > 0) {
      setSelectedImage(availablePhotos[currentIndex - 1].id)
    }
  }

  const goToNext = () => {
    if (selectedImage !== null && currentIndex < availablePhotos.length - 1) {
      setSelectedImage(availablePhotos[currentIndex + 1].id)
    }
  }

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div
            ref={headerRef}
            className={`text-center mb-10 sm:mb-12 lg:mb-16 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
          >
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-3 sm:mb-4">
              Meet the Founder
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground text-balance">
              The Vision Behind Luxe Beauty & Training Academy
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Get to know Ioana Andreiana, the creative force behind our luxury beauty studio
            </p>
          </div>

          {/* Photo Grid */}
          {availablePhotos.length > 0 ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl">
              {availablePhotos.map((photo, index) => {
                const [cardRef, cardVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
                return (
                  <div
                    key={photo.id}
                    ref={cardRef}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card cursor-pointer interactive-card scroll-reveal ${
                      cardVisible ? 'revealed' : ''
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedImage(photo.id)}
                  >
                    <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Founder photos coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation */}
          {availablePhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                disabled={currentIndex === 0}
                className="absolute left-4 h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                disabled={currentIndex === availablePhotos.length - 1}
                className="absolute right-4 h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {availablePhotos[currentIndex] && (
              <div className="relative">
                <img
                  src={availablePhotos[currentIndex].src}
                  alt={availablePhotos[currentIndex].alt}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm sm:text-base text-foreground/80">{availablePhotos[currentIndex].caption}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
