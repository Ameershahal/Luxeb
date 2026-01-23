import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ServicesHero } from "@/components/services/services-hero"
import { ServicesDetail } from "@/components/services/services-detail"
import { BookingCtaSection } from "@/components/booking-cta-section"

export const metadata = {
  title: "Services | Luxe Beauty & Training",
  description:
    "Explore our full range of luxury beauty services including nail artistry, hair styling, and beauty treatments.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <ServicesHero />
        <ServicesDetail />
        <BookingCtaSection />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
