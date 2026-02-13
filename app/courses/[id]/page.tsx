"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Star, Users } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function CourseDetailsPage() {
  const params = useParams<{ id: string }>()
  const courseId = params?.id

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<string>("")
  const [paymentMode, setPaymentMode] = useState<"deposit" | "full">("deposit")

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        if (data.success && Array.isArray(data.courses)) {
          const found = data.courses.find((c: Course) => c.id === courseId) || null
          setCourse(found)
        }
      } catch {
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    } else {
      setLoading(false)
    }
  }, [courseId])

  const hasStartDates = !!(course?.startDates && course.startDates.length > 0)
  const canEnroll = !hasStartDates || selectedStartDate !== ""
  const depositPrice = useMemo(() => {
    if (!course) return 0
    return Math.round(course.price * 0.1 * 100) / 100
  }, [course])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 px-6 text-center text-muted-foreground">Loading course...</div>
        <Footer />
        <MobileBottomNav />
      </main>
    )
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
          <h1 className="font-serif text-3xl text-foreground">Course not found</h1>
        </div>
        <Footer />
        <MobileBottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-border">
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm text-muted-foreground">{course.rating} ({course.reviews} reviews)</span>
              </div>

              <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">{course.title}</h1>
              <p className="text-muted-foreground mb-6">{course.description}</p>

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
                {typeof course.enrollmentCount === "number" && course.enrollmentCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mt-2">
                    <Users className="h-3 w-3" />
                    <span>{course.enrollmentCount}+ students enrolled</span>
                  </span>
                )}
              </div>

              {hasStartDates && (
                <div className="mb-4 pt-4 border-t border-border">
                  <Label htmlFor={`start-date-${course.id}`} className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Select Start Date
                  </Label>
                  <Select value={selectedStartDate} onValueChange={setSelectedStartDate}>
                    <SelectTrigger id={`start-date-${course.id}`} className="w-full">
                      <SelectValue placeholder="Choose a start date" />
                    </SelectTrigger>
                    <SelectContent>
                      {(course.startDates || []).map((date) => (
                        <SelectItem key={date} value={date}>
                          {formatDate(date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="mb-4 pt-4 border-t border-border space-y-2">
                <p className="text-xs text-muted-foreground">Choose how you would like to pay</p>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="payment-mode"
                    value="deposit"
                    checked={paymentMode === "deposit"}
                    onChange={() => setPaymentMode("deposit")}
                    className="h-3 w-3 accent-primary"
                  />
                  <span>Pay 10% non-refundable deposit now (GBP {depositPrice.toFixed(2)})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="payment-mode"
                    value="full"
                    checked={paymentMode === "full"}
                    onChange={() => setPaymentMode("full")}
                    className="h-3 w-3 accent-primary"
                  />
                  <span>Pay full amount now (GBP {course.price.toFixed(2)})</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-2xl font-serif font-medium text-primary">GBP {course.price}</span>
                <Button
                  disabled={!canEnroll}
                  onClick={async () => {
                    if (!canEnroll) return
                    try {
                      const priceToCharge = paymentMode === "deposit" ? depositPrice : course.price
                      const response = await fetch("/api/create-checkout-session", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
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
                          type: "course",
                          metadata: {
                            type: "course",
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
                      if (!response.ok) throw new Error(data.error || "Failed to create checkout session")
                      if (data.url) window.location.href = data.url
                    } catch {
                      alert("Failed to process enrollment. Please try again.")
                    }
                  }}
                >
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
