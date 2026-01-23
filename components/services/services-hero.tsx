"use client"

export function ServicesHero() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">What We Offer</p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6 text-balance">
          Luxury <span className="italic">Services</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          From intricate nail artistry to transformative hair styling and rejuvenating beauty treatments, every service
          at Maison Rouge is designed to elevate your natural beauty.
        </p>
      </div>
    </section>
  )
}
