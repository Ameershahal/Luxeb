import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { BookingWizard } from "@/components/booking/booking-wizard"

export const metadata = {
  title: "Book Appointment | Luxe Beauty & Training",
  description:
    "Schedule your luxury beauty experience at Luxe Beauty & Training. Choose from nail artistry, hair styling, and premium beauty treatments.",
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <BookingWizard />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
