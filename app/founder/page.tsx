import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { FounderHero } from "@/components/founder/founder-hero"
import { FounderStory } from "@/components/founder/founder-story"
import { FounderPhilosophy } from "@/components/founder/founder-philosophy"
import { BookingCtaSection } from "@/components/booking-cta-section"

export const metadata = {
  title: "Meet the Founder | Luxe Beauty & Training",
  description: "Discover the story behind Luxe Beauty & Training and meet Ioana Andreiana, our founder and creative director.",
}

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <FounderHero />
        <FounderStory />
        <FounderPhilosophy />
        <BookingCtaSection />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
