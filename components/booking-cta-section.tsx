"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"

export function BookingCtaSection() {
  return (
    <section className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <Calendar className="h-12 w-12 text-primary-foreground/80 mx-auto mb-6" />

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-primary-foreground mb-6 text-balance">
          Ready to Experience <span className="italic">Luxury?</span>
        </h2>

        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Book your appointment today and let our expert team create a personalized beauty experience just for you.
        </p>

        <Link href="/booking">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-10 h-14 text-base font-medium group"
          >
            Book Your Session
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        <p className="mt-8 text-sm text-primary-foreground/60">
          Limited availability • Book at least 48 hours in advance
        </p>
      </div>
    </section>
  )
}
