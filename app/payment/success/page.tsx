"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Verify payment was successful
    if (sessionId) {
      // In production, you might want to verify the session with your backend
      setLoading(false)
    } else {
      router.push('/')
    }
  }, [sessionId, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-serif text-4xl font-medium text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Thank you for your purchase. We've sent a confirmation email with your order details.
            </p>
            {sessionId && (
              <div className="bg-card rounded-xl border border-border p-6 max-w-md mx-auto mb-8">
                <p className="text-sm text-muted-foreground mb-2">Transaction ID</p>
                <p className="font-mono text-sm font-medium text-foreground break-all">{sessionId}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="rounded-full px-8 h-12 bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
