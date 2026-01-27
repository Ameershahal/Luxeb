"use client"

import { useState } from "react"
import { Star, Minus, Plus, ShoppingBag, Heart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

type ProductDetailProps = {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "howToUse">("description")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10))
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  return (
    <div className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.originalPrice && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  Sale
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index ? "border-primary" : "border-transparent",
                  )}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Category */}
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary mb-2">
              {product.category === "nails" ? "Nail Care" : product.category === "hair" ? "Hair Care" : "Beauty"}
            </p>

            {/* Title */}
            <h1 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-medium text-primary">£{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">£{product.originalPrice}</span>
              )}
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {product.benefits.map((benefit) => (
                  <span key={benefit} className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border rounded-full">
                <button
                  onClick={decrementQuantity}
                  className="h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-full bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
                disabled={!product.inStock}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!product.inStock) return
                  
                  try {
                    addToCart(product, quantity)
                    toast({
                      title: "Added to cart",
                      description: `${quantity}x ${product.name} added to your cart`,
                    })
                    // Force a small delay to ensure state updates
                    setTimeout(() => {
                      // Trigger a custom event to update navbar
                      window.dispatchEvent(new Event('cartUpdated'))
                    }, 100)
                  } catch (error) {
                    console.error('Error adding to cart:', error)
                    toast({
                      title: "Error",
                      description: "Failed to add item to cart. Please try again.",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              {/* Buy Now */}
              <Button
                className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                disabled={!product.inStock}
                onClick={async () => {
                  if (!product.inStock) return
                  
                  try {
                    const response = await fetch('/api/create-checkout-session', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        items: [
                          {
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            quantity: quantity,
                            image: product.images[0],
                          },
                        ],
                        type: 'product',
                        metadata: {
                          type: 'product',
                          productId: product.id,
                          productName: product.name,
                          quantity: quantity.toString(),
                        },
                      }),
                    })

                    const data = await response.json()

                    if (!response.ok) {
                      throw new Error(data.error || 'Failed to create checkout session')
                    }

                    // Redirect to Stripe Checkout
                    if (data.url) {
                      window.location.href = data.url
                    }
                  } catch (error) {
                    console.error('Checkout error:', error)
                    alert('Failed to process checkout. Please try again.')
                  }
                }}
              >
                Buy Now
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                size="icon"
                className={cn("h-12 w-12 rounded-full bg-transparent", isWishlisted && "text-primary border-primary")}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-primary")} />
              </Button>
            </div>

            {/* Tabs */}
            <div className="border-t border-border pt-6">
              {/* Tab Headers */}
              <div className="flex gap-6 mb-4">
                {["description", "ingredients", "howToUse"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={cn(
                      "text-sm font-medium pb-2 border-b-2 transition-colors",
                      activeTab === tab
                        ? "text-foreground border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground",
                    )}
                  >
                    {tab === "description" ? "Description" : tab === "ingredients" ? "Ingredients" : "How to Use"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-muted-foreground leading-relaxed">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "ingredients" && <p>{product.ingredients || "Ingredients information coming soon."}</p>}
                {activeTab === "howToUse" && <p>{product.howToUse || "Usage instructions coming soon."}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
