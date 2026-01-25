"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft } from "lucide-react"

type ClientData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

type ClientDetailsProps = {
  clientData: ClientData
  onUpdate: (data: ClientData) => void
  onNext: () => void
  onBack: () => void
}

export function ClientDetails({ clientData, onUpdate, onNext, onBack }: ClientDetailsProps) {
  const [formData, setFormData] = useState<ClientData>(clientData)
  const [errors, setErrors] = useState<Partial<ClientData>>({})

  const handleChange = (field: keyof ClientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<ClientData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate(formData)
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-xl mx-auto bg-card rounded-xl border border-border p-6 lg:p-8">
        <h3 className="font-serif text-xl font-medium text-foreground mb-6">Your Information</h3>

        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+44 7450 239432"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any allergies, preferences, or special requests..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6 h-12 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
        >
          Review Booking
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
