"use client"

import Link from "next/link"
import { Instagram, Facebook, MessageCircle, MapPin, Clock, Phone, Mail } from "lucide-react"

const footerLinks = {
  services: [
    { label: "Nail Artistry", href: "/services#nails" },
    { label: "Hair Styling", href: "/services#hair" },
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-medium text-secondary-foreground">Luxe Beauty & Training</span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-6">
              A sanctuary of luxury beauty where artistry meets elegance. Experience the finest in nail, hair, and
              beauty services.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
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
                  123 Luxury Avenue
                  <br />
                  New York, NY 10001
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
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-3 text-sm text-secondary-foreground/70">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>hello@luxebeauty.com</span>
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
        href="https://wa.me/15551234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 lg:bottom-6 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </footer>
  )
}
