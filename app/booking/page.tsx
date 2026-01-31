import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { BookingWizard } from "@/components/booking/booking-wizard"

export const metadata = {
  title: "Book Appointment | Luxe Beauty & Training",
  description:
    "Schedule your luxury beauty experience at Luxe Beauty & Training. Choose from nail artistry and premium beauty treatments.",
}

function BookingWizardFallback() {
  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-3">Book Your Experience</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground text-balance">
            Schedule Your <span className="italic">Appointment</span>
          </h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">Loading booking form...</div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={<BookingWizardFallback />}>
          <BookingWizard />
        </Suspense>
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
