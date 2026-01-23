"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Service = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  description: string
}

const services: Service[] = [
  // Nails
  {
    id: "nail-1",
    name: "Classic Manicure",
    category: "nails",
    duration: 45,
    price: 45,
    description: "Essential nail care with polish of your choice",
  },
  {
    id: "nail-2",
    name: "Gel Manicure",
    category: "nails",
    duration: 60,
    price: 65,
    description: "Long-lasting gel polish with cuticle care",
  },
  {
    id: "nail-3",
    name: "Luxury Spa Manicure",
    category: "nails",
    duration: 75,
    price: 85,
    description: "Full treatment with massage and premium products",
  },
  {
    id: "nail-4",
    name: "Nail Art Design",
    category: "nails",
    duration: 90,
    price: 120,
    description: "Custom artistic designs by our nail artists",
  },
  // Hair
  {
    id: "hair-1",
    name: "Precision Cut",
    category: "hair",
    duration: 45,
    price: 95,
    description: "Expert cut tailored to your face shape",
  },
  {
    id: "hair-2",
    name: "Cut & Style",
    category: "hair",
    duration: 75,
    price: 145,
    description: "Precision cut with professional styling",
  },
  {
    id: "hair-3",
    name: "Balayage",
    category: "hair",
    duration: 180,
    price: 295,
    description: "Hand-painted highlights for natural dimension",
  },
  {
    id: "hair-4",
    name: "Keratin Treatment",
    category: "hair",
    duration: 150,
    price: 350,
    description: "Smoothing treatment for frizz-free hair",
  },
  // Beauty
  {
    id: "beauty-1",
    name: "Signature Facial",
    category: "beauty",
    duration: 60,
    price: 125,
    description: "Customized facial for radiant skin",
  },
  {
    id: "beauty-2",
    name: "Lash Extensions",
    category: "beauty",
    duration: 90,
    price: 185,
    description: "Classic or volume lash application",
  },
  {
    id: "beauty-3",
    name: "Brow Styling",
    category: "beauty",
    duration: 30,
    price: 55,
    description: "Shaping, tinting, and lamination",
  },
  {
    id: "beauty-4",
    name: "Bridal Makeup",
    category: "beauty",
    duration: 90,
    price: 225,
    description: "Flawless makeup for your special day",
  },
]

const categories = [
  { id: "all", name: "All Services" },
  { id: "nails", name: "Nail Artistry" },
  { id: "hair", name: "Hair Styling" },
  { id: "beauty", name: "Beauty Treatments" },
]

type ServiceSelectionProps = {
  selectedService: Service | null
  onSelect: (service: Service) => void
  onNext: () => void
}

export function ServiceSelection({ selectedService, onSelect, onNext }: ServiceSelectionProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredServices = activeCategory === "all" ? services : services.filter((s) => s.category === activeCategory)

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredServices.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={cn(
              "relative p-5 rounded-xl text-left transition-all duration-300 border-2",
              selectedService?.id === service.id
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/50 hover:shadow-md",
            )}
          >
            {/* Selected Indicator */}
            {selectedService?.id === service.id && (
              <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}

            <h3 className="font-medium text-foreground mb-1 pr-8">{service.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {service.duration} min
              </span>
              <span className="text-primary font-semibold">${service.price}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!selectedService}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

import { useState } from "react"
