"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type GalleryItem = {
  id: string
  image: string
  category: string
  title: string
  description: string
}

export function GalleryGrid() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery")
        const data = await res.json()
        if (data.success && Array.isArray(data.galleryItems)) {
          setGalleryItems(
            data.galleryItems.map((item: any) => ({
              id: item.id || item._id,
              image: item.image || "",
              category: item.category || "nails",
              title: item.title || "",
              description: item.description || "",
            }))
          )
        }
      } catch (err) {
        console.error("Failed to load gallery", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const currentIndex = selectedImage !== null ? galleryItems.findIndex((i) => i.id === selectedImage) : -1
  const currentItem = selectedImage !== null ? galleryItems.find((i) => i.id === selectedImage) : null

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(galleryItems[currentIndex - 1].id)
    }
  }

  const goToNext = () => {
    if (currentIndex < galleryItems.length - 1) {
      setSelectedImage(galleryItems[currentIndex + 1].id)
    }
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-3">Our Portfolio</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground text-balance">
            Beauty <span className="italic">Gallery</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of transformations and artistic creations by our talented team.
          </p>
        </div>

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : galleryItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No gallery images yet.</p>
        ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedImage(item.id)}
              className="group relative overflow-hidden rounded-xl w-full break-inside-avoid mb-4"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className={cn(
                  "w-full object-cover transition-transform duration-500 group-hover:scale-105",
                  index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4" />
              </div>
            </button>
          ))}
        </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && currentItem && (
        <div
          className="fixed inset-0 z-50 bg-secondary/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center text-secondary-foreground hover:bg-secondary-foreground/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            disabled={currentIndex === 0}
            className="absolute left-4 h-12 w-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center text-secondary-foreground hover:bg-secondary-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            disabled={currentIndex === galleryItems.length - 1}
            className="absolute right-4 h-12 w-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center text-secondary-foreground hover:bg-secondary-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image & Info */}
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentItem.image || "/placeholder.svg"}
              alt={currentItem.title}
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-center">
              <p className="text-secondary-foreground/70 mt-1">{currentItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
