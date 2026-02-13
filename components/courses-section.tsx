"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MapPin, Clock, Users, Star, Calendar } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type Course = {
  id: string
  title: string
  description: string
  price: number
  duration: string
  location: string
  students: string
  rating: number
  reviews: number
  image: string
  featured: boolean
  enrollmentCount?: number | null
  startDates?: string[]
}

const fallbackCourses: Course[] = [
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

function CourseCard({ course, index }: { course: Course; index: number }) {
  const router = useRouter()
  const [cardRef, cardVisible] = useScrollReveal({ rootMargin: '0px 0px -100px 0px' })
  const [selectedStartDate, setSelectedStartDate] = useState<string>("")
  const [paymentMode, setPaymentMode] = useState<"deposit" | "full">("deposit")

  // Format date for display (e.g., "2025-03-15" -> "March 15, 2025")
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  const hasStartDates = course.startDates && course.startDates.length > 0
  const canEnroll = !hasStartDates || selectedStartDate !== ""

  const depositPrice = Math.round(course.price * 0.1 * 100) / 100

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-xl interactive-card scroll-reveal ${
        cardVisible ? 'revealed' : ''
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => router.push(`/courses/${course.id}`)}
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

        {/* Course Details */}
        <div className="space-y-2 mb-6 mt-4">
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
          {typeof course.enrollmentCount === "number" && course.enrollmentCount > 0 && (
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Users className="h-3 w-3" />
                <span>{course.enrollmentCount}+ students enrolled</span>
              </span>
            </div>
          )}
        </div>

        {/* Start Date Selection */}
        {hasStartDates && (
          <div className="mb-4 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
            <Label htmlFor={`start-date-${course.id}`} className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Select Start Date
            </Label>
            <Select value={selectedStartDate} onValueChange={setSelectedStartDate}>
              <SelectTrigger id={`start-date-${course.id}`} className="w-full">
                <SelectValue placeholder="Choose a start date" />
              </SelectTrigger>
              <SelectContent>
                {course.startDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatDate(date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStartDate && (
              <p className="text-xs text-muted-foreground mt-2">
                Selected: {formatDate(selectedStartDate)}
              </p>
            )}
          </div>
        )}

        {/* Payment options */}
        <div className="mb-4 pt-4 border-t border-border space-y-2" onClick={(e) => e.stopPropagation()}>
          <p className="text-xs text-muted-foreground">Choose how you’d like to pay</p>
          <div className="flex flex-col gap-1 text-xs sm:text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`payment-${course.id}`}
                value="deposit"
                checked={paymentMode === "deposit"}
                onChange={() => setPaymentMode("deposit")}
                className="h-3 w-3 accent-primary"
              />
              <span>
                Pay 10% non-refundable deposit now (£{depositPrice.toFixed(2)})
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`payment-${course.id}`}
                value="full"
                checked={paymentMode === "full"}
                onChange={() => setPaymentMode("full")}
                className="h-3 w-3 accent-primary"
              />
              <span>
                Pay full amount now (£{course.price.toFixed(2)})
              </span>
            </label>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
          <div>
            <span className="text-xl sm:text-2xl font-serif font-medium text-primary">£{course.price}</span>
          </div>
          <Button 
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 sm:px-6 group/btn transition-all duration-300 hover:scale-105 ripple-effect text-sm sm:text-base h-9 sm:h-10 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canEnroll}
            onClick={async (e) => {
              e.preventDefault()
              if (!canEnroll) return
              
              try {
                const priceToCharge = paymentMode === "deposit" ? depositPrice : course.price

                const response = await fetch('/api/create-checkout-session', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    items: [
                      {
                        name: course.title,
                        description: course.description,
                        price: priceToCharge,
                        quantity: 1,
                        image: course.image,
                      },
                    ],
                    type: 'course',
                    metadata: {
                      type: 'course',
                      courseId: course.id,
                      courseName: course.title,
                      duration: course.duration,
                      location: course.location,
                      paymentMode,
                      courseFullPrice: String(course.price),
                      chargedAmount: String(priceToCharge),
                      depositPercentage: paymentMode === "deposit" ? "10" : "0",
                      ...(selectedStartDate && { selectedStartDate }),
                    },
                  }),
                })

                const data = await response.json()

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to create checkout session')
                }

                // Redirect to Stripe Checkout
                if (data.url) {
                  window.location.href = data.url
                }
              } catch (error) {
                console.error('Checkout error:', error)
                alert('Failed to process enrollment. Please try again.')
              }
            }}
          >
            Enroll Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CoursesSection({ showAll = false }: { showAll?: boolean }) {
  const [headerRef, headerVisible] = useScrollReveal()
  const [courses, setCourses] = useState<Course[]>(fallbackCourses)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.courses?.length) {
          setCourses(data.courses)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!courses.length || !showAll) return
    const highestPrice = Math.max(...courses.map((c) => c.price))
    setMaxPriceFilter(highestPrice)
  }, [courses, showAll])

  const highestPrice = courses.length ? Math.max(...courses.map((c) => c.price)) : 0
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    const withinPrice = maxPriceFilter == null ? true : course.price <= maxPriceFilter
    return matchesSearch && withinPrice
  })

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
            {showAll ? 'All ' : 'Professional '}<span className="italic">Courses</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Join our exclusive offline training programs and learn from master artists in an intimate, hands-on setting.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
        <>
        {showAll && (
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search course</label>
              <Input
                placeholder="Search by course name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Max price</label>
                <span className="text-sm text-muted-foreground">
                  £{Math.round(maxPriceFilter ?? highestPrice)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(100, Math.round(highestPrice))}
                value={Math.round(maxPriceFilter ?? highestPrice)}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {showAll && filteredCourses.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No courses match your filters.</p>
        )}

        {/* CTA - hide on courses page when showing all */}
        {!showAll && (
          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" className="rounded-full group bg-transparent transition-all duration-300 hover:scale-105 hover:bg-primary/10">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
        </>
        )}
      </div>
    </section>
  )
}
