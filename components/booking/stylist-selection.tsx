"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Check, Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AvailableTime = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
}

type Stylist = {
  _id: string
  id?: string
  name: string
  image: string
  specialty: string
  rating: number
  experience: string
  bio: string
  availableTimes?: AvailableTime[]
}

type StylistSelectionProps = {
  selectedStylist: Stylist | null
  serviceCategory: string
  onSelect: (stylist: Stylist) => void
  onNext: () => void
  onBack: () => void
}

export function StylistSelection({
  selectedStylist,
  serviceCategory,
  onSelect,
  onNext,
  onBack,
}: StylistSelectionProps) {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStylists()
  }, [serviceCategory])

  const fetchStylists = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/stylists?category=${serviceCategory || 'all'}`)
      const data = await response.json()
      
      if (data.success) {
        // Add "Any Available" option
        const anyAvailable: Stylist = {
          _id: "any-available",
          name: "Any Available",
          image: "/placeholder.svg?height=200&width=200",
          specialty: "all",
          rating: 5.0,
          experience: "",
          bio: "We'll match you with the best available stylist",
        }
        setStylists([...data.stylists, anyAvailable])
      }
    } catch (error) {
      console.error("Error fetching stylists:", error)
      // Fallback to empty array
      setStylists([])
    } finally {
      setIsLoading(false)
    }
  }

  // Filter stylists by service category, always include "Any Available"
  const availableStylists = stylists.filter((s) => s.specialty === serviceCategory || s.specialty === "all")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <p className="text-center text-sm sm:text-base text-muted-foreground">
        Choose your preferred stylist or let us match you with the best available
      </p>

      {/* Stylists Grid */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableStylists.map((stylist) => {
          const stylistId = stylist._id || stylist.id || ""
          const isSelected = selectedStylist?.id === stylistId || selectedStylist?.id === stylist._id
          
          return (
            <button
              key={stylistId}
              onClick={() => onSelect({ ...stylist, id: stylistId })}
              className={cn(
                "relative p-4 sm:p-5 rounded-xl text-left transition-all duration-300 border-2 min-h-[140px]",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md",
              )}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                </div>
              )}

              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={stylist.image || "/placeholder.svg"}
                  alt={stylist.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base text-foreground">{stylist.name}</h3>
                  {stylist.experience && <p className="text-xs sm:text-sm text-muted-foreground">{stylist.experience} experience</p>}
                  {stylist.rating && stylistId !== "any-available" && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{stylist.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 line-clamp-2">{stylist.bio}</p>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto rounded-full px-5 sm:px-6 h-11 sm:h-12 bg-transparent text-sm sm:text-base">
          <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedStylist}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
        >
          Continue
          <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}
