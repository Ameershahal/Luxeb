"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = {
  id: number
  name: string
  description: string
}

type BookingProgressProps = {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function BookingProgress({ steps, currentStep, onStepClick }: BookingProgressProps) {
  return (
    <nav aria-label="Progress" className="relative">
      {/* Desktop Progress */}
      <ol className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.id} className="flex-1 relative">
            <button
              onClick={() => onStepClick(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                "group flex flex-col items-center w-full",
                step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed",
              )}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  step.id < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.id === currentStep
                      ? "border-primary bg-background text-primary"
                      : "border-border bg-background text-muted-foreground",
                )}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    step.id <= currentStep ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.name}
                </p>
              </div>
            </button>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    step.id < currentStep ? "bg-primary" : "bg-border",
                  )}
                />
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-foreground">{steps[currentStep - 1].name}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  )
}
