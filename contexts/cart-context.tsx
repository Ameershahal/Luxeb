"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Product } from '@/lib/products'

type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsMounted(true)
    
    // Load cart from localStorage on mount
    try {
      const savedCart = localStorage.getItem('luxe-beauty-cart')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setCartItems(parsed)
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes (only on client)
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('luxe-beauty-cart', JSON.stringify(cartItems))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cartItems, isMounted])

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!isMounted) {
      console.warn('Cart not mounted yet, cannot add items')
      return
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      let updated: CartItem[]
      if (existingItem) {
        updated = prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        console.log('Cart updated (existing item):', updated)
      } else {
        updated = [...prevItems, { product, quantity }]
        console.log('Cart updated (new item):', updated)
      }

      // Dispatch custom event to notify navbar and other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: updated } }))
      }

      return updated
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.product.id !== productId)
      // Dispatch custom event to notify navbar and other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: updated } }))
      }
      return updated
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) => {
      const updated = prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
      // Dispatch custom event to notify navbar and other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: updated } }))
      }
      return updated
    })
  }

  const clearCart = () => {
    setCartItems([])
    // Dispatch custom event to notify navbar and other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: [] } }))
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
