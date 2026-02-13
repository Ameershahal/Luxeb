"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, ShoppingBag, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/booking", icon: Calendar, label: "Book" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/contact", icon: Phone, label: "Contact" },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden pb-[env(safe-area-inset-bottom)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-300 relative",
                "hover:scale-110 active:scale-95",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-300",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
                isActive && "font-semibold"
              )}>{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
