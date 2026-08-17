"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, GraduationCap, Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react"

type DashboardStats = {
  totalProducts: number
  productsAddedThisMonth: number
  activeCourses: number
  pendingBookings: number
  confirmedBookings: number
  bookingsToday: number
  revenueFormatted: string
  revenueChangeLabel: string
  revenueTrend: "up" | "down"
}

type RecentBooking = {
  id: string
  clientName: string
  summary: string
  status: string
  confirmationNumber?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/dashboard/stats")
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
          setRecentBookings(data.recentBookings || [])
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = stats
    ? [
        {
          title: "Total Products",
          value: String(stats.totalProducts),
          change:
            stats.productsAddedThisMonth > 0
              ? `+${stats.productsAddedThisMonth} this month`
              : "No new products this month",
          icon: ShoppingBag,
          trend: stats.productsAddedThisMonth > 0 ? "up" : "neutral",
        },
        {
          title: "Active Courses",
          value: String(stats.activeCourses),
          change: stats.activeCourses === 1 ? "1 running" : `${stats.activeCourses} running`,
          icon: GraduationCap,
          trend: "neutral",
        },
        {
          title: "Confirmed Bookings",
          value: String(stats.confirmedBookings),
          change:
            stats.bookingsToday > 0
              ? `+${stats.bookingsToday} today`
              : stats.pendingBookings > 0
                ? `${stats.pendingBookings} pending`
                : "No bookings today",
          icon: Calendar,
          trend: stats.bookingsToday > 0 ? "up" : "neutral",
        },
        {
          title: "Revenue",
          value: stats.revenueFormatted,
          change: stats.revenueChangeLabel,
          icon: DollarSign,
          trend: stats.revenueTrend,
        },
      ]
    : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          cards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-primary" />}
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest appointments from your site</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No bookings yet.</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="font-medium">{booking.clientName}</p>
                      <p className="text-sm text-muted-foreground">{booking.summary}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-primary/10 text-primary"
                          : booking.status === "pending"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <p className="font-medium">Add New Product</p>
                <p className="text-sm text-muted-foreground">Create a new product listing</p>
              </Link>
              <Link
                href="/admin/courses"
                className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <p className="font-medium">Create Course</p>
                <p className="text-sm text-muted-foreground">Add a new training course</p>
              </Link>
              <Link
                href="/admin/bookings"
                className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <p className="font-medium">View All Bookings</p>
                <p className="text-sm text-muted-foreground">Manage appointments</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
