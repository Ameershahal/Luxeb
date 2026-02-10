"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { resolvePreselect } from "@/lib/booking-utils"
import { CategorySelection } from "./category-selection"
import { ServiceSelection } from "./service-selection"
import { StylistSelection } from "./stylist-selection"
import { DateTimeSelection } from "./date-time-selection"
import { ClientDetails } from "./client-details"
import { BookingConfirmation } from "./booking-confirmation"
import { BookingProgress } from "./booking-progress"

export type BookingData = {
  selectedCategoryId: string | null
  services: {
    id: string
    name: string
    category: string
    duration: number
    price: number
    size?: string
    subServiceName?: string
  }[]
  stylist: {
    id: string
    name: string
    image: string
    specialty: string
  } | null
  dateTime: {
    date: Date | null
    time: string | null
  }
  client: {
    firstName: string
    lastName: string
    email: string
    phone: string
    notes: string
  }
}

const steps = [
  { id: 1, name: "Category", description: "Choose category" },
  { id: 2, name: "Services", description: "Choose services" },
  { id: 3, name: "Stylist", description: "Select stylist" },
  { id: 4, name: "Date & Time", description: "Pick a time" },
  { id: 5, name: "Details", description: "Your information" },
  { id: 6, name: "Confirm", description: "Review & book" },
]

const initialBookingData: BookingData = {
  selectedCategoryId: null,
  services: [],
  stylist: null,
  dateTime: { date: null, time: null },
  client: { firstName: "", lastName: "", email: "", phone: "", notes: "" },
}

export function BookingWizard() {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get("service")
  const preselectParam = searchParams.get("preselect")
  const skipToStylist = Boolean(serviceParam && preselectParam)
  const [currentStep, setCurrentStep] = useState(() =>
    skipToStylist ? 3 : serviceParam ? 2 : 1
  )
  const [bookingData, setBookingData] = useState<BookingData>(() => ({
    ...initialBookingData,
    selectedCategoryId: serviceParam || null,
  }))
  const preselectDirectApplied = useRef(false)

  useEffect(() => {
    const next = searchParams.get("service")
    if (next) {
      setBookingData((prev) => ({ ...prev, selectedCategoryId: next }))
      if (!searchParams.get("preselect")) setCurrentStep(2)
    }
  }, [searchParams])

  useEffect(() => {
    if (!skipToStylist || preselectDirectApplied.current) return
    let cancelled = false
    preselectDirectApplied.current = true
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success || !data.services?.length) return
        const entry = resolvePreselect(
          data.services,
          serviceParam!,
          preselectParam!
        )
        if (entry) {
          setBookingData((prev) => ({
            ...prev,
            selectedCategoryId: serviceParam,
            services: [entry],
          }))
          setCurrentStep(3)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [skipToStylist, serviceParam, preselectParam])

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => {
      const next = { ...prev, ...data }
      if (data.selectedCategoryId !== undefined && data.selectedCategoryId !== prev.selectedCategoryId) {
        next.services = []
      }
      return next
    })
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))
  const goToStep = (step: number) => {
    if (step < currentStep) setCurrentStep(step)
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-2 sm:mb-3">Book Your Experience</p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground text-balance">
            Schedule Your <span className="italic">Appointment</span>
          </h1>
        </div>

        {/* Progress Indicator */}
        <BookingProgress steps={steps} currentStep={currentStep} onStepClick={goToStep} />

        {/* Step Content */}
        <div className="mt-10 lg:mt-12">
          {currentStep === 6 ? (
            <BookingConfirmation bookingData={bookingData} onBack={prevStep} onEdit={goToStep} />
          ) : (
            <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8 lg:p-10">
              {currentStep === 1 && (
                <CategorySelection
                  selectedCategoryId={bookingData.selectedCategoryId}
                  onSelect={(categoryId) => updateBookingData({ selectedCategoryId: categoryId })}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                bookingData.selectedCategoryId ? (
                  <ServiceSelection
                    selectedCategoryId={bookingData.selectedCategoryId}
                    selectedServices={bookingData.services}
                    onSelect={(services) => updateBookingData({ services })}
                    onNext={nextStep}
                    onBack={prevStep}
                    preselectServiceName={searchParams.get("preselect") ?? undefined}
                  />
                ) : (
                  <CategorySelection
                    selectedCategoryId={bookingData.selectedCategoryId}
                    onSelect={(categoryId) => updateBookingData({ selectedCategoryId: categoryId })}
                    onNext={nextStep}
                  />
                )
              )}
              {currentStep === 3 && (
                <StylistSelection
                  selectedStylist={bookingData.stylist}
                  serviceCategory={bookingData.selectedCategoryId || bookingData.services?.[0]?.category || ""}
                  onSelect={(stylist) => updateBookingData({ stylist })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 4 && (
                <DateTimeSelection
                  selectedDateTime={bookingData.dateTime}
                  stylistId={bookingData.stylist?.id || ""}
                  onSelect={(dateTime) => updateBookingData({ dateTime })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 5 && (
                <ClientDetails
                  clientData={bookingData.client}
                  onUpdate={(client) => updateBookingData({ client })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
