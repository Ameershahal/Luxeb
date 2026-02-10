"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Clock, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ServiceSize = { size: string; price: number }
type ServiceSubService = { name: string; price: number }

type Service = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  description: string
  sizes?: ServiceSize[]
  subServices?: ServiceSubService[]
}

/** Selected service with resolved price (and optional size / sub-service when applicable). */
export type SelectedService = {
  id: string
  name: string
  category: string
  duration: number
  price: number
  size?: string
  subServiceName?: string
}

/** Match URL slug (e.g. from home page links) to API category value. */
function categoryMatchesSlug(category: string, slug: string): boolean {
  const cat = category.trim().toLowerCase()
  const s = slug.trim().toLowerCase()
  if (s === "nails") return cat === "nails" || /manicure/i.test(cat)
  if (s === "pedicure") return /pedicure|foot|feet/i.test(cat)
  if (s === "treatments") return /treatments|treatment|beauty/i.test(cat)
  return cat === s
}

type ServiceSelectionProps = {
  selectedCategoryId: string
  selectedServices: SelectedService[]
  onSelect: (services: SelectedService[]) => void
  onNext: () => void
  onBack: () => void
  preselectServiceName?: string | null
}

export function ServiceSelection({
  selectedCategoryId,
  selectedServices,
  onSelect,
  onNext,
  onBack,
  preselectServiceName,
}: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollToServiceId, setScrollToServiceId] = useState<string | null>(null)
  const preselectApplied = useRef(false)
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (!preselectServiceName || preselectApplied.current || !services.length) return
    let decoded: string
    try {
      decoded = decodeURIComponent(preselectServiceName)
    } catch {
      return
    }
    const filtered = services.filter((s) => categoryMatchesSlug(s.category, selectedCategoryId))
    const match = filtered.find((s) => s.name.trim().toLowerCase() === decoded.trim().toLowerCase())
    if (match) {
      preselectApplied.current = true
      const hasSubs = match.subServices && match.subServices.length > 0
      if (hasSubs) {
        const first = match.subServices![0]
        onSelect([{ id: match.id, name: `${match.name} - ${first.name}`, category: match.category, duration: match.duration, price: first.price, subServiceName: first.name }])
      } else {
        const hasSizes = match.sizes && match.sizes.length > 0
        const size = hasSizes ? match.sizes![0].size : undefined
        const sizeOption = hasSizes && size ? match.sizes!.find((s) => s.size === size) : null
        const price = sizeOption ? sizeOption.price : match.price
        onSelect([{ id: match.id, name: match.name, category: match.category, duration: match.duration, price, ...(size && { size }) }])
      }
      setScrollToServiceId(match.id)
    }
  }, [services, selectedCategoryId, preselectServiceName, onSelect])

  useEffect(() => {
    if (!scrollToServiceId) return
    const timer = setTimeout(() => {
      if (scrollTargetRef.current) {
        scrollTargetRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      setScrollToServiceId(null)
    }, 150)
    return () => clearTimeout(timer)
  }, [scrollToServiceId])

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

  const filteredServices = services.filter((s) => categoryMatchesSlug(s.category, selectedCategoryId))

  const hasSubServices = (s: Service) => s.subServices && s.subServices.length > 0

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
    if (hasSubServices(service)) return
    const isSelected = selectedServices.some((s) => s.id === service.id && !s.subServiceName)
    if (isSelected) {
      onSelect(selectedServices.filter((s) => !(s.id === service.id && !s.subServiceName)))
      return
    }
    const hasSizes = service.sizes && service.sizes.length > 0
    const size = hasSizes ? (chosenSize || service.sizes![0].size) : undefined
    const newEntry = resolveSelectedService(service, size)
    onSelect([...selectedServices, newEntry])
  }

  const toggleSubService = (service: Service, sub: ServiceSubService) => {
    const isSelected = selectedServices.some((s) => s.id === service.id && s.subServiceName === sub.name)
    if (isSelected) {
      onSelect(selectedServices.filter((s) => !(s.id === service.id && s.subServiceName === sub.name)))
      return
    }
    const newEntry: SelectedService = {
      id: service.id,
      name: `${service.name} - ${sub.name}`,
      category: service.category,
      duration: service.duration,
      price: sub.price,
      subServiceName: sub.name,
    }
    onSelect([...selectedServices, newEntry])
  }

  const setSelectedServiceSize = (serviceId: string, size: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (!service || !service.sizes?.length) return
    const option = service.sizes.find((s) => s.size === size)
    if (!option) return
    const updated = selectedServices.map((s) =>
      s.id === serviceId && !s.subServiceName ? { ...s, size, price: option.price } : s
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
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">No services available in this category at the moment.</p>
          <p className="text-sm text-muted-foreground">Use <strong>Back</strong> to choose a different category, or ask the salon to add services for this category in the admin.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {filteredServices.map((service) => {
            const hasSubs = hasSubServices(service)
            const selectedSubs = selectedServices.filter((s) => s.id === service.id && s.subServiceName)
            const isSelected = hasSubs
              ? selectedSubs.length > 0
              : selectedServices.some((s) => s.id === service.id && !s.subServiceName)
            const selectedEntry = selectedServices.find((s) => s.id === service.id && !s.subServiceName)
            const hasSizes = service.sizes && service.sizes.length > 0
            const displayPrice = hasSizes
              ? isSelected && selectedEntry?.price != null
                ? selectedEntry.price
                : Math.min(...service.sizes!.map((s) => s.price))
              : hasSubs
                ? (service.subServices!.length ? `From £${Math.min(...service.subServices!.map((s) => s.price))}` : "—")
                : service.price
            const priceLabel = (hasSizes || hasSubs) && !isSelected ? (typeof displayPrice === 'string' ? displayPrice : `£${displayPrice}`) : (typeof displayPrice === 'number' ? `£${displayPrice}` : displayPrice)

            return (
              <div
                key={service.id}
                ref={service.id === scrollToServiceId ? scrollTargetRef : undefined}
                className={cn(
                  "relative p-4 sm:p-5 rounded-xl text-left transition-all duration-300 border-2 min-h-[120px]",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md",
                )}
              >
                {!hasSubs ? (
                  <button
                    type="button"
                    className="absolute inset-0 rounded-xl z-0 w-full h-full cursor-pointer"
                    onClick={() => toggleService(service)}
                    aria-pressed={isSelected}
                    aria-label={`Select ${service.name}`}
                  />
                ) : null}
                {isSelected && !hasSubs && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary flex items-center justify-center z-10 pointer-events-none">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                )}

                <h3 className="font-medium text-sm sm:text-base text-foreground mb-1 pr-6 sm:pr-8 relative z-10 pointer-events-none">{service.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 relative z-10 pointer-events-none">{service.description}</p>

                <div className="flex items-center gap-3 sm:gap-4 flex-wrap relative z-10 pointer-events-none">
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {typeof service.duration === 'number' ? `${service.duration} min` : service.duration}
                  </span>
                  {!hasSubs && <span className="text-primary font-semibold text-sm sm:text-base">{priceLabel}</span>}
                  {hasSubs && selectedSubs.length === 0 && <span className="text-primary font-semibold text-sm sm:text-base">{priceLabel}</span>}
                  {hasSubs && selectedSubs.length > 0 && (
                    <span className="text-primary font-semibold text-sm sm:text-base">
                      £{selectedSubs.reduce((sum, s) => sum + s.price, 0)} ({selectedSubs.length} selected)
                    </span>
                  )}
                </div>

                {isSelected && hasSizes && (
                  <div className="mt-3 flex flex-wrap gap-2 relative z-10 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
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

                {hasSubs && (
                  <div className="mt-3 space-y-2 relative z-10 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <p className="text-xs text-muted-foreground font-medium">Choose option(s):</p>
                    <div className="flex flex-wrap gap-2">
                      {service.subServices!.map((sub) => {
                        const subSelected = selectedServices.some((s) => s.id === service.id && s.subServiceName === sub.name)
                        return (
                          <button
                            key={sub.name}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleSubService(service, sub)
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1",
                              subSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80 text-foreground"
                            )}
                          >
                            {subSelected && <Check className="h-3 w-3" />}
                            {sub.name} — £{sub.price}
                          </button>
                        )
                      })}
                    </div>
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
          disabled={selectedServices.length === 0 || filteredServices.length === 0}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
        >
          Continue to stylist
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
