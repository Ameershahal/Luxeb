"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Quote } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function FounderSection() {
  const [imageRef, imageVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
  const [contentRef, contentVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })

  return (
    <section className="py-24 lg:py-32 bg-muted overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div ref={imageRef} className={`relative scroll-reveal ${imageVisible ? 'revealed' : ''}`}>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group/image">
              <img
                src="/founder.jpeg"
                alt="Ionela, Founder of Luxe Beauty & Training"
                className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-105"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-2xl -z-10 transition-all duration-500 group-hover/image:scale-110 group-hover/image:rotate-3" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-2xl -z-10 transition-all duration-500 group-hover/image:scale-110 group-hover/image:-rotate-3" />
          </div>

          {/* Content */}
          <div ref={contentRef} className={`lg:py-8 scroll-reveal ${contentVisible ? 'revealed' : ''}`}>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">The Founder</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground mb-8 text-balance">
              A Vision of <span className="italic">Timeless Beauty</span>
            </h2>

            <div className="relative mb-8">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
              <blockquote className="pl-8 font-serif text-xl lg:text-2xl text-foreground/80 italic leading-relaxed">
                "Beauty is not just about appearance—it's about how you feel when you walk out our doors. Every service
                we offer is designed to elevate not just your look, but your confidence."
              </blockquote>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-4">
              With over 15 years of experience in the beauty industry, Ionela founded Luxe Beauty & Training with a
              singular vision: to create a sanctuary where artistry meets luxury. Her background in fine arts and her
              passion for beauty converge in every service we offer.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Today, Luxe Beauty & Training stands as a testament to her belief that every woman deserves to experience beauty at
              its finest—thoughtful, personalized, and utterly transformative.
            </p>

            <div className="flex items-center gap-6">
              <div>
                <p className="font-serif text-2xl font-medium text-foreground">Ionela</p>
                <p className="text-sm text-muted-foreground">Founder & Creative Director</p>
              </div>
            </div>

            <Link href="/founder" className="inline-block mt-8">
              <Button variant="outline" className="rounded-full group bg-transparent transition-all duration-300 hover:scale-105 hover:bg-primary/10">
                Read Full Story
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
