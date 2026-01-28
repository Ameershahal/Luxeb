"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-destructive/10 mb-6">
              <X className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="font-serif text-4xl font-medium text-foreground mb-4">
              Payment Cancelled
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your payment was cancelled. No charges were made. You can try again anytime.
            </p>
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
