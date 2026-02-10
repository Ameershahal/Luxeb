"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
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

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              With over 10 years of experience in the beauty industry, Ioana Andreiana founded Luxe Beauty & Training with a clear vision: to create a space where luxury, artistry, and confidence come together.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              With a background in fine arts and professional training under world-renowned educator Dana Miron, Ioana has mastered advanced techniques that reflect both precision and creativity.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              Today, she is not only a trusted beauty expert but also a Certified Trainer dedicated to inspiring women to feel empowered, confident, and beautifully transformed.
            </p>

            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <p className="font-serif text-xl sm:text-2xl font-medium text-foreground">Ioana Andreiana</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Founder</p>
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
