"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ServiceSelection } from "./service-selection"
import { StylistSelection } from "./stylist-selection"
import { DateTimeSelection } from "./date-time-selection"
import { ClientDetails } from "./client-details"
import { BookingConfirmation } from "./booking-confirmation"
import { BookingProgress } from "./booking-progress"

export type BookingData = {
  services: {
    id: string
    name: string
    category: string
    duration: number
    price: number
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
  { id: 1, name: "Services", description: "Choose your services" },
  { id: 2, name: "Stylist", description: "Select your stylist" },
  { id: 3, name: "Date & Time", description: "Pick a time" },
  { id: 4, name: "Details", description: "Your information" },
  { id: 5, name: "Confirm", description: "Review & book" },
]

export function BookingWizard() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    services: [],
    stylist: null,
    dateTime: { date: null, time: null },
    client: { firstName: "", lastName: "", email: "", phone: "", notes: "" },
  })

  // Pre-select service category from URL params
  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam) {
      // Could pre-filter services based on category
    }
  }, [searchParams])

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5))
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
          {currentStep === 1 && (
            <ServiceSelection
              selectedServices={bookingData.services}
              onSelect={(services) => updateBookingData({ services })}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <StylistSelection
              selectedStylist={bookingData.stylist}
              serviceCategory={bookingData.services?.[0]?.category || ""}
              onSelect={(stylist) => updateBookingData({ stylist })}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <DateTimeSelection
              selectedDateTime={bookingData.dateTime}
              stylistId={bookingData.stylist?.id || ""}
              onSelect={(dateTime) => updateBookingData({ dateTime })}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <ClientDetails
              clientData={bookingData.client}
              onUpdate={(client) => updateBookingData({ client })}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 && <BookingConfirmation bookingData={bookingData} onBack={prevStep} onEdit={goToStep} />}
        </div>
      </div>
    </div>
  )
}
