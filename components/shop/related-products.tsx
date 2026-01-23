"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import type { Product } from "@/lib/products"

type RelatedProductsProps = {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-16 lg:py-20 bg-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="font-serif text-2xl lg:text-3xl font-medium text-foreground mb-8">You May Also Like</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} className="group">
              <div className="relative overflow-hidden rounded-xl bg-card border border-border transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                  </div>

                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <span className="text-primary font-semibold mt-1 block">${product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
