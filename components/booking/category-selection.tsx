"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type CategoryOption = {
  id: string
  name: string
  description?: string
}

type CategorySelectionProps = {
  selectedCategoryId: string | null
  onSelect: (categoryId: string) => void
  onNext: () => void
}

function formatCategoryName(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function CategoryIcon({ categoryId }: { categoryId: string }) {
  const id = categoryId.toLowerCase()
  const imgClass = "h-9 w-9 object-contain"
  const imgSize = 36
  if (id === "manicure" || id === "nails") {
    return (
      <img
        src="/manicure.png"
        alt="Manicure"
        className={imgClass}
        width={imgSize}
        height={imgSize}
      />
    )
  }
  if (id === "pedicure" || id === "feet") {
    return (
      <img
        src="/pedicure.png"
        alt="Pedicure"
        className={imgClass}
        width={imgSize}
        height={imgSize}
      />
    )
  }
  if (id === "treatment" || id === "treatments") {
    return (
      <img
        src="/treatment.png"
        alt="Treatment"
        className={imgClass}
        width={imgSize}
        height={imgSize}
      />
    )
  }
  return <Sparkles className="h-9 w-9" />
}

export function CategorySelection({
  selectedCategoryId,
  onSelect,
  onNext,
}: CategorySelectionProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/services")
        const data = await res.json()
        if (data.success && Array.isArray(data.services)) {
          const seen = new Set<string>()
          const list: CategoryOption[] = []
          for (const s of data.services) {
            const cat = s.category || "other"
            if (!seen.has(cat)) {
              seen.add(cat)
              list.push({
                id: cat,
                name: formatCategoryName(cat),
              })
            }
          }
          setCategories(list.sort((a, b) => a.name.localeCompare(b.name)))
        }
      } catch (e) {
        console.error(e)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading categories…</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No service categories available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <p className="text-center text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
        Choose the type of experience you’re looking for. You’ll then pick specific services in the next step.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={cn(
                "group relative flex items-center gap-4 rounded-2xl border-2 p-5 sm:p-6 text-left transition-all duration-300 min-h-[100px]",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md",
              )}
            >
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20",
                )}
              >
                <CategoryIcon categoryId={cat.id} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-serif text-lg font-medium text-foreground">{cat.name}</span>
                {cat.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">✓</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          disabled={!selectedCategoryId}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
        >
          Continue to services
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
