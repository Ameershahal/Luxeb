"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-center lg:scale-[1.07] lg:origin-top"
        >
          <source src="/1768208586874.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-foreground animate-fade-in-up opacity-0 animation-delay-200 text-balance mt-8 sm:mt-12 lg:mt-16">
            Welcome to LUXE BEAUTY & TRAINING ACADEMY
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg animate-fade-in-up opacity-0 animation-delay-400">
            Bringing 10+ years of experience in nail care, professional pedicure techniques, heel repair, and fungal nail treatments. We offer high quality professional training and recognized ABT Accreditation certifications.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up opacity-0 animation-delay-600">
            <Link href="/booking" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base group transition-all duration-300 hover:scale-105 hover:shadow-lg ripple-effect"
              >
                Book Appointment
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/shop" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base border-foreground/20 hover:bg-foreground/5 bg-transparent transition-all duration-300 hover:scale-105 hover:border-primary/50"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:block animate-float cursor-pointer">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-foreground/30 to-foreground/30 transition-all duration-300 hover:h-20" />
      </div>
    </section>
  )
}
