"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Sparkles, Check, Edit2 } from "lucide-react"
import type { BookingData } from "./booking-wizard"

type BookingConfirmationProps = {
  bookingData: BookingData
  onBack: () => void
  onEdit: (step: number) => void
}

export function BookingConfirmation({ bookingData, onBack, onEdit }: BookingConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState("")

  const handleConfirmBooking = async () => {
    if (!bookingData.service) {
      setError("Please select a service")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              name: bookingData.service.name,
              description: `${bookingData.service.category} - ${bookingData.service.duration} min`,
              price: bookingData.service.price,
              quantity: 1,
            },
          ],
          type: 'booking',
          metadata: {
            type: 'booking',
            serviceId: bookingData.service.id,
            serviceName: bookingData.service.name,
            stylistId: bookingData.stylist?.id || '',
            stylistName: bookingData.stylist?.name || '',
            date: bookingData.dateTime.date?.toISOString() || '',
            time: bookingData.dateTime.time || '',
            clientName: `${bookingData.client.firstName} ${bookingData.client.lastName}`,
            email: bookingData.client.email,
            phone: bookingData.client.phone,
            notes: bookingData.client.notes || '',
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
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'Failed to process payment. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isConfirmed) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="font-serif text-3xl font-medium text-foreground mb-4">Booking Confirmed!</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We've sent a confirmation email to {bookingData.client.email}. We look forward to seeing you at Luxe Beauty & Training.
        </p>
        <div className="bg-card rounded-xl border border-border p-6 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-2">Confirmation Number</p>
          <p className="font-mono text-lg font-medium text-foreground">MR-{Date.now().toString(36).toUpperCase()}</p>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 px-6 py-4 border-b border-border">
            <h3 className="font-serif text-xl font-medium text-foreground">Booking Summary</h3>
          </div>

          {/* Service */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium text-foreground">{bookingData.service?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingData.service?.duration} min • £{bookingData.service?.price}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onEdit(1)}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit service"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stylist */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stylist</p>
                  <p className="font-medium text-foreground">{bookingData.stylist?.name}</p>
                </div>
              </div>
              <button
                onClick={() => onEdit(2)}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit stylist"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium text-foreground">{formatDate(bookingData.dateTime.date)}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.dateTime.time}</p>
                </div>
              </div>
              <button
                onClick={() => onEdit(3)}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit date and time"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Client Info */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
                <p className="font-medium text-foreground">
                  {bookingData.client.firstName} {bookingData.client.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{bookingData.client.email}</p>
                <p className="text-sm text-muted-foreground">{bookingData.client.phone}</p>
                {bookingData.client.notes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{bookingData.client.notes}"</p>
                )}
              </div>
              <button
                onClick={() => onEdit(4)}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit contact information"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-serif text-2xl font-medium text-primary">£{bookingData.service?.price}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Secure payment via Stripe</p>
        </div>

        {/* Policies */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            By confirming this booking, you agree to our cancellation policy. Appointments must be cancelled at least 24
            hours in advance to avoid a 50% cancellation fee.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6 h-12 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Confirming...</span>
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </div>
  )
}
