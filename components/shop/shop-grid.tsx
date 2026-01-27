"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/products"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  id?: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  category: string
  description: string
  benefits: string[]
  ingredients?: string
  howToUse?: string
  inStock: boolean
  featured: boolean
}

export function ShopGrid() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products")
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.products) {
          // Convert _id to id for compatibility
          const productsWithId = data.products.map((p: Product) => ({
            ...p,
            id: p._id || p.id,
          }))
          setProducts(productsWithId)
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return b.featured ? 1 : -1
      }
    })

  return (
    <div className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-3">Our Collection</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground text-balance">
            Beauty <span className="italic">Essentials</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Carefully curated products to complement your beauty routine. Each item selected for quality and results.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full bg-muted text-foreground text-sm border-0 focus:ring-2 focus:ring-primary"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const productId = product._id || product.id || ""

  return (
    <Link href={`/shop/${productId}`} className="group">
      <div className="relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-xl interactive-card">
        {/* Image */}
        <div className="relative aspect-square lg:aspect-auto lg:h-auto overflow-hidden bg-muted flex items-center justify-center">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full lg:w-full lg:h-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
            </div>
          )}
          {product.originalPrice && product.inStock && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              Sale
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{product.name}</h3>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-primary font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Quick Add */}
        <div className="absolute bottom-20 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            size="icon"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12 ripple-effect z-10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (product.inStock) {
                try {
                  // Convert product to cart format
                  const cartProduct = {
                    id: product._id || product.id || "",
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    images: product.images,
                    category: product.category,
                    description: product.description,
                    benefits: product.benefits,
                    ingredients: product.ingredients,
                    howToUse: product.howToUse,
                    inStock: product.inStock,
                    featured: product.featured,
                    rating: product.rating,
                    reviews: product.reviews,
                  }
                  addToCart(cartProduct, 1)
                  toast({
                    title: "Added to cart",
                    description: `${product.name} added to your cart`,
                  })
                } catch (error) {
                  console.error('Error adding to cart:', error)
                  toast({
                    title: "Error",
                    description: "Failed to add item to cart. Please try again.",
                    variant: "destructive",
                  })
                }
              }
            }}
            disabled={!product.inStock}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}
