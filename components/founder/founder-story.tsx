"use client"

import { Quote } from "lucide-react"

export function FounderStory() {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Quote */}
        <div className="text-center mb-16">
          <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground italic leading-relaxed text-balance">
            "True beauty is not about perfection—it's about the confidence that radiates when a woman feels
            authentically herself."
          </blockquote>
          <cite className="block mt-6 text-muted-foreground not-italic">— Ionela</cite>
        </div>

        {/* Story */}
        <div className="prose prose-lg max-w-none">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-4">The Beginning</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Ionela's journey into the world of beauty began in her grandmother's salon—a
                modest establishment that nonetheless attracted the most discerning clientele in the region. It was
                there, watching her grandmother transform not just appearances but spirits, that Ionela discovered her
                calling.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                After training at the prestigious Institut Supérieur de Beauté in Paris, she spent a decade working
                behind the scenes at fashion weeks in Milan, New York, and Tokyo, perfecting her craft alongside the
                industry's most renowned artists.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-4">The Vision</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                In 2018, Ionela returned to New York with a vision: to create a beauty destination that would honor
                the intimate, transformative experience of her grandmother's salon while embracing the innovation and
                luxury she had witnessed in the fashion world.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Luxe Beauty & Training opened its doors with a simple promise—to provide an unparalleled beauty experience where
                every detail, from the products used to the ambiance created, would reflect the highest standards of
                elegance and care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
