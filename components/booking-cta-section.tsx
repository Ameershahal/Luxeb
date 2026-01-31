"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"

export function BookingCtaSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground/80 mx-auto mb-4 sm:mb-6" />

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-primary-foreground mb-4 sm:mb-6 text-balance">
          Ready to Experience <span className="italic">Luxury?</span>
        </h2>

        <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Book your appointment today and let our expert team create a personalized beauty experience just for you.
        </p>

        <Link href="/booking" className="inline-block">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 sm:px-10 h-12 sm:h-14 text-sm sm:text-base font-medium group"
          >
            Book Your Session
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-primary-foreground/60">
          Limited availability • Book at least 48 hours in advance
        </p>
      </div>
    </section>
  )
}
