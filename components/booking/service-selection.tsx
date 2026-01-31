"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Service = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  description: string
}

type ServiceSelectionProps = {
  selectedService: Service | null
  onSelect: (service: Service) => void
  onNext: () => void
}

export function ServiceSelection({ selectedService, onSelect, onNext }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/services")
      const data = await response.json()
      
      if (data.success) {
        setServices(data.services || [])
        
        // Generate categories from services
        const uniqueCategories = new Set<string>()
        data.services?.forEach((service: Service) => {
          uniqueCategories.add(service.category)
        })
        
        // Create category list with "All Services" first
        const categoryList = [
          { id: "all", name: "All Services" },
          ...Array.from(uniqueCategories).map((cat) => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
          })),
        ]
        setCategories(categoryList)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServices = activeCategory === "all" ? services : services.filter((s) => s.category === activeCategory)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all min-h-[44px]",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {filteredServices.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={cn(
              "relative p-4 sm:p-5 rounded-xl text-left transition-all duration-300 border-2 min-h-[120px]",
              selectedService?.id === service.id
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/50 hover:shadow-md",
            )}
          >
            {/* Selected Indicator */}
            {selectedService?.id === service.id && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
            )}

            <h3 className="font-medium text-sm sm:text-base text-foreground mb-1 pr-6 sm:pr-8">{service.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{service.description}</p>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                {service.duration} min
              </span>
              <span className="text-primary font-semibold text-sm sm:text-base">£{service.price}</span>
            </div>
          </button>
        ))}
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!selectedService}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
        >
          Continue
          <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}
