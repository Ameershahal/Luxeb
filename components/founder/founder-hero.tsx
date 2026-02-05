"use client"

export function FounderHero() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src="/founder.jpeg"
                alt="Ioana Andreiana, Founder of Luxe Beauty & Training"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">The Visionary</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6 text-balance">
              <span className="italic">Ioana Andreiana</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">Founder & Creative Director</p>
            <p className="text-muted-foreground leading-relaxed">
              With an eye for beauty refined through years in the fashion capitals of the world, Ioana Andreiana has
              transformed her passion into Luxe Beauty & Training—a sanctuary where artistry meets luxury, and every client
              becomes a canvas for self-expression.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
