"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type GalleryItem = {
  id: number
  image: string
  category: string
  title: string
  description: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "/after-luxury-nail-art-gold-dark-red-elegant-manicu.jpg",
    category: "nails",
    title: "Gold & Burgundy Elegance",
    description: "Intricate gold leaf design on a deep burgundy base",
  },
  {
    id: 2,
    image: "/gallery-nail-art-minimalist-french-gold.jpg",
    category: "nails",
    title: "Modern French",
    description: "Minimalist French tips with gold accents",
  },
  {
    id: 3,
    image: "/gallery-makeup-bridal-natural-glow.jpg",
    category: "beauty",
    title: "Bridal Radiance",
    description: "Natural, luminous bridal makeup look",
  },
  {
    id: 4,
    image: "/gallery-nail-art-geometric-black-gold.jpg",
    category: "nails",
    title: "Geometric Luxe",
    description: "Bold geometric patterns in black and gold",
  },
  {
    id: 5,
    image: "/gallery-lash-extensions-volume.jpg",
    category: "beauty",
    title: "Volume Lashes",
    description: "Full, fluttery volume lash extensions",
  },
  {
    id: 6,
    image: "/gallery-nail-art-marble-rose-gold.jpg",
    category: "nails",
    title: "Rose Gold Marble",
    description: "Delicate marble effect with rose gold veining",
  },
  {
    id: 7,
    image: "/gallery-brow-styling-lamination.jpg",
    category: "beauty",
    title: "Brow Lamination",
    description: "Perfectly styled and laminated brows",
  },
  {
    id: 12,
    image: "/gallery-nail-art-floral-delicate.jpg",
    category: "nails",
    title: "Botanical Art",
    description: "Hand-painted delicate floral designs",
  },
]

const categories = [
  { id: "all", name: "All Work" },
  { id: "nails", name: "Nail Art" },
  { id: "beauty", name: "Beauty" },
]

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const filteredItems =
    activeCategory === "all" ? galleryItems : galleryItems.filter((i) => i.category === activeCategory)

  const currentIndex = selectedImage !== null ? filteredItems.findIndex((i) => i.id === selectedImage) : -1
  const currentItem = selectedImage !== null ? filteredItems.find((i) => i.id === selectedImage) : null

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1].id)
    }
  }

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1].id)
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredItems.map((item, index) => (
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
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs uppercase tracking-wider text-secondary-foreground/70 mb-1">{item.category}</p>
                  <h3 className="font-medium text-secondary-foreground">{item.title}</h3>
                </div>
              </div>
            </button>
          ))}
        </div>
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
            disabled={currentIndex === filteredItems.length - 1}
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
              <p className="text-xs uppercase tracking-wider text-secondary-foreground/70 mb-1">
                {currentItem.category}
              </p>
              <h3 className="font-serif text-xl font-medium text-secondary-foreground">{currentItem.title}</h3>
              <p className="text-secondary-foreground/70 mt-1">{currentItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
