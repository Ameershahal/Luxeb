"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Quote } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function FounderSection() {
  const [imageRef, imageVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
  const [contentRef, contentVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })

  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-muted overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div ref={imageRef} className={`relative order-2 lg:order-1 scroll-reveal ${imageVisible ? 'revealed' : ''}`}>
            <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden group/image">
              <img
                src="/founder.jpeg"
                alt="Ioana Andreiana, Founder of Luxe Beauty & Training"
                className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-105"
              />
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className={`order-1 lg:order-2 lg:py-8 scroll-reveal ${contentVisible ? 'revealed' : ''}`}>
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-3 sm:mb-4">The Founder</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-6 sm:mb-8 text-balance">
              A Vision of <span className="italic">Timeless Beauty</span>
            </h2>

            <div className="relative mb-6 sm:mb-8">
              <Quote className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
              <blockquote className="pl-6 sm:pl-8 font-serif text-lg sm:text-xl lg:text-2xl text-foreground/80 italic leading-relaxed">
                "Beauty is not just about appearance—it's about how you feel when you walk out our doors. Every service
                we offer is designed to elevate not just your look, but your confidence."
              </blockquote>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              With over 15 years of experience in the beauty industry, Ioana Andreiana founded Luxe Beauty & Training with a
              singular vision: to create a sanctuary where artistry meets luxury. Her background in fine arts and her
              passion for beauty converge in every service we offer.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              Today, Luxe Beauty & Training stands as a testament to her belief that every woman deserves to experience beauty at
              its finest—thoughtful, personalized, and utterly transformative.
            </p>

            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <p className="font-serif text-xl sm:text-2xl font-medium text-foreground">Ioana Andreiana</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Founder & Creative Director</p>
              </div>
            </div>

            <Link href="/founder" className="inline-block">
              <Button variant="outline" className="w-full sm:w-auto rounded-full group bg-transparent transition-all duration-300 hover:scale-105 hover:bg-primary/10 text-sm sm:text-base h-10 sm:h-11">
                Read Full Story
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
