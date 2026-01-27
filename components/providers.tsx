"use client"

import { ErrorBoundary } from "./error-boundary"
import { CartProvider } from "@/contexts/cart-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <CartProvider>
        {children}
      </CartProvider>
    </ErrorBoundary>
  )
}
