import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { CoursesSection } from "@/components/courses-section"

export const metadata = {
  title: "Courses | Luxe Beauty & Training",
  description:
    "Explore our professional beauty training courses. Learn nail artistry and makeup techniques from industry experts in our offline studio.",
}

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <CoursesSection showAll />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
