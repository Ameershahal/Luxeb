"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackToTop() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const button = (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-20 sm:bottom-24 left-4 sm:left-6 lg:bottom-6 lg:left-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-primary-foreground shadow-lg z-[60] hover:scale-110 active:scale-95 hover:bg-primary/90 transition-transform"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
    </Button>
  )

  if (!mounted || typeof document === "undefined") return null
  return createPortal(button, document.body)
}
