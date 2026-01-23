import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ShopGrid } from "@/components/shop/shop-grid"

export const metadata = {
  title: "Shop | Luxe Beauty & Training",
  description:
    "Discover our curated collection of luxury beauty products. Premium nail care, hair treatments, and beauty essentials.",
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <ShopGrid />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
