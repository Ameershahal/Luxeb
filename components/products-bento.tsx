"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const products = [
  {
    id: 1,
    name: "Luxe Nail Serum",
    price: "$48",
    rating: 4.9,
    image: "/luxury-nail-serum-bottle-minimalist-gold-packaging.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "Silk Hair Elixir",
    price: "$72",
    rating: 4.8,
    image: "/premium-hair-oil-serum-elegant-dark-bottle.jpg",
    featured: false,
  },
  {
    id: 3,
    name: "Rose Cuticle Oil",
    price: "$32",
    rating: 5.0,
    image: "/cuticle-oil-dropper-bottle-rose-gold-minimalist.jpg",
    featured: false,
  },
  {
    id: 4,
    name: "Velvet Hand Cream",
    price: "$38",
    rating: 4.9,
    image: "/luxury-hand-cream-tube-elegant-packaging-cream.jpg",
    featured: false,
  },
  {
    id: 5,
    name: "Radiance Face Mist",
    price: "$56",
    rating: 4.7,
    image: "/facial-mist-spray-bottle-elegant-minimalist-gold.jpg",
    featured: true,
  },
]

export function ProductsBento() {
  const [headerRef, headerVisible] = useScrollReveal()

  return (
    <section className="py-24 lg:py-32 bg-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-16 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">Curated Collection</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground text-balance">
              Beauty <span className="italic">Essentials</span>
            </h2>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="rounded-full group bg-transparent">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => {
            const [cardRef, cardVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
            return (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              ref={cardRef}
              className={`group relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:shadow-xl interactive-card scroll-reveal ${
                cardVisible ? 'revealed' : ''
              } ${
                index === 0 ? "col-span-2 row-span-2" : ""
              } ${index === 4 ? "col-span-2" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className={`relative ${index === 0 ? "aspect-square" : "aspect-[4/5]"} lg:aspect-auto lg:h-auto flex items-center justify-center lg:block lg:overflow-visible`}>
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full lg:h-auto lg:w-full lg:block lg:relative object-cover lg:object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 bg-gradient-to-t from-card via-card/80 to-transparent">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs text-muted-foreground">{product.rating}</span>
                </div>
                <h3
                  className={`font-medium text-foreground ${index === 0 ? "text-xl lg:text-2xl" : "text-sm lg:text-base"}`}
                >
                  {product.name}
                </h3>
                <p className={`text-primary font-medium mt-1 ${index === 0 ? "text-lg" : "text-sm"}`}>
                  {product.price}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
