"use client"

import Link from "next/link"
import { Instagram, Facebook, MessageCircle, MapPin, Clock, Phone, Mail } from "lucide-react"

const footerLinks = {
  services: [
    { label: "Nail Artistry", href: "/services#nails" },
    { label: "Beauty Treatments", href: "/services#beauty" },
    { label: "Bridal Packages", href: "/services#bridal" },
  ],
  company: [
    { label: "About Us", href: "/founder" },
    { label: "Gallery", href: "/gallery" },
    { label: "Careers", href: "/careers" },
    { label: "Gift Cards", href: "/gift-cards" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 sm:mb-6">
              <span className="font-serif text-xl sm:text-2xl font-medium text-secondary-foreground">Luxe Beauty & Training</span>
            </Link>
            <p className="text-secondary-foreground/70 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              A sanctuary of luxury beauty where artistry meets elegance. Experience the finest in nail artistry and
              beauty services.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4">
              <a
                href="#"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-medium text-secondary-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-medium text-secondary-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-medium text-secondary-foreground mb-4">Visit Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-secondary-foreground/70">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>
                  142C Shaw Heath
                  <br />
                  Stockport, Greater Manchester
                  <br />
                  SK2 6QS
                </span>
              </li>
              <li className="flex gap-3 text-sm text-secondary-foreground/70">
                <Clock className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>
                  Mon - Sat: 9am - 8pm
                  <br />
                  Sun: 10am - 6pm
                </span>
              </li>
              <li className="flex gap-3 text-sm text-secondary-foreground/70">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>+44 7450 239432</span>
              </li>
              <li className="flex gap-3 text-xs sm:text-sm text-secondary-foreground/70">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-primary mt-0.5" />
                <span className="break-all">info@luxebeautyandtrainingacademy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary-foreground/50">
            © {new Date().getFullYear()} Luxe Beauty & Training. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-secondary-foreground/50 hover:text-secondary-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/447450239432"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 lg:bottom-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </footer>
  )
}
