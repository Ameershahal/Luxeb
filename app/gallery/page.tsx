import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GalleryGrid } from "@/components/gallery/gallery-grid"

export const metadata = {
  title: "Gallery | Luxe Beauty & Training",
  description: "Explore our portfolio of stunning nail art and beauty work at Luxe Beauty & Training.",
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <GalleryGrid />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
