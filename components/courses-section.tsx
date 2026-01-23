"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Clock, Users, Star } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const courses = [
  {
    id: "course-1",
    title: "Professional Nail Artistry",
    description: "Master the art of nail design with hands-on training from industry experts",
    price: 299,
    duration: "4 weeks",
    location: "Studio Location",
    students: "Max 8 students",
    rating: 4.9,
    reviews: 45,
    image: "/elegant-manicure-nail-art-close-up-with-gold-and-d.jpg",
    featured: true,
  },
  {
    id: "course-2",
    title: "Hair Styling Fundamentals",
    description: "Learn precision cutting, coloring techniques, and styling methods",
    price: 349,
    duration: "6 weeks",
    location: "Studio Location",
    students: "Max 6 students",
    rating: 4.8,
    reviews: 32,
    image: "/professional-hair-styling-elegant-woman-salon-dark.jpg",
    featured: false,
  },
  {
    id: "course-3",
    title: "Beauty Makeup Masterclass",
    description: "From everyday looks to bridal makeup, master professional techniques",
    price: 249,
    duration: "3 weeks",
    location: "Studio Location",
    students: "Max 10 students",
    rating: 5.0,
    reviews: 28,
    image: "/luxury-facial-beauty-treatment-spa-elegant-woman.jpg",
    featured: false,
  },
]

export function CoursesSection() {
  const [headerRef, headerVisible] = useScrollReveal()

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-12 lg:mb-16 scroll-reveal ${headerVisible ? 'revealed' : ''}`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">Training Programs</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground text-balance">
            Professional <span className="italic">Courses</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Join our exclusive offline training programs and learn from master artists in an intimate, hands-on setting.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => {
            const [cardRef, cardVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
            return (
            <div
              key={course.id}
              ref={cardRef}
              className={`group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-xl interactive-card scroll-reveal ${
                cardVisible ? 'revealed' : ''
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium">
                  Offline Course
                </div>
                {course.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium text-foreground">{course.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({course.reviews} reviews)</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl lg:text-2xl font-medium text-foreground mb-2">{course.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{course.description}</p>

                {/* Course Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{course.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-2xl font-serif font-medium text-primary">${course.price}</span>
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 group/btn transition-all duration-300 hover:scale-105 ripple-effect">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/courses">
            <Button variant="outline" className="rounded-full group bg-transparent transition-all duration-300 hover:scale-105 hover:bg-primary/10">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
