"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Clock, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ServiceSize = { size: string; price: number }

type Service = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  description: string
  sizes?: ServiceSize[]
}

/** Selected service with resolved price (and optional size when service has sizes). */
export type SelectedService = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  size?: string
}

type ServiceSelectionProps = {
  selectedCategoryId: string
  selectedServices: SelectedService[]
  onSelect: (services: SelectedService[]) => void
  onNext: () => void
  onBack: () => void
}

export function ServiceSelection({
  selectedCategoryId,
  selectedServices,
  onSelect,
  onNext,
  onBack,
}: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([])
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
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServices = services.filter((s) => s.category === selectedCategoryId)

  const resolveSelectedService = (service: Service, size?: string): SelectedService => {
    const hasSizes = service.sizes && service.sizes.length > 0
    const sizeOption = hasSizes && size ? service.sizes!.find((s) => s.size === size) : null
    const price = sizeOption ? sizeOption.price : service.price
    return {
      id: service.id,
      name: service.name,
      category: service.category,
      duration: service.duration,
      price,
      ...(size && { size }),
    }
  }

  const toggleService = (service: Service, chosenSize?: string) => {
    const isSelected = selectedServices.some((s) => s.id === service.id)
    if (isSelected) {
      onSelect(selectedServices.filter((s) => s.id !== service.id))
      return
    }
    const hasSizes = service.sizes && service.sizes.length > 0
    const size = hasSizes ? (chosenSize || service.sizes![0].size) : undefined
    const newEntry = resolveSelectedService(service, size)
    onSelect([...selectedServices, newEntry])
  }

  const setSelectedServiceSize = (serviceId: string, size: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (!service || !service.sizes?.length) return
    const option = service.sizes.find((s) => s.size === size)
    if (!option) return
    const updated = selectedServices.map((s) =>
      s.id === serviceId ? { ...s, size, price: option.price } : s
    )
    onSelect(updated)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <p className="text-center text-muted-foreground text-sm sm:text-base">
        Select one or more services. You can add multiple from this category.
      </p>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {filteredServices.map((service) => {
            const isSelected = selectedServices.some((s) => s.id === service.id)
            const selectedEntry = selectedServices.find((s) => s.id === service.id)
            const hasSizes = service.sizes && service.sizes.length > 0
            const displayPrice = hasSizes
              ? isSelected && selectedEntry?.price != null
                ? selectedEntry.price
                : Math.min(...service.sizes!.map((s) => s.price))
              : service.price
            const priceLabel = hasSizes && !isSelected ? `From £${displayPrice}` : `£${displayPrice}`

            return (
              <div
                key={service.id}
                className={cn(
                  "relative p-4 sm:p-5 rounded-xl text-left transition-all duration-300 border-2 min-h-[120px]",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md",
                )}
              >
                <button
                  type="button"
                  className="absolute inset-0 rounded-xl text-left z-0"
                  onClick={() => toggleService(service)}
                  aria-pressed={isSelected}
                />
                {isSelected && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary flex items-center justify-center z-10">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                )}

                <h3 className="font-medium text-sm sm:text-base text-foreground mb-1 pr-6 sm:pr-8 relative z-10">{service.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 relative z-10">{service.description}</p>

                <div className="flex items-center gap-3 sm:gap-4 flex-wrap relative z-10">
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {typeof service.duration === 'number' ? `${service.duration} min` : service.duration}
                  </span>
                  <span className="text-primary font-semibold text-sm sm:text-base">{priceLabel}</span>
                </div>

                {isSelected && hasSizes && (
                  <div className="mt-3 flex flex-wrap gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                    {service.sizes!.map((opt) => (
                      <button
                        key={opt.size}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedServiceSize(service.id, opt.size)
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          selectedEntry?.size === opt.size
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        )}
                      >
                        {opt.size} — £{opt.price}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {selectedServices.length > 0 && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected • £
          {selectedServices.reduce((sum, s) => sum + s.price, 0)} total
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto rounded-full px-5 sm:px-6 h-11 sm:h-12 bg-transparent text-sm sm:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedServices.length === 0}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
        >
          Continue to stylist
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
