import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ContactContent } from "@/components/contact/contact-content"

export const metadata = {
  title: "Contact | Luxe Beauty & Training",
  description: "Get in touch with Luxe Beauty & Training. Visit our luxury beauty studio or reach out for inquiries.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <ContactContent />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
