import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Luxe Beauty & Training | Luxury Beauty & Nail Studio",
  description:
    "Experience the art of beauty at Luxe Beauty & Training. Premium nail services, hair styling, and curated beauty products in an intimate, luxurious setting.",
  keywords: ["luxury beauty salon", "nail studio", "hair styling", "beauty products", "premium beauty services"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#F9DFDF",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
