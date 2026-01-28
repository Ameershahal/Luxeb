"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    if (isProcessing) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images[0] || item.product.image,
          })),
          type: 'product',
          metadata: {
            type: 'cart',
            itemCount: cartItems.length.toString(),
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
      } else {
        throw new Error('No checkout URL received from server')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(`Failed to process checkout: ${error.message || 'Please try again.'}`)
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground mb-2">
              Shopping <span className="italic">Cart</span>
            </h1>
            <p className="text-muted-foreground">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Add some products to get started!</p>
              <Link href="/shop">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-card rounded-xl border border-border p-6 flex gap-6"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.images[0] || item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/shop/${item.product.id}`}>
                            <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">£{item.product.price} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-border rounded-full">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-medium text-foreground">
                          £{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="font-serif text-xl font-medium text-foreground mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">£{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-serif text-xl font-medium text-primary">£{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing || cartItems.length === 0}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        Processing...
                        <span className="ml-2 animate-spin">⏳</span>
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Link href="/shop">
                    <Button variant="outline" className="w-full rounded-full h-12 bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
