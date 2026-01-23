"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Check, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type Stylist = {
  id: string
  name: string
  image: string
  specialty: string
  rating: number
  experience: string
  bio: string
}

const stylists: Stylist[] = [
  {
    id: "stylist-1",
    name: "Sofia Chen",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "nails",
    rating: 4.9,
    experience: "8 years",
    bio: "Nail art specialist with a passion for intricate designs",
  },
  {
    id: "stylist-2",
    name: "Marie Laurent",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "hair",
    rating: 5.0,
    experience: "12 years",
    bio: "Master colorist trained in Paris",
  },
  {
    id: "stylist-3",
    name: "Emma Rose",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "beauty",
    rating: 4.8,
    experience: "6 years",
    bio: "Skincare expert and lash extension artist",
  },
  {
    id: "stylist-4",
    name: "Isabella Vega",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "nails",
    rating: 4.9,
    experience: "5 years",
    bio: "Known for minimalist luxury nail designs",
  },
  {
    id: "stylist-5",
    name: "Charlotte Kim",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "hair",
    rating: 4.7,
    experience: "10 years",
    bio: "Precision cut specialist and bridal stylist",
  },
  {
    id: "stylist-6",
    name: "Any Available",
    image: "/placeholder.svg?height=200&width=200",
    specialty: "all",
    rating: 5.0,
    experience: "",
    bio: "We'll match you with the best available stylist",
  },
]

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
  // Filter stylists by service category, always include "Any Available"
  const availableStylists = stylists.filter((s) => s.specialty === serviceCategory || s.specialty === "all")

  return (
    <div className="space-y-8">
      <p className="text-center text-muted-foreground">
        Choose your preferred stylist or let us match you with the best available
      </p>

      {/* Stylists Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableStylists.map((stylist) => (
          <button
            key={stylist.id}
            onClick={() => onSelect(stylist)}
            className={cn(
              "relative p-5 rounded-xl text-left transition-all duration-300 border-2",
              selectedStylist?.id === stylist.id
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/50 hover:shadow-md",
            )}
          >
            {/* Selected Indicator */}
            {selectedStylist?.id === stylist.id && (
              <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}

            <div className="flex items-start gap-4">
              <img
                src={stylist.image || "/placeholder.svg"}
                alt={stylist.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{stylist.name}</h3>
                {stylist.experience && <p className="text-sm text-muted-foreground">{stylist.experience} experience</p>}
                {stylist.rating && stylist.id !== "stylist-6" && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-sm text-muted-foreground">{stylist.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3">{stylist.bio}</p>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6 h-12 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedStylist}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
