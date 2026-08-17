"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, Loader2, ShoppingBag, ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      router.push('/')
      return
    }

    async function verifyAndFulfill() {
      try {
        const res = await fetch('/api/payment/fulfill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        const data = await res.json()
        if (!res.ok) {
          console.error('Fulfill booking failed:', data.error)
        }
      } catch (err) {
        console.error('Fulfill booking error:', err)
      } finally {
        setLoading(false)
      }
    }

    verifyAndFulfill()
  }, [sessionId, router])

  if (loading) {
    return (
      <div className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">Verifying payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-12 pb-8 sm:pt-20 sm:pb-12 lg:pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 sm:py-12 lg:py-16">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-primary/10 mb-4 sm:mb-6 lg:mb-8 animate-in fade-in zoom-in duration-500">
            <Check className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" strokeWidth={3} />
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Order Successful!
          </h1>

          {/* Message */}
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-5 sm:mb-6 lg:mb-8 max-w-md mx-auto leading-relaxed px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Thank you for your purchase! We've sent a confirmation email with your order details. Your order will be processed shortly.
          </p>

          {/* Transaction ID */}
          {sessionId && (
            <div className="bg-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-border p-3 sm:p-4 lg:p-6 max-w-md mx-4 sm:mx-auto mb-6 sm:mb-8 lg:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Transaction ID</p>
              <p className="font-mono text-xs sm:text-sm font-medium text-foreground break-all">{sessionId}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Link href="/shop" className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
              <Button 
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 lg:px-10 h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg font-medium group transition-all duration-300 active:scale-95 sm:hover:scale-105 sm:hover:shadow-lg"
              >
                <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full rounded-full px-6 sm:px-8 lg:px-10 h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg bg-transparent border-foreground/20 hover:bg-foreground/5 hover:border-primary/50 transition-all duration-300 active:scale-95 sm:hover:scale-105"
              >
                <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentSuccessFallback() {
  return (
    <div className="pt-12 pb-8 sm:pt-20 sm:pb-12 lg:pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/10 mb-4 sm:mb-6">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mb-3 sm:mb-4 px-2">
            Processing Payment...
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-4">Please wait while we verify your payment.</p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<PaymentSuccessFallback />}>
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
