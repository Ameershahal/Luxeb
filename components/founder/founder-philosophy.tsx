"use client"

import { Sparkles, Heart, Award, Leaf } from "lucide-react"

const values = [
  {
    icon: Sparkles,
    title: "Artistry",
    description: "Every service is an opportunity for creative expression, tailored to enhance your unique beauty.",
  },
  {
    icon: Heart,
    title: "Care",
    description: "We believe in nurturing not just your appearance, but your confidence and well-being.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We hold ourselves to the highest standards, using only premium products and techniques.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Committed to eco-conscious practices and cruelty-free, ethically sourced products.",
  },
]

export function FounderPhilosophy() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">Our Philosophy</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground text-balance">
            The Luxe Beauty & Training <span className="italic">Difference</span>
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Team Preview */}
        <div className="mt-20 lg:mt-28">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">Meet Our Team</h2>
            <p className="mt-3 text-muted-foreground">Hand-selected artists who share our passion for excellence</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sofia Chen", role: "Lead Nail Artist", image: "/team-member-1-nail-artist.jpg" },
              { name: "Emma Rose", role: "Beauty Specialist", image: "/team-member-3-beauty-specialist.jpg" },
              { name: "Isabella Vega", role: "Nail Art Specialist", image: "/team-member-4-color-expert.jpg" },
            ].map((member) => (
              <div key={member.name} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
