import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FounderPhotosSection } from "@/components/founder-photos-section"
import { ServicesSection } from "@/components/services-section"
import { ProductsBento } from "@/components/products-bento"
import { CoursesSection } from "@/components/courses-section"
import { TransformationGallery } from "@/components/transformation-gallery"
import { FounderSection } from "@/components/founder-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BookingCtaSection } from "@/components/booking-cta-section"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ScrollProgress } from "@/components/scroll-progress"
import { BackToTop } from "@/components/back-to-top"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <FounderPhotosSection />
      <ServicesSection />
      <ProductsBento />
      <CoursesSection />
      <TransformationGallery />
      <FounderSection />
      <TestimonialsSection />
      <BookingCtaSection />
      <Footer />
      <MobileBottomNav />
      <BackToTop />
    </main>
  )
}
