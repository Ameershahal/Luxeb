"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        "fixed bottom-20 sm:bottom-24 left-4 sm:left-6 lg:left-auto lg:right-8 lg:bottom-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-primary-foreground shadow-lg z-40 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-primary/90 ripple-effect",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
    </Button>
  )
}
